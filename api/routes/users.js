const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const UsersController = require('../controllers/Users');

//User signup
router.post("/signup", UsersController.signup);

router.post("/login", UsersController.login);

router.get("/:id", UsersController.get_user_by_id);

//Delete specific user
router.delete('/:id', UsersController.delete_user);

module.exports = router;