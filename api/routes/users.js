const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

//User signup
router.post("/signup", (req,res,next)=>{

    //check if user with email already exists
    User.find({email: req.body.email})
        .exec()
        .then(doc => {
            if(doc){
                res.status(409).json({Message: "User already exists!"});
            }else{
                //Save new User to Database
                bcrypt.hash(req.body.password, 10, (err, hash)=>{
                    if(err){
                        res.status(500).json({
                            error:err
                        })
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                       .then(result => {
                            console.log('Signup successful: '+result);
                            res.status(201);
                            res.json(
                                {
                                    Message:"Signup successful",
                                    createdProduct: {
                                        email:result.email,
                                        password:result.password,
                                        id: result._id,
                                        request:{
                                            type:"GET",
                                            url:"http://localhost:3000/users/"+result._id
                                        }
                                    }
                                }
                            );
                        })
                       .catch(err => {
                            console.log('There was an error during signup!: '+err);
                            res.status(500).json({ErrorMessage:"There was an error during signup",error: err});
                        });
                    } 
                });
            }
        });
});

router.get("/:id", (req,res,next)=>{
    const id = req.params.id;
    //Get Product from DB by ID
    User.findById(id)
           .select('email password')
           .exec()
           .then(doc =>{
               console.log(doc);
               if (doc) {
                    res.status(200).json({user: {
                        email:doc.email,
                        password:doc.password,
                        id: doc._id,
                        request:{
                            description: "Get all users",
                            type:"GET",
                            url:"http://localhost:3000/users/"
                        }
                    }});   
               }else{
                res.status(404).json({Message: `User not found: ${id}`});
               }
           })
           .catch(err => {
               console.log(err);
               res.status(501).json({error:"Failed to find User with ID" + id, error: err});
           })
});

//Delete specific user
router.delete('/:id', (req, res,next)=>{
    const id = req.params.id;
    //Delete Product
    User.deleteOne({_id: id})
           .then(result => {
               if (result) {
                    console.log(`User deleted successfully ${result}`);
                    res.status(200);
                    res.json(
                        {
                            Message:"User deleted successfully",
                            request:{
                                type:"POST",
                                description:"Signup",
                                url:"http://localhost:3000/users",
                                body:{email:"String", password:"String"}
                            }
                        }
                    );
               } else {
                    console.log('User Not found');
                    res.status(404).json({Message:'User Not found'});
               }
           })
           .catch(err => {
                console.log('Error deleting user' + err);
                res.status(500).json({ErrorMessage: `Error deleting user ${err}`});
           });
});

module.exports = router;