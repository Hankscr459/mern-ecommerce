const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: true,
            maxlength: 32,
            minlength: 4
        },
        code: { 
            type: String, 
            require: true, 
            // unique: true,
            maxlength: 32,
            minlength: 4
        },
        isPercent: { 
            type: Boolean, 
            // require: true, 
            default: true 
        },
        amount: { 
            type: Number, 
            required: true,
            maxlength: 2,
            minlength: 2
        },
        expireDate: { 
            type: Date,
            // require: true, Date.now()
            default: Date.now()
        },
        isActive: { 
            type: Boolean, 
            // require: true, 
            default: true 
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Coupn', couponSchema);