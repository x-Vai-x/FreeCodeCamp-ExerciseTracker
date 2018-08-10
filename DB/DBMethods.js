const mongoose = require('mongoose')

const {UserModel} = require('./Schemas/UserSchema')
const {ExerciseModel} = require('./Schemas/ExerciseSchema')

module.exports.saveUser= async function(userID){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})
	const user=new UserModel({UserId: userID, Exercises: []})
	await user.save()
	console.log("user saved").catch(err=>{console.log(err)})
}

module.exports.findUser = async function(userID){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})
	const users= await UserModel.find({UserId: userID}).populate('Exercises')
	return users
}





module.exports.saveExercise=async function(userID, description, duration, date){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})

	
		
	const users= await UserModel.find({UserId: userID}).populate('Exercises')
	console.log(users)
	if(users.length==1){
		const user=users[0]
		const exercise=new ExerciseModel({Description: description, Duration: duration, Date: date})
		await exercise.save()
		console.log("exercise saved")
		user.Exercises.push(exercise._id)
		await user.save()
		console.log("user updated")
	}
		
	
		
}

	


module.exports.findExercises=async function(userID){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})

	const user=await UserModel.find({UserId: userID}).populate('Exercises')
	return user[0].Exercises
}

module.exports.getExerciseById=async function(id){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})
	const exercise = await ExerciseModel.findById(id)
	return exercise
}








