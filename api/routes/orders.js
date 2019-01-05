const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


//Get all orders
router.get('/', (req, res, next)=>{
    Order.find()
         .select('_id product quantity')
         .populate('product','_id name')
         .exec()
         .then(docs => {
            if (docs) {
                res.status(200);
                res.json(
                    {
                        count:docs.length,
                        orders: docs.map(doc => {
                            return {
                                id: doc._id,
                                product: doc.product,
                                quantity:doc.quantity,
                                request:{
                                    type:"GET",
                                    url:"http://localhost:3000/orders/"+doc._id
                                }
                            }
                        })
                    }
                );
           } else {
                res.status(404).json({Message:"No Order entries found!"});
           }
         })
         .catch(err => {
                res.status(500).json({ErrorMessage:"Error finding orders from DB" + err});
         });
});

//add new order
router.post('/', (req, res, next)=>{

    //Check if Product exists before storing order associated with product
    Product.findById(req.body.productId)
           .then(product => {
                const order = new Order({
                    _id : new mongoose.Types.ObjectId(),
                    quantity : req.body.quantity,
                    product: req.body.productId
                });
                order.save()
                    .then(result => {
                        console.log("Order created successfully: "+result)
                        res.status(201);
                        res.json(
                            {
                                Message:"New Order created successfully",
                                createdOrder: {
                                    id:result._id,
                                    product:result.product,
                                    quantity: result.quantity,
                                    request:{
                                        type:"GET",
                                        url:"http://localhost:3000/orders/"+result._id
                                    }
                                }
                            }
                        );
                    })
                    .catch(err => {
                        console.log('There was an error saving the Order!: '+err);
                        res.status(500).json({ErrorMessage:"Error saving Order to DB",error: err});
                    });
           })
           .catch(err => {
               res.status(404).json({Message:"Product not found", error: err})
           });
});

//Get specific order details
router.get('/:id', (req, res,next)=>{
    const id = req.params.id;
    Order.findById(id)
         .populate('product')
         .then(order => {
            console.log(order);
            if (order) {
                 res.status(200).json({order: {
                    id:order._id,
                    product:order.product,
                    quantity: order.quantity,
                    request:{
                         description: "Get all orders",
                         type:"GET",
                         url:"http://localhost:3000/orders/"
                    }
                 }});   
            }else{
             res.status(404).json({Message: `No valid order found for ID: ${id}`});
            }
         })
         .catch(err => {
             res.status(500).json({Message:"Error finding Product", error:err});
         });
});

//Update specific order details
// router.patch('/:id', (req, res,next)=>{
//     const id = req.params.id;
//     res.status(200).json({message:`You updated order of ID`, id:id});
// });

//Delete specific order
router.delete('/:id', (req, res,next)=>{
    Order.deleteOne({_id: req.params.id})
         .exec()
         .then(order => {
                console.log(`Order deleted successfully ${order}`);
                res.status(200);
                res.json(
                    {
                        Message:"Order deleted successfully",
                        request:{
                            type:"POST",
                            description:"Add new Order",
                            url:"http://localhost:3000/orders",
                            body:{quantity:"Number", productId:"String"}
                        }
                    }
                );
         })
         .catch(err => {
            console.log('Order not found!' + err);
            res.status(404).json({ErrorMessage: 'Order not found!'});
         });
});

module.exports = router;