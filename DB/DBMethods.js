const mongoose = require('mongoose')

const {UserModel} = require('./Schemas/UserSchema')

function saveUser(userID){
	mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("connected")).catch(err=>{console.log(err)})
	const user=new UserModel({UserId: userID})
	user.save().then(console.log("saved")).catch(err=>{console.log(err)})
}

saveUser("abc")