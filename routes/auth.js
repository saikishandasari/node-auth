const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user.js');

var router = express.Router();

router.route('/login')
.post((req,res) => {
	user.findOne({'email': req.body.email},(err,result)=>{
		if(err) throw err;
		if(!result){
			res.send('Authentication failed! User not found');
		}else if(result){
			var loadUser = result;
			bcrypt.compare(req.body.password,result.password_hash,(err,result)=>{
				if(result){
					var token = jwt.sign(loadUser,process.env.JWT_SECRET,{expiresIn: 60});
					res.send({
						message:'Authentication successful!',
						token: token
					});
				}else{
					res.send('Authentication failed! Incorrect password');
				}
			});
		}
	});
});

router.route('/register')
.post((req,res) => {
	user.findOne({'email': req.body.email},(err,result)=>{
		if(err) throw err;
		if(result){
			res.send('User already exists!');
		}else if(!result){

			bcrypt.hash(req.body.password,10,(err,hash)=>{
				var newUser = new user({
					fullName: req.body.fullName,
					email: req.body.email,
					password_hash: hash
				});
				
				newUser.save((err,addedUser)=>{
					if(err) res.send(err);
					else res.json('User added successfully!');
				});
			});
		}
	});
});

router.route('/verify')
.post((req,res)=>{
	var token = req.body.token||req.headers.token||req.query.token;
	if(token){
		jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
			if(err) 
				res.status(400).send(err);
			else {
				res.status(200).send('Token verified!');
			}
		});
	}else{
		res.status(400).send('Invalid token');
	}
});

module.exports = router;