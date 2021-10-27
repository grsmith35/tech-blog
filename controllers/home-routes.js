const router = require('express').Router();

router.get('/login', (req, res) => {
    res.render('login');
    console.log('i did get to this.')
});