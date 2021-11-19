const router = require('express').Router();
const {Vote, User, Post, Comment} = require('../../models');

//GET /api/user routes
//get all route
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//get single user route
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {id: req.params.id},
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No user found with this id'})
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//create new user route
router.post('/', (req, res) => {
    console.log('got to the login route')
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    console.log('got to the login route')
    User.findOne({
        where: {username: req.body.username},
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({message: 'No user with that email was found'})
            return;
        }
        //verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if(!validPassword) {
            res.status(400).json({message: 'incorrect password'});
            return
        }

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({user: dbUserData, message: 'You are now logged in!'});
        })
    })
});

router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end()
        })
    } else {
        res.status(404).end();
    }
});

router.put('/:id', (req, res) => {
    User.update({
        indvidualHooks: true,
        where: {id: req.params.id}
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No user was found with this id'})
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.json(500).json(err);
    })
});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {id: req.params.id}
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No users found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;