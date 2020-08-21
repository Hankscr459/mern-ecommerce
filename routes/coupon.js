const express = require('express')
const router = express.Router()

const { 
    createCoupon, 
    couponById, 
    read, 
    list, 
    active,
    update,
    remove
} = require('../controllers/coupon')
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

router.put(
    '/coupon/:couponId/:userId',
    couponCodeValidator, 
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.get(
    '/coupon/:couponId',
    read
);

router.get(
    '/coupons',
    list
);

router.post(
    '/coupon/active',
    active
);

router.delete(
    '/coupon/:couponId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove
)

router.param('userId', userById)
router.param('couponId', couponById)

module.exports = router;