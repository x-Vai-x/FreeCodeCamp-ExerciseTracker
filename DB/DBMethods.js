const mongoose = require('mongoose')
const bcrypt=require('bcrypt')
const {UserModel} = require('./Schemas/UserSchema')
const {ExerciseModel} = require('./Schemas/ExerciseSchema')
const {passport}=require('../handler')

module.exports.saveUser= async function(userID, password){
	await mongoose.connect(process.env.DB).then(console.log("db connected")).catch(err=>{console.log(err)})
	const hash=await bcrypt.hash(password, 12).catch("can't hash password")
	const user=new UserModel({UserId: userID, Password: hash, Exercises: []})
	await user.save().catch("can't save user")
	console.log("user saved")
	return user
}

module.exports.findUser = async function(userID){
	await mongoose.connect(process.env.DB).then(console.log("db connected")).catch(err=>{console.log(err)})
	const users= await UserModel.find({UserId: userID}).populate('Exercises').catch("can't find user")
	return users
}

module.exports.validatePassword = async function(userID, password){

	const users=await module.exports.findUser(userID).catch("can't find user")
	const user=users[0]
	const passwordMatches= await bcrypt.compare(password, user.Password).catch("can't compare hash")
	return passwordMatches
}



module.exports.saveExercise=async function(userID, description, duration, date){
	await mongoose.connect(process.env.DB).then(console.log("db connected")).catch(err=>{console.log(err)})

	
		
	const users= await module.exports.findUser(userID)
	console.log(users)
	if(users.length==1){
		const user=users[0]
		const exercise=new ExerciseModel({Description: description, Duration: duration, Date: date, User: user._id})
		await exercise.save()
		console.log("exercise saved")
		user.Exercises.push(exercise._id)
		await user.save()
		console.log("user updated")
	}
		
	
		
}

	


module.exports.findExercises=async function(userID){
	await mongoose.connect(process.env.DB).then(console.log("db connected")).catch(err=>{console.log(err)})

	const user=await UserModel.find({UserId: userID}).populate('Exercises')
	return user[0].Exercises
}

module.exports.getExerciseById=async function(id, userID){
	await mongoose.connect(process.env.DB).then(console.log("db connected")).catch(err=>{console.log(err)})
	const exercise = await ExerciseModel.findById(id).populate('User')


	if(exercise.User.UserId!=userID){
		return undefined
	}else{
		return exercise
	}


}

module.exports.deleteExerciseById=async function(id, userID){
	const exercise = await module.exports.getExerciseById(id, userID)
	if(exercise!=undefined){
		await ExerciseModel.remove({_id: id})
		return true
	}else{
		return false
	}

}

module.exports.updateExerciseDescription=async function(id,description, userID){
	const exercise = await module.exports.getExerciseById(id, userID)
	if(exercise!=undefined){
		await ExerciseModel.findOneAndUpdate({_id: id},{$set: {Description:description}},{ new: true }).exec()
		return true
	}else{
		return false
	}
}

module.exports.updateExerciseDuration=async function(id,duration, userID){
	const exercise = await module.exports.getExerciseById(id, userID)
	if(exercise!=undefined){
		await ExerciseModel.findOneAndUpdate({_id: id},{$set:{Duration:duration}},{ new: true }).exec()
		return true
	}else{
		return false
	}
}

module.exports.updateExerciseDate=async function(id,date, userID){
	const exercise = await module.exports.getExerciseById(id, userID)
	if(exercise!=undefined){
		await ExerciseModel.findOneAndUpdate({_id: id}, {$set:{Date:date}},{ new: true }).exec()
		return true
	}else{
		return false
	}
}







