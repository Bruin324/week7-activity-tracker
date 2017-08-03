const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/data.js');
const moment = require('moment');
const userController = require('./routes/users-controller.js');
const activitiesController = require('./routes/activities-controller');
const statsController = require('./routes/stats-controller');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;


const application = express();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: 'thisIsTheSecret'
}

var strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
  let user = await User.findOne({ _id: jwt_payload.id})
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/ActivityTracker');

application.use(bodyParser.json());
application.use(bodyParser.urlencoded());
application.use(passport.initialize());

application.use(userController);
application.use(activitiesController);
application.use(statsController);

application.listen(3000, () => {
    console.log('server started');
});



