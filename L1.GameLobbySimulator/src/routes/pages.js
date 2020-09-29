const express = require('express');
const router = express.Router();

router.get(['/', '/signin', '/member', '/setting', '/ow'], function (req, res) {
    res.render('index', { title: 'Game Lobby Simulator' });
});

module.exports = router;
