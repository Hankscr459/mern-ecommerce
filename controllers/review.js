const Product = require('../models/product')
const Review = require('../models/review')

exports.create = async (req, res) => {
    try {
      const review = new Review();
      review.headline = req.body.headline;
      review.body = req.body.body;
      review.rating = req.body.rating;
      review.user = req.params.userId;
      review.postBy = req.body.postBy;
      review.productID = req.params.productId;

      await Product.findOneAndUpdate(
        { _id: req.params.productId },
        { $push: { reviews: review._id } },
        { new: true }
      )

      await review.save((err, review) => {
            if (err) {
                // console.log('review._id err', review._id)
                return res.status(400).json({
                    error: 'Review is taken'
                });
                
            }
            res.json(review)
        }
      )


    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

exports.read = async (req, res) => {
  try {
    const productReviews = await Review.find({
      productID: req.params.productId
    })
      .populate('user')
      .exec();

    res.json({
      success: true,
      reviews: productReviews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}