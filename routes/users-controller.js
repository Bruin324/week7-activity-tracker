const express = require('express');
const router = express.Router();
const User = require('./models/data.js');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJWT;
const JWTStrategy = passportJWT.Strategy;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secret: 'thisIsTheSecret'
}

//get list of users and all data
router.get('/users', async (request, response) => {
    let usersList = await User.find();
    response.json(usersList);
})

//create new user
router.post('/api/register', async (request, response) => {
    let newUser = new User({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password
    });

    await newUser.save();
    var payload = {id: user._id, name: user.name };
    var token = jwt.sign(payload, jwtOptions.secret);
    res.json({message: "registration complete", token: token});
});

//user login
router.post("/api/login", (request, response) => {
  if(request.body.name && request.body.password){
    var email = request.body.email;
    var password = request.body.password;
  }
  var user = User.findOne({email: email});
  if( ! user ){
    res.status(401).json({message:"no such user found"});
  }

  if(user.password === req.body.password) {
    var payload = {id: user._id, name: user.name };
    var token = jwt.sign(payload, jwtOptions.secret);
    res.json({message: "login successful", token: token});
  } else {
    res.status(401).json({message:"passwords did not match"});
  }
});

//get single user with all data
router.get('/api/:userId/activities', passport.authenticate('jwt', { session: false }), async (request, response) => {
    let id = request.params.userId
    let user = await User.findOne({ _id: id })
    response.json(user.activities);
})

module.exports = router;