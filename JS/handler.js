const express=require('express')
const app = express()
const path = require('path')

const bodyParser=require('body-parser')

app.use( bodyParser.json() )       
app.use(bodyParser.urlencoded({    
  extended: true
}))

let userId=undefined

app.get('/register',function(req, res) {
	res.sendfile(path.resolve(__dirname+'/../HTML/NewUser.html'))
})

app.get('/login', function(req,res){
	res.sendfile(path.resolve(__dirname+'/../HTML/ExistingUser.html'))
})

app.post('/welcome', function(req,res){
	userId=req.body.userId

	if(userId!=undefined){
		res.sendfile(path.resolve(__dirname+'/../HTML/Welcome.html'))
	}	
	

})

app.get('/logout', function(req,res){
	userId=undefined
	res.sendfile(path.resolve(__dirname+'/../HTML/Index.html'))
})

app.get('/', function(req,res){
	res.sendfile(path.resolve(__dirname+'/../HTML/Index.html'))
})

app.listen(8080, function() {
	console.log("Listening on port 8080")
})