const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("connected"))

const Schema=mongoose.Schema

const ExerciseSchema=new Schema({
	Description: {
		type: String,
		required: true
	}, 

	Duration: {
		type: Number,
		required: true
	},

	Date: {
		type: Date,
		required: true
	}, 

	User: {
		type: Schema.Types.ObjectId, 
		ref: 'User',
		required: true
	}
	

})

module.exports.ExerciseModel = mongoose.model('Exercise', ExerciseSchema)