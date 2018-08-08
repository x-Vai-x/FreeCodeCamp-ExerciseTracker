const express=require('express')
const app = express()
const path = require('path')

const dialog = require('dialog')

const {saveUser, findUser} = require('../DB/DBMethods')


app.use(express.static(path.resolve(__dirname+ '/../css/')))


const bodyParser=require('body-parser')

app.use( bodyParser.json() )       
app.use(bodyParser.urlencoded({    
  extended: true
}))

let userId=undefined

app.get('/register',function(req, res) {
	res.sendFile(path.resolve(__dirname+'/../HTML/NewUser.html'))
})

app.get('/login', function(req,res){
	res.sendFile(path.resolve(__dirname+'/../HTML/ExistingUser.html'))
})

app.post('/welcome_new', function(req,res){
	userId=req.body.userId

   if(userId!=undefined&&userId!=""){
   		findUser(userId).then(ans=>{
   			if(ans.length==0){
   				saveUser(userId)
   				res.redirect('/welcome')
   			}else{
   				dialog.info("Name is already taken")
   				res.redirect('/register')
   			}
   		})
   		
		
	}	

	else{
		dialog.info("User Id required to proceed.")
   	    res.redirect('/register')
	}
	
	

})

app.post('/welcome_existing', function(req,res){
   userId=req.body.userId

   if(userId!=undefined&&userId!=""){
   		findUser(userId).then(ans=>{
   			if(ans.length==1){
   				res.redirect('/welcome')
   			}else{
   				dialog.info("User id doesn't exist.")
   			}
   		})	
		
	}	
	else{
		dialog.info("User id  required to proceed.")
		res.redirect("/login")
		
	}
	

})

app.get('/welcome',function(req, res){

   if(userId!=undefined&&userId!=""){
		res.sendFile(path.resolve(__dirname+'/../HTML/Welcome.html'))
	}	
	else{
		res.status("404")
		res.send("<h1>404 forbidden!</h1>")
	}
})

app.get('/new', function(req, res){
	res.sendFile(path.resolve(__dirname+'/../HTML/NewExercise.html'))
})

app.get('/list', function(req, res){

})

app.get('/logout', function(req,res){
	userId=undefined
	res.redirect('/')

})

app.get('/', function(req,res){
	res.sendFile(path.resolve(__dirname+'/../HTML/Index.html'))
})

app.listen(8080, function() {
	console.log("Listening on port 8080")
})