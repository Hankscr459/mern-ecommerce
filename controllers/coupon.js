const Coupon = require('../models/coupon')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.couponById = (req, res, next, id) => {
    Coupon.findById(id)
        .exec((err, coupon) => {
            if (err || ! coupon) {
                return res.status(400).json({
                    error: 'Coupon does not exist'
                })
            }
            req.coupon = coupon;
            next();
        })
}

exports.createCoupon = (req, res) => {
    // console.log("req.body", req.body);
    const coupon = new Coupon(req.body)
    coupon.save((err, coupon) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
                // error: 'Coupon is invaild'
            });
        }
        
        res.json({
            coupon
        })
    })
}

exports.read = (req, res) => {
    return res.json(req.coupon)
}

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Coupon.find()
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, coupons) => {
            if(err) {
                return res.status(400).json({
                    error: 'Coupon not found'
                })
            }
            res.json(coupons)
        })
}

exports.active = (req, res) => {
    let code = req.query.code 
    console.log(code)
    Coupon.findOne({ code })
        .exec((err, coupon) => {
            if (err || ! coupon) {
                return res.status(400).json({
                    error: 'Coupon is invaild'
                })
            }
            if (coupon.expireDate <= Date.now()) {
                return res.status(400).json({
                    error: 'Coupon is Outdate'
                })
            }
            if (coupon.isActive === false) {
                return res.status(400).json({
                    error: 'Coupon is not Active yet.'
                })
            }

            res.json(coupon)
        })
}

exports.update = (req, res) => {
    console.log(req.coupon._id)
    Coupon.findOneAndUpdate(
        { _id: req.coupon._id },
        { $set: req.body },
        { new: true },
        (err, coupon) => {
            if (err) {
                return res.status(400).json({
                    error: 'You are not authorized to perform this action'
                })
            }
            console.log(coupon)
            console.log('req.body', req.body)

            res.json(coupon)
        }
    )
}

exports.remove = (req, res) => {
    let coupon = req.coupon
    coupon.remove((err, deleteCoupon) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            // deleteCoupon,
            message: 'Product deleted successfully'
        })
    })
}