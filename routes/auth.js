const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user.js')
const config = require('../config/config.js');

var router = express.Router();

router.get('/', (req,res) => {
	user.find({},(err,users)=>{
		res.send(users);
	});
});

router.route('/auth/login')
.post((req,res) => {
	user.findOne({'email': req.body.email},(err,result)=>{
		if(err) throw err;
		if(!result){
			res.send('Authentication failed! User not found');
		}else if(result){
			var loadUser = result;
			bcrypt.compare(req.body.password,result.password_hash,(err,result)=>{
				if(result){
					var token = jwt.sign(loadUser,config.secret,{expiresIn: 60});
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

router.route('/auth/register')
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

router.route('/app')
.all((req,res,next)=>{
	var token = req.body.token||req.headers.token||req.query.token;
	if(token){
		jwt.verify(token,config.secret,(err,user)=>{
			if(err) res.send(err);
			else {
				req.user = user._doc;
				next();
			}
		});
	}else{
		res.send('No token provided');
	}
})
.get((req,res,next)=>{
	res.status(200).send('Hello ' + req.user.fullName);
});

module.exports = router;