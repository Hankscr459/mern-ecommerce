const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            required: true
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        quantity: {
            type: Number
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        images: {
            type: String
        },
        shipping: {
            required: false,
            type: Boolean
        },
        reviews: [{ type: ObjectId, ref: "Review" }]
    },
    { timestamps: true }
);

mongoose.set('toJSON', { virtuals: true })

productSchema
    .virtual('averageRating')
    .get(function() {
        if (this.reviews.length > 0) {
        let sum = this.reviews.reduce((total, review) => {
            return total + review.rating;
        }, 0);
        return sum / this.reviews.length;
        }
    
        return 0;
    });

productSchema
    .virtual('fiveStar')
    .get(function() {
        if (this.reviews.length > 0) {
            const ratings = this.reviews.map(r => r.rating)
            const filtrerStar = ratings.filter(r => r === 5)
        return filtrerStar.length;
        }

        return 0;
    });

productSchema
    .virtual('fourStar')
    .get(function() {
        if (this.reviews.length > 0) {
            const ratings = this.reviews.map(r => r.rating)
            const filtrerStar = ratings.filter(r => r === 4)
        return filtrerStar.length;
        }

        return 0;
    });
productSchema
    .virtual('threeStar')
    .get(function() {
        if (this.reviews.length > 0) {
            const ratings = this.reviews.map(r => r.rating)
            const filtrerStar = ratings.filter(r => r === 3)
        return filtrerStar.length;
        }

        return 0;
    });
productSchema
    .virtual('twoStar')
    .get(function() {
        if (this.reviews.length > 0) {
            const ratings = this.reviews.map(r => r.rating)
            const filtrerStar = ratings.filter(r => r === 2)
        return filtrerStar.length;
        }

        return 0;
    });
productSchema
    .virtual('oneStar')
    .get(function() {
        if (this.reviews.length > 0) {
            const ratings = this.reviews.map(r => r.rating)
            const filtrerStar = ratings.filter(r => r === 1)
        return filtrerStar.length;
        }

        return 0;
    });

module.exports = mongoose.model('Product', productSchema);