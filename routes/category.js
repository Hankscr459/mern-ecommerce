const express = require('express');
const router = express.Router();

const { create, categoryById, read, readProduct, update, remove, list } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post(
    '/category/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    create
);

router.put(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.delete(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove
);

router.get('/categories', list);

router.get('/category/:categoryId', read);
router.get('/shop/:categoryId', readProduct);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;