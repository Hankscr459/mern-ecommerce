const Carousel = require('../models/carousel')
const { errorHandler } = require('../helpers/dbErrorHandler')

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