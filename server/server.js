var express = require('express')
var app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cors = require('cors')
app.use(cors())

var comments = require('./comment_data.js')
console.log(comments)

app.get('/api/comments',cors(),function(req,res){
	res.send(comments)
})
app.post('/api/comments',cors(),function(req,res){
	console.log(req.body)
})

app.listen(5000,function() {
	console.log("Listening on port 5000")
})