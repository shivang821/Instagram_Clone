const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	phoneNo: {
		type: Number
	},
	profile: {
		uid: {
			type: String
		},
		url: {
			type: String
		}
	},
	followers: [
		{
			user: {
				type: mongoose.Schema.ObjectId,
				ref: 'User'
			}
		}
	],
	following: [
		{
			user: {
				type: mongoose.Schema.ObjectId,
				ref: 'User',
			}
		}
	],
	createdAt:{
		type:Date,
		default:Date.now
	},
	isPublic:{
		type:Boolean,
		default:false
	},
	dailyLimit:{
		type:Number,
		default:10
	},
	screenTime:{
		type:Number,
		default:0
	},
	isDailyLimitSet:{
		type:Boolean,
		default:false
	},
	numberOfPosts:{
		type:Number,
		default:0
	}
});
userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function(currPassword) {
	return await bcrypt.compare(currPassword, this.password);
};
userSchema.methods.getJwtToken = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};
module.exports = new mongoose.model('User', userSchema);
