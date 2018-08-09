const mongoose = require('mongoose')

const {UserModel} = require('./Schemas/UserSchema')
const {ExerciseModel} = require('./Schemas/ExerciseSchema')

module.exports.saveUser= async function(userID){
	
	const user=new UserModel({UserId: userID, Exercises: []})
	await user.save()
	console.log("user saved").catch(err=>{console.log(err)})
}

module.exports.findUser = async function(userID){
	
	const users= await UserModel.find({UserId: userID})
	return users

}



module.exports.saveExercise=async function(userID, description, duration, date){
	

	
		
		const users=await this.findUser(userID)
		if(users.length==1){
			const exercise=new ExerciseModel({Description: description, Duration: duration, Date: date})
			await exercise.save()
			console.log("exercise saved")
			const user=users[0]
			user.Exercises.push(exercise._id)
			await user.save()
			console.log("user updated")
		}
		
	
		
	}

	


async function findExercises(userID){
	
	const users=model('User', UserSchema)
	const user=await users.find({UserId: userID}).populate('Exercises')
	return user[0].Exercises
}







