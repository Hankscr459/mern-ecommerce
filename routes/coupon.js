const express = require('express')
const router = express.Router()

const { createCoupon, couponById, read, list, active } = require('../controllers/coupon')
const { userById } = require('../controllers/user')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')

const { couponCodeValidator } = require('../validator')


router.post(
    '/coupon/create/:userId', 
    couponCodeValidator, 
    requireSignin,
    isAuth,
    isAdmin,
    createCoupon
);

router.get(
    '/coupon/:couponId',
    read
    // requireSignin,
    // isAuth
);

router.get(
    '/coupons',
    list
    // requireSignin,
    // isAuth
);

router.post(
    '/coupon/active',
    active
);

router.param('userId', userById)
router.param('couponId', couponById)

module.exports = router;