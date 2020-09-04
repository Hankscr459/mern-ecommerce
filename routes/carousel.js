const express = require('express');
const router = express.Router();

const { 
    create, 
    list,
    carouselById,
    read,
    update,
    remove
} = require('../controllers/carousel')
const { userById } = require('../controllers/user')
const {
    requireSignin,
    isAuth,
    isAdmin
} = require('../controllers/auth')




router.post(
    '/carousel/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    create
)

router.put(
    '/carousel/update/:carouselId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    update
)

router.delete(
    '/carousel/remove/:carouselId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove
)

router.get(
    '/carousel',
    list
)

router.get(
    '/carousel/:carouselId',
    read
)

router.param('userId', userById)
router.param('carouselId', carouselById)

module.exports = router