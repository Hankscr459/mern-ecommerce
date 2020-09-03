const express = require('express');
const router = express.Router();
// const { ImgUpload } = require('../controllers/cloudinary')
const { create } = require('../controllers/carousel')
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

router.param('userId', userById)

module.exports = router