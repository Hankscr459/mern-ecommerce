const Category = require('../models/category');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id)
        .exec((err, category) => {
            if (err || ! category) {
                return res.status(400).json({
                    error: 'Category does not exist'
                })
            }
            req.category = category;
            next();
        })
}

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({ data });
    })
}

exports.read = (req, res) => {
    return res.json(req.category)
}

exports.update = (req, res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.readProduct = (req, res) => {
    const _id = req.params.categoryId

    Category.findOne({ _id }).exec((err, cat) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        // res.json(cat)
        Product.find({category: _id})
        .populate('category', '_id name')
        .select('_id name quantity description category sold price createdAt updatedAt')
        .exec((err, data) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({category: cat, products: data})
        })
    })
}

exports.remove = (req, res) => {
    const category = req.category
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: 'Category deleted'
        })
    })
}

exports.list = (req, res) => {
    Category.find().exec((err, data) =>{
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({data})
    })
}