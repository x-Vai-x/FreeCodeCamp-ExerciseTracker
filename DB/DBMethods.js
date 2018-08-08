const mongoose = require('mongoose')

const {UserModel} = require('./Schemas/UserSchema')

module.exports.saveUser= function(userID){
	mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})
	const user=new UserModel({UserId: userID, Exercises: []})
	user.save().then(console.log("user saved")).catch(err=>{console.log(err)})
}

module.exports.findUser = function(userID){
	mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})
	let ans
	const users= UserModel.find({UserId: userID})
	return users

}

this.saveUser('abc')