const mongoose = require('mongoose')

const {UserModel} = require('./Schemas/UserSchema')
const {ExerciseModel} = require('./Schemas/ExerciseSchema')

module.exports.saveUser= async function(userID, password){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})
	const user=new UserModel({UserId: userID, Password: password, Exercises: []})
	await user.save()
	console.log("user saved")
}

module.exports.findUser = async function(userID){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})
	const users= await UserModel.find({UserId: userID}).populate('Exercises')
	return users
}

module.exports.validatePassword = async function(userID, password){

	const users=await module.exports.findUser(userID)
	const user=users[0]
	return user.Password==password
}





module.exports.saveExercise=async function(userID, description, duration, date){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})

	
		
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
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})

	const user=await UserModel.find({UserId: userID}).populate('Exercises')
	return user[0].Exercises
}

module.exports.getExerciseById=async function(id, userID){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})
	const exercise = await ExerciseModel.findById(id).populate('User')
	console.log(exercise)


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

module.exports.updateExerciseDescription=async function(id,desciption, userID){
	const exercise = await module.exports.getExerciseById(id, userID)
	if(exercise!=undefined){
		await ExerciseModel.findOneAndUpdate({id: id},{$set:{Description:description}},{ new: true })
		return true
	}else{
		return false
	}
}

module.exports.updateExerciseDuration=async function(id,duration, userID){
	const exercise = await module.exports.getExerciseById(id, userID)
	if(exercise!=undefined){
		await ExerciseModel.findOneAndUpdate({id: id},{$set:{Duration:duration},{ new: true })
		return true
	}else{
		return false
	}
}

module.exports.updateExerciseDate=async function(id,date userID){
	const exercise = await module.exports.getExerciseById(id, userID)
	if(exercise!=undefined){
		await ExerciseModel.findOneAndUpdate({id: id},{$set:{Date:date},{ new: true })
		return true
	}else{
		return false
	}
}







