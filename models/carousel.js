const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            default: "https://mern-eco-frontend.herokuapp.com/"
        },
        photoUrl: {
            type: String,
            required: true
        },
        photoId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Carousel', carouselSchema);