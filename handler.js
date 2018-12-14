const express=require('express')
const app = express()
const path = require('path')

const dialog = require('dialog')

require('dotenv').config()

let show_exercises_from=0

const {saveUser, findUser, saveExercise, findExercises, getExerciseById, validatePassword, deleteExerciseById, updateExerciseDescription, updateExerciseDuration, updateExerciseDate} = require('./DB/DBMethods')


app.use(express.static(path.resolve(__dirname+ '/public/')))

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname+'/HTML'))

const bodyParser=require('body-parser')

const session=require('express-session')
const cookieParser = require('cookie-parser')

app.use( bodyParser.json() )       
app.use(bodyParser.urlencoded({    
  extended: true
}))

app.use(cookieParser())

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid')       
    }
    
   
    next()
})

const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/welcome')
    } else {
        next()
    }    
}





app.get('/register',sessionChecker, function(req, res) {

	
		res.sendFile(path.resolve(__dirname+'/HTML/NewUser.html'))

	
})

app.get('/login', sessionChecker, function(req,res){
	
		res.sendFile(path.resolve(__dirname+'/HTML/ExistingUser.html'))
	
	
})

app.post('/welcome_new', async function(req,res){
	
 	if(req.session.user!=undefined){
   		dialog.info("You are already logged in.")
   		res.redirect('/welcome')
   	}


   else if(req.body.userId!=undefined&&req.body.userId!="" &&req.body.password!=undefined&&req.body.password!=""){
   		
   		const user = await findUser(req.body.userId)
   			if(user.length==0){
   				const userId=req.body.userId
   				const password=req.body.password
   				const user = await saveUser(userId, password)

   				req.session.user=user
   				
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
   
   if(req.session.user!=undefined){
   		dialog.info("You are already logged in.")
   		res.redirect('/welcome')
   }

   else if(req.body.userId!=undefined&&req.body.userId!=""){
   		
   		const users= await findUser(req.body.userId)
   			if(users.length==1){
   				const user=users[0]
   				const password=req.body.password

   				const validate=await validatePassword(req.body.userId, password)

   				if(validate){
   					
   					req.session.user=user
   					
   					
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

   if(req.session.user!=undefined&&req.cookies.user_sid){
		res.sendFile(path.resolve(__dirname+'/HTML/Welcome.html'))
		console.log(req.cookies.user_sid)
	}	
	else{
		res.status("404")
		res.send("<h1>404 forbidden!</h1>")
	}
})

app.get('/new', function(req, res){
	if(req.session.user!=undefined){
		res.sendFile(path.resolve(__dirname+'/HTML/NewExercise.html'))
	}else{
		res.status("404")
		res.send("<h1>404 forbidden!</h1>")
	}
	
})

app.post('/create',async function(req, res){
	if(req.session.user!=undefined){
		await saveExercise(req.session.user.UserId, req.body.description, req.body.duration, req.body.date)
		dialog.info("New record created")
		res.redirect('/new')

	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
	
})

app.get('/myExercise', async function(req, res){
	if(req.session.user!=undefined){
		
		const exercises=await find10Exercises(show_exercises_from, req.session.user.UserId)
		res.render('MyExercise', {Exercises: exercises})
		
	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
})

app.get('/nextExercise', async function(req, res){
	if(req.session.user!=undefined){
		const exercises=await findExercises(req.session.user.UserId)
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
	if(req.session.user!=undefined){
		
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

	const exercise=await getExerciseById(req.params.id, req.session.user.UserId)
	if(req.session.user!=undefined && exercise!=undefined){
		
		res.render('Exercise', {Exercise: exercise})
	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
	

})

app.get('/deleteExercise/:id', async function(req,res){

	const deleted=await deleteExerciseById(req.params.id, req.session.user.UserId)
	if(deleted){
		dialog.info("Exercise deleted")
		res.redirect('/myExercise')
	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
	

})



app.get('/logout', function(req,res){
	if(req.session.user!=undefined && req.cookies.user_sid){
		
		res.clearCookie('user_sid')
		show_exercises_from=0
		
		res.redirect('/')
	}
	
})

app.get('/', sessionChecker, function(req,res){
	
		res.sendFile(path.resolve(__dirname+'/HTML/Index.html'))
	
	
})



app.post('/editExerciseDescription', async function(req, res){
	const description=req.body.description
	const id = req.body.id

	

	if(description!=undefined&&description!=""){
		const update= await updateExerciseDescription(id, description, req.session.user.UserId)

		if(update){
			dialog.info("Description updated")
			res.redirect('/Exercise/'+id)
		}else{
			res.status(404)
			res.send("<h1>404 forbidden!</h1>")
		}
	}else{
		dialog.info("Description cannot be blank")
		res.redirect('/Exercise/'+id)
	}
	
})

app.post('/editExerciseDuration',async function(req,res){
	const duration = req.body.duration
	const id=req.body.id

	

	if(duration!=undefined){
		const update= await updateExerciseDuration(id, duration, req.session.user.UserId)

		if(update){
			dialog.info("Duration updated")
			res.redirect('/Exercise/'+id)
		}else{
			res.status(404)
			res.send("<h1>404 forbidden!</h1>")
		}
	}else{
		dialog.info("Duration cannot be blank")
		res.redirect('/Exercise/'+id)
	}
	
})

app.post('/editExerciseDate', async function(req, res){
	const date=req.body.date
	const id=req.body.id

	

	if(date!=undefined){
		const update= await updateExerciseDate(id, date, req.session.user.UserId)

		if(update){
			dialog.info("Date updated")
			res.redirect('/Exercise/'+id)
		}else{
			res.status(404)
			res.send("<h1>404 forbidden!</h1>")
		}
	}else{
		dialog.info("Date cannot be blank")
		res.redirect('/Exercise/'+id)
	}
	
})


async function find10Exercises(from, userId){

	const exercises=await findExercises(userId)
	return exercises.slice(from, from+10)
}







app.listen(8080, function() {
	console.log("Listening on port 8080")
})