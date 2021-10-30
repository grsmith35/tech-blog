const router = require('express').Router();

router.get('/', (req, res) => {
    console.log('got to the api route');
});

module.exports = router;