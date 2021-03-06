const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler')
const multer = require('multer')

exports.productById = (req, res, next, id) => {
    Product.findById(id)
    .populate('category')
    .populate('user')
    .populate('reviews')
    .exec((err, product) => {
        
        if(err || !product) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        req.product = product
        next();
    })
}

exports.read = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

exports.postTempImg = (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
    })

}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions= true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        };

        // check for all fields
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping,
            images
        } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({
                error: 'All field are required'
            });
        };

        let product = new Product(fields)

        if(files.photo) {
            // console.log('FILES PHOTO: ', files.photo)
            if(files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            };
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        };
        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            };
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deleteProduct) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            // deleteProduct,
            message: 'Product deleted successfully'
        })
    })
}

exports.update = (req, res, id) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions= true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        };

        // check for all fields
        // const {
        //     name,
        //     description,
        //     price,
        //     category,
        //     quantity,
        //     shipping
        // } = fields;

        // if (
        //     !name ||
        //     !description ||
        //     !price ||
        //     !category||
        //     !quantity ||
        //     !shipping
        // ) {
        //     return res.status(400).json({
        //         error: 'All field are required'
        //     });
        // };

        let product = req.product
        //  first product itself second arg is update fields
        // product = _.extend(product, fields )
        product = _.assignIn(product, fields )

        if(files.photo) {
            // console.log('FILES PHOTO: ', files.photo)
            if(files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            };
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        };
        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            };
            res.json(result);
        });
    });
};

// sell / arrival
// by sell = /products?sortBy=sold&order=desc&limit=4
// by arrival = /products?sortBy=createdAt&order=dec&limit=4
// if no params are sent are, then all products are returned

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find()
        .populate('category')
        .populate("reviews")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if(err) {
                return res.status(400).json({
                    error: 'Product not found'
                })
            }
            res.json(products)
        })
}

// it will find the products based on the req product category
// other products that has the same categogry, will be returned

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    // we are finding all the products based on the category
    // that matters distinguished product category
    // $ne: this means not including and it dont include this product itself
    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .select('-photo')
    .limit(limit)
    .populate('category', '_id name')
    .populate("reviews")
    .exec((err, products) => {
        if(err) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        res.json(products)
    })
}

exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Products not found'
            })
        }
        res.json(categories)
    })
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 
// route - make sure its post
// router.post("/products/by/search", listBySearch);
 
exports.listBySearch = (req, res) => {
    
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    
    const sort = req.query.sortBy ? req.query.sortBy : "priceOrderByasc";
    const parts = sort.split('OrderBy')

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    if (typeof skip !== 'number') {
        skip === 0
    }
    console.log(findArgs)
    console.log( 'skip: ',skip)
    console.log( 'limit: ',limit)
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .populate("reviews")
        .sort([[parts[0], parts[1]]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {}
    // assign search value to query.name
    if(req.query.search) {
        query.name = {$regex: req.query.search, $options: 'i'}
        // asign category value to query.category
        if(req.query.category && req.query.category != 'All') {
            query.category = req.query.category
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(products)
        }).select('-photo')
    }
}

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return {
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    })
    // get bulkWrite() methods to pass bulkOps
    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if(error) {
            return res.status(400).json({
                error: 'Could not update product'
            })
        }
        next()
    })
}

exports.search = (req , res) => {
    const { search } = req.query
    console.log(search)
        
        Product.find({
            $or: [{name: {$regex: search, $options: 'i'}}, {description: {$regex: search, $options: 'i'}}]
        }, (err, products) => {
            if(err) {
                return res.status(400).json({
                    // error: errorHandler(err)
                    error: 'Search not found'
                })
            }
            res.json(products)
        })
        .select('-photo')
        .populate('category', '_id name')
        .populate("reviews")
}