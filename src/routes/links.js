const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('links/add'); 
});

router.post('/add', (req, res) => {
    // los datos del form
    console.log(req.body);
    res.send('resibido');
});

module.exports = router;