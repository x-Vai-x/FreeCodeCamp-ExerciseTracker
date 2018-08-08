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
	const users= await UserModel.find({UserId: userID})
	return users

}

module.exports.findUserObjectId = async function(userID){
	const user=await this.findUser(userID)
	return user[0]._id
}

module.exports.saveExercise=async function(userID, description, duration, date){
	await mongoose.connect('mongodb://localhost:27017/FreeCodeCampProject').then(console.log("db connected")).catch(err=>{console.log(err)})

	if(userID!=undefined){
		
		const users=await this.findUser(userID)
		if(users.length==1){
			const exercise=new ExerciseModel({Description: description, Duration: duration, Date: date})
			await exercise.save()
			console.log("exercise saved")
			const user=users[0]
			user.Exercises.push(exercise._id)
			await user.save()
			console.log("user updated")
		}else{
			
			console.log("user doesn't exist")
		}
		
	
		
	}

	

}

this.saveExercise("abc", "desc", 1, new Date())



