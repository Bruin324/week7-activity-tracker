const express = require('express');
const router = express.Router();
const User = require('../models/data.js');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const passport = require('passport');

//get list of stats for a single activity of a single user
router.get('/api/:userId/:activityId/stats', passport.authenticate('jwt', { session: false }), async (request, response) => {
    let userId = request.params.userId;
    let activityId = request.params.activityId;

    function findActivity(activity) {
        return activity._id.toString() === activityId
    }

    let user = await User.findOne({ _id: userId });
    let activity = user.activities.find(findActivity);
    response.json(activity.stats);
})

//create new stat for a single activity of a single user
router.post('/api/:userId/:activityId/stats', passport.authenticate('jwt', { session: false }), async (request, response) => {
    let userId = request.params.userId;
    let user = await User.findOne({ _id: userId });
    let activityId = request.params.activityId;

    function findActivity(activity) {
        return activity._id.toString() === activityId
    }

    let activity = user.activities.find(findActivity);
    let stat = {
        date: request.body.date,
        stat: request.body.stat
    };
    activity.stats.push(stat);
    await user.save();
    response.json(user.activities);
})

//delete single stat for a single activity of a single user
router.delete('/api/:userId/:activityId/:statId', passport.authenticate('jwt', { session: false }), async (request, response) => {
    let userId = request.params.userId;
    let activityId = request.params.activityId;
    let statId = request.params.statId;
    let user = await User.findOne({ _id: userId });

    function findActivity(activity) {
        return activity._id.toString() === activityId
    };

    function findStat(stat) {
        return stat._id.toString() === statId
    }

    let activity = user.activities.find(findActivity);
    let statIndex = activity.stats.findIndex(findStat);
    activity.stats.splice(statIndex,1);
    let updateUser = await User.update({ _id: userId }, { $set: {activities: user.activities }}, { new: true } );

    response.json(updateUser);

});

module.exports = router;