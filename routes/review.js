const express = require('express');
const router = express.Router();

const { userById } = require('../controllers/user')
const { productById } = require('../controllers/product')
const { 
    requireSignin, 
    isAuth, 
    isAdmin 
} = require('../controllers/auth')
const { reviewValidator } = require('../validator')

const { create, read } = require('../controllers/review')

router.post(
    '/review/:productId/:userId',
    requireSignin,
    isAuth,
    reviewValidator,
    create
)

router.get(
    '/reviews/:productId',
    read
)

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;