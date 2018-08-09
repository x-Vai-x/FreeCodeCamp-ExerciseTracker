const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("connected"))

const Schema=mongoose.Schema

const UserSchema=new Schema({
	UserId: {
		type: String,
		index: true,
		unique: true,
		required: true,
	}, 

	Exercises: [{
		type: Schema.Types.ObjectId, ref: 'Exercise'
	}]
	

})

module.exports.UserModel = mongoose.model('User', UserSchema)


