const express=require('express')
const app = express()
const path = require('path')

app.get('/register',function(req, res) {
	res.sendfile(path.resolve(__dirname+'/../HTML/NewUser.html'))
})

app.get('/login', function(req,res){
	res.sendfile(path.resolve(__dirname+'/../HTML/ExistingUser.html'))
})

app.listen(8080, function() {
	console.log("Listening on port 8080")
})