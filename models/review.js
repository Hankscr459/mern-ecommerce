const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema

const reviewSchema = new mongoose.Schema(
    {
        headline: String,
        body: String,
        rating: Number,
        productID: { type: ObjectId, ref: "Product" },
        user: { 
            type: ObjectId, 
            ref: "User"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);