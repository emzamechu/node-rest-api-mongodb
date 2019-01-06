const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

//Define Storage strategy for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null,new Date().toISOString() + file.originalname);
    }
})

//File Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('File format not supported'), false);
    }
}

const upload = multer({
    storage : storage, 
    limits:{
        fileSize: 1024 * 1024 * 30
    },
    fileFilter: fileFilter
});


const Product = require('../models/product');
const VerifyAuth = require('../middleware/verify-auth');

const ProductsController = require('../controllers/Products');

//Get all products
router.get('/', ProductsController.get_all_products);

//add new product
router.post('/', VerifyAuth, upload.single('productImage'), ProductsController.add_new_product);

//Get specific product details
router.get('/:id', ProductsController.get_product_by_id);

//Update specific product details
router.patch('/:id', VerifyAuth, ProductsController.update_product);

//Delete specific product
router.delete('/:id',VerifyAuth, ProductsController.delete_product);

module.exports = router;