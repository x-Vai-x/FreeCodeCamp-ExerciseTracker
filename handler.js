const express=require('express')
const app = express()
const path = require('path')

const dialog = require('dialog')

let show_exercises_from=0

const {saveUser, findUser, saveExercise, findExercises, getExerciseById, validatePassword, deleteExerciseById, updateExerciseDescription, updateExerciseDuration, updateExerciseDate} = require('./DB/DBMethods')


app.use(express.static(path.resolve(__dirname+ '/public/')))

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname+'/HTML'))

const bodyParser=require('body-parser')

app.use( bodyParser.json() )       
app.use(bodyParser.urlencoded({    
  extended: true
}))

let userId=undefined

app.get('/register',function(req, res) {

	if(userId==undefined){
		res.sendFile(path.resolve(__dirname+'/HTML/NewUser.html'))
	}else{
		res.redirect('/welcome')
	}
})

app.get('/login', function(req,res){
	if(userId==undefined){
		res.sendFile(path.resolve(__dirname+'/HTML/ExistingUser.html'))
	}else{
		res.redirect('/welcome')
	}
	
})

app.post('/welcome_new', async function(req,res){
	
 	if(userId!=undefined&&userId!=""){
   		dialog.info("You are already logged in.")
   		res.redirect('/welcome')
   	}


   else if(req.body.userId!=undefined&&req.body.userId!="" &&req.body.password!=undefined&&req.body.password!=""){
   		
   		const user = await findUser(req.body.userId)
   			if(user.length==0){
   				userId=req.body.userId
   				const password=req.body.password
   				saveUser(userId, password)
   				res.redirect('/welcome')
   			}else{
   				dialog.info("Name is already taken")
   				res.redirect('/register')
   			}
   		
   		
		
	}	

	else{
		dialog.info("User Id required to proceed.")
   	    res.redirect('/register')
	}
	
	

})

app.post('/welcome_existing', async function(req,res){
   
   if(userId!=undefined&&userId!=""){
   		dialog.info("You are already logged in.")
   		res.redirect('/welcome')
   }

   else if(req.body.userId!=undefined&&req.body.userId!=""){
   		
   		const users= await findUser(req.body.userId)
   			if(users.length==1){
   				
   				const password=req.body.password

   				const validate=await validatePassword(req.body.userId, password)

   				if(validate){
   					userId=req.body.userId
   					res.redirect('/welcome')
   				}else{
   					dialog.info("Incorrect password.")
   				}
   				
   			}else{
   				dialog.info("User id doesn't exist.")
   			}
   			
		
	}	
	else{
		dialog.info("User id  required to proceed.")
		res.redirect("/login")
		
	}
	

})

app.get('/welcome',function(req, res){

   if(userId!=undefined&&userId!=""){
		res.sendFile(path.resolve(__dirname+'/HTML/Welcome.html'))
	}	
	else{
		res.status("404")
		res.send("<h1>404 forbidden!</h1>")
	}
})

app.get('/new', function(req, res){
	if(userId!=undefined){
		res.sendFile(path.resolve(__dirname+'/HTML/NewExercise.html'))
	}else{
		res.status("404")
		res.send("<h1>404 forbidden!</h1>")
	}
	
})

app.post('/create',async function(req, res){
	if(userId!=undefined){
		await saveExercise(userId, req.body.description, req.body.duration, req.body.date)
		dialog.info("New record created")
		res.redirect('/new')

	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
	
})

app.get('/myExercise', async function(req, res){
	if(userId!=undefined){
		
		const exercises=await find10Exercises(show_exercises_from)
		res.render('MyExercise', {Exercises: exercises})
		
	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
})

app.get('/nextExercise', async function(req, res){
	if(userId!=undefined){
		const exercises=await findExercises(userId)
		if(exercises.length>show_exercises_from+10){
			show_exercises_from+=10
			res.redirect('/myExercise')	
		}
		
		
	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
})

app.get('/previousExercise', async function(req, res){
	if(userId!=undefined){
		
		if(show_exercises_from>=10){
			show_exercises_from-=10
			res.redirect('/myExercise')
		}
		
		
	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
})


app.get('/Exercise/:id', async function(req,res){

	const exercise=await getExerciseById(req.params.id, userId)
	if(userId!=undefined && exercise!=undefined){
		
		res.render('Exercise', {Exercise: exercise})
	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
	

})

app.get('/deleteExercise/:id', async function(req,res){

	const deleted=await deleteExerciseById(req.params.id, userId)
	if(deleted){
		dialog.info("Exercise deleted")
		res.redirect('/myExercise')
	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
	

})



app.get('/logout', function(req,res){
	userId=undefined
	show_exercises_from=0
	res.redirect('/')
})

app.get('/', function(req,res){
	if(userId==undefined){
		res.sendFile(path.resolve(__dirname+'/HTML/Index.html'))
	}else{
		res.redirect('/welcome')
	}
	
})

app.post('/editExerciseDescription', async function(req, res){
	const description=req.body.description
	const id = req.body.id

	console.log(description)
	console.log(id)

	if(description!=undefined&&description!=""){
		const update= await updateExerciseDescription(id, description, userId)

		if(update){
			dialog.info("description update")
			res.redirect('/Exercise/id')
		}else{
			res.status(404)
			res.send("<h1>404 forbidden!</h1>")
		}
	}else{
		dialog.info("Description cannot be blank")
		res.redirect('/Exercise/id')
	}
	
})

app.post('/editExerciseDuration',function(req,res){
	const duration = req.body.duration
	const id=req.body.id

	console.log(duration)
	console.log(id)

	if(duration!=undefined){
		const update= await updateExerciseDuration(id, duration, userId)

		if(update){
			dialog.info("Duration updated")
			res.redirect('/Exercise/id')
		}else{
			res.status(404)
			res.send("<h1>404 forbidden!</h1>")
		}
	}else{
		dialog.info("Duration cannot be blank")
		res.redirect('/Exercise/id')
	}
	
})

app.post('/editExerciseDate', function(req, res){
	const date=req.body.date
	const id=req.body.id

	console.log(date)
	console.log(id)

	if(date!=undefined){
		const update= await updateExerciseDate(id, date, userId)

		if(update){
			dialog.info("Date updated")
			res.redirect('/Exercise/id')
		}else{
			res.status(404)
			res.send("<h1>404 forbidden!</h1>")
		}
	}else{
		dialog.info("Date cannot be blank")
		res.redirect('/Exercise/id')
	}
	
})


async function find10Exercises(from){

	const exercises=await findExercises(userId)
	return exercises.slice(from, from+10)
}







app.listen(8080, function() {
	console.log("Listening on port 8080")
})