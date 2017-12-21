var _ = require('lodash');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var express = require('express');

var passport = require('passport');
var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var users = [{
	id:1,
	name:'Sandeep',
	password:'Maity'
},
{
	id:2,
	name:'test',
	password:'test'
}];

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'ghostwarrior';


var strategy = new JwtStrategy(jwtOptions,function(jwt_payload,next){
	console.log('payload received',jwt_payload);
	var user = users[_.indexOf(users,_.find(users,{id:jwt_payload.id}))];
	// var user = users[_.findIndex(users,{id:jwt_payload.id})];
	if(user){
		next(null,user);
	} else {
		next(null,false);
	}
});

passport.use('jwt',strategy);

var app = express();
app.use(passport.initialize());

// Enable the bodyParser and urlencoded for application/json

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/login',function(req,res){
	// console.log(req.body);
	// console.log(req.body.name);
	// console.log(req.body.password);

	if(req.body.name && req.body.password){
		var name = req.body.name;
		var password = req.body.password;
	}	
	// console.log(name + ' ' + password);
	// var user = users[_.findIndex(users,{name:name})];
	var user = users[_.indexOf(users,_.find(users,{name:req.body.name}))];
	console.log(user);
	if(!user){
		res.status(401).json({message:"no such user found"});
	}

	if(user.password === req.body.password){
		var payload = {id:user.id};
		var token = jwt.sign(payload,jwtOptions.secretOrKey);
		res.json({message:'ok',token:token});
	} else {
		res.status(401).json({message:'password did not match'});
	}
})

app.get('/secret',passport.authenticate('jwt',{
	session : false
}),function(req,res){
	res.json("Success! you can not see this without a token");
})


app.get('/',function(req,res){
	res.json({message: "Express is up!"});
})

app.listen(3000,function(){
	console.log('Express running');
})