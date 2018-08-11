const express=require('express')
const app = express()
const path = require('path')

const dialog = require('dialog')

const {saveUser, findUser, saveExercise, findExercises, getExerciseById, validatePassword, deleteExerciseById } = require('./DB/DBMethods')


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
   				userId=req.body.userId
   				const password=req.body.password

   				const validate=await validatePassword(userId, password)

   				if(validate){
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
		res.end()

	}else{
		res.status(404)
		res.send("<h1>404 forbidden!</h1>")
	}
	
})

app.get('/myExercise', async function(req, res){
	if(userId!=undefined){
		
		const exercises=await find10Exercises(0)
		res.render('MyExercise', {Exercises: exercises})
		
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
	res.redirect('/')
})

app.get('/', function(req,res){
	if(userId==undefined){
		res.sendFile(path.resolve(__dirname+'/HTML/Index.html'))
	}else{
		res.redirect('/welcome')
	}
	
})

async function find10Exercises(from){

	const exercises=await findExercises(userId)
	return exercises.slice(from, from+10)
}





app.listen(8080, function() {
	console.log("Listening on port 8080")
})