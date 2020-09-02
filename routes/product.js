const express = require('express');
const router = express.Router();

const {
    create,
    productById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    listSearch,
    photo,
    search,
    postTempImg
} = require('../controllers/product');
const { postImg, ImgUpload } = require('../controllers/cloudinary')
const {
    requireSignin,
    isAuth,
    isAdmin
} = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/product/:productId', read)
router.post(
    '/product/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    create
)
router.delete(
    '/product/:productId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove
)
router.put(
    '/product/:productId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    update
)

router.post('/products/TempImg', postTempImg)
router.post('/products/postImg', postImg)
router.post('/products/ImgUpload', ImgUpload)

router.get('/products', list)
router.get('/products/search', listSearch)
router.get('/products/find', search)
router.get('/products/related/:productId', listRelated)
router.get('/products/categories', listCategories)
router.post('/products/by/search', listBySearch)
router.get('/product/photo/:productId', photo)

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;