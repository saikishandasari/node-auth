const mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	fullName: {
		type: String,
		trim: true,
		required: true
	},
	email:{
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true
	},
	password_hash:{
		type: String,
		required: true
	},
	created:{
		type: Date,
		default: Date.now
	}
},'User');