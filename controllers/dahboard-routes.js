const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {user_id: req.session.user_id},
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbRequestData => {
        const data = dbRequestData.map(post => post.get({plain: true}));
        res.render('dashboard', { data, loggedIn: true})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/edit/:id', (req, res) => {
    Post.findByPk(req.params.id, {
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_it',
                    'user_id',
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbRequestData => {
        if(dbRequestData) {
            const post = dbRequestData.get({plain: true})

            res.render('edit-post', {
                post,
                loggedIn: true
            })
        } else {
            res.status(404).end()
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;