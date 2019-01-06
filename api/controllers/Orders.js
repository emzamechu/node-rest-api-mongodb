const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

module.exports = {
    get_all_orders: (req, res, next)=>{
        Order.find({})
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
    },

    add_new_order : (req, res, next)=>{
        Product.findById(req.body.productId)
               .then(product =>{
                   if (!product) {
                       res.status(404).json({
                           Message:"Product not found!"
                       })
                   }
                   const order = new Order({
                        _id: mongoose.Types.ObjectId(),
                        product : req.body.productId,
                        quantity: req.body.quantity
                   })
                   return order.save();
               })
               .then(result => {
                   res.status(201).json({
                       Message:"Order created!",
                       createdOrder: {
                           _id : result._id,
                           product: result.product,
                           quantity: result.quantity
                       },
                       request:{
                           type: 'GET',
                           url: 'http://localhost:3000/orders' + result._id
                       }
                   })
               })
               .catch(err => {
                   res.status(500).json({
                       error:err
                   });
               })
    },

    get_order_by_id : (req, res,next)=>{
        const id = req.params.id;
        Order.findById(id)
             .populate('product')
             .then(order => {
                console.log(order);
                if (order.length <= 1) {
                    res.status(404);
                    res.json({
                        Message: "No valid order found for ID: " + id});
                } else {
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
                }
             })
             .catch(err => {
                 res.status(500).json({Message:"Error finding Product", error:err});
             });
    },

    delete_order : (req, res,next)=>{
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
    }
};