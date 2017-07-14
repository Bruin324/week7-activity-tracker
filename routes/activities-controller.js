const express = require('express');
const router = express.Router();
const User = require('./models/data.js');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');


//create new activity for single user
router.post('/api/:userId/activities', passport.authenticate('jwt', { session: false }), async (request, response) => {
    let id = request.params.userId;
    let user = await User.findOne({ _id: id });
    let activity = {
        name: request.body.name
        // stats: []
    };
    user.activities.push(activity);
    await user.save();
    response.json(user.activities);
})

//update activity name for single user
router.put('/api/:userId/:activityId', passport.authenticate('jwt', { session: false }), async (request, response) => {
    let newActivityName = request.body.name
    let userId = request.params.userId;
    let activityId = request.params.activityId;
    let user = await User.findOne({ _id: userId});
    function findActivity(activity) {
        return activity._id.toString() === activityId;
    }

    let activityIndex = user.activities.findIndex(findActivity);
    user.activities[activityIndex].name = newActivityName;
    let updateUser = await User.update({ _id: userId}, { $set: { activities: user.activities }} );

    response.json(user.activities)
})

//delete single activity for a single user
router.delete('/api/:userId/:activityId', passport.authenticate('jwt', { session: false }), async (request, response) => {
    let userId = request.params.userId;
    let activityId = request.params.userId;
    let user = await User.findOne({ _id: userId });
    function findActivity (activity) {
        return activity._id.toString() === activityId;
    }

    let activityIndex = user.activities.findIndex(findActivity);
    user.activities.splice(activityIndex,1);
    let updateUser = await User.update({ _id: userId }, { $set: {activities: user.activities }} );

    response.json(updateUser);
})

module.exports = router;