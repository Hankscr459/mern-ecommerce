const Carousel = require('../models/carousel')
const { errorHandler } = require('../helpers/dbErrorHandler')
const { removeImg } = require('./cloudinary')


exports.carouselById = (req, res, next, id) => {
    Carousel.findById(id)
        .exec((err, carousel) => {
            if (err || ! carousel) {
                return res.status(400).json({
                    error: 'Carousel does not exist'
                })
            }
            req.carousel = carousel;
            next();
        })
}

exports.read = (req, res) => {
    return res.json(req.carousel)
}

exports.create = (req, res) => {
    const carousel = new Carousel(req.body)
    carousel.save((err, data) => {
        if (err) {
            return res.status(400).json({
                // error: errorHandler(err)
                error: err
            })
        }
        res.json({ data });
    })
}

exports.list = (req, res) => {
    Carousel.find().exec((err, data) =>{
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.update = (req, res) => {
    Carousel.findOneAndUpdate(
        { _id: req.carousel._id },
        { $set: req.body },
        { new: true },
        (err, carousel) => {
            if (err) {
                return res.status(400).json({
                    error: 'You are not authorized to perform this action'
                })
            }
            
            res.json(carousel)
        }
    )
}

exports.remove = (req, res) => {
    const carousel = req.carousel
    removeImg(req.carousel.photoId)
    carousel.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: 'Carousel deleted'
        })
    })
}