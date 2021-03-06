'use strict';
var router = require('express').Router();
module.exports = router;


router.use('/games', require('./games.router'));

router.use('/user', require('./users.router'));

router.use('/events', require('./events.router'));

router.use('/email', require('./email.router'));

router.use('/cron', require('./cron.router'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
