const express = require('express');
const db = require('../database.js');
const router = express.Router();

router.get('/', (req, res) => {
    const movements = db.prepare('SELECT * FROM movements').all();
    res.json(movements);
});

module.exports = router;