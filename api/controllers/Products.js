const mongoose = require('mongoose');
// const multer = require('multer');

const Product = require('../models/product');

module.exports = {
    get_all_products : (req, res, next)=>{
        //Get all products from MongoDB
        Product.find({})
               .select('name price _id productImage')
               .exec()
               .then(docs => {
                   if (docs) {
                        res.status(200);
                        res.json(
                            {
                                count:docs.length,
                                products: docs.map(doc => {
                                    return {
                                        name:doc.name,
                                        price:doc.price,
                                        productImage:doc.productImage,
                                        id: doc._id,
                                        request:{
                                            type:"GET",
                                            url:"http://localhost:3000/products/"+doc._id
                                        }
                                    }
                                })
                            }
                        );
                   } else {
                        res.status(404).json({Message:"No product entries found!"});
                   }
               })
               .catch(err => {
                    res.status(500).json({ErrorMessage:"Error finding products from DB" + err});
               });
    },

    add_new_product : (req, res, next)=>{
        //New Instance of product to Save
        //console.log(req.file);
        const product = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                price: req.body.price,
                productImage: req.file.path
            });
        product.save()
               .then(result => {
                    console.log('New Product saved successfully: '+result);
                    res.status(201);
                    res.json(
                        {
                            Message:"New Product saved successfully",
                            createdProduct: {
                                name:result.name,
                                price:result.price,
                                productImage:result.productImage,
                                id: result._id,
                                request:{
                                    type:"GET",
                                    url:"http://localhost:3000/products/"+result._id
                                }
                            }
                        }
                    );
                })
               .catch(err => {
                    console.log('There was an error saving the Product!: '+err);
                    res.status(500).json({ErrorMessage:"Error saving product to DB",error: err});
                });
    },

    get_product_by_id : (req, res,next)=>{
        const id = req.params.id;
        //Get Product from DB by ID
        Product.findById(id)
               .select('name price _id productImage')
               .exec()
               .then(doc =>{
                   console.log(doc);
                   if (doc) {
                        res.status(200).json({product: {
                            name:doc.name,
                            price:doc.price,
                            productImage:doc.productImage,
                            id: doc._id,
                            request:{
                                description: "Get all products",
                                type:"GET",
                                url:"http://localhost:3000/products/"
                            }
                        }});   
                   }else{
                    res.status(404).json({Message: `No valid entry found for ID: ${id}`});
                   }
               })
               .catch(err => {
                   console.log(err);
                   res.status(501).json({error:"Error finding product",error: err});
               })
    },

    update_product : (req, res,next)=>{
        const id = req.params.id;
        const updateOpsVals = {};
        for(const ops of req.body){
            updateOpsVals[ops.propName] = ops.value;
        }
        Product.updateOne({_id: id},{$set: updateOpsVals})
               .then(result =>{
                   console.log(`Product updated successfully ${result}`);
                   res.status(301);
                   res.json(
                       {
                           Message:"Product updated successfully",
                           updatedProduct: {
                                name:result.name,
                                price:result.price,
                                productImage:result.productImage,
                                id: result._id,
                                request:{
                                    type:"GET",
                                    description:"Get all products",
                                    url:"http://localhost:3000/products"
                                }
                            }
                        }
                    );
               })
               .catch(err => {
                   console.log(`Error updating product ${err}`);
                   res.status(500).json({ErrorMessage:`Error updating product ${err}`});
               });
    },

    delete_product : (req, res,next)=>{
        const id = req.params.id;
        //Delete Product
        Product.deleteOne({_id: id})
               .then(result => {
                   if (result) {
                        console.log(`Product deleted successfully ${result}`);
                        res.status(200);
                        res.json(
                            {
                                Message:"Product deleted successfully",
                                request:{
                                    type:"POST",
                                    description:"Add new Product",
                                    url:"http://localhost:3000/products",
                                    body:{name:"String", price:"Number"}
                                }
                            }
                        );
                   } else {
                        console.log('Product Not found');
                        res.status(404).json({Message:'Product Not found'});
                   }
               })
               .catch(err => {
                    console.log('Error deleting product' + err);
                    res.status(500).json({ErrorMessage: `Error deleting product ${err}`});
               });
    }
};