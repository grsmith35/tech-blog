const router = require('express').Router();
const sequelize = require('../config/connection')
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    console.log(req.session)
    Post.findAll({
        where: {user_id: req.session.user_id},
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote where post.id = vote.post_id)'), 'vote_count']
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
        const posts = dbRequestData.map(post => post.get({plain: true}));
        console.log(posts)
        res.render('dashboard', { posts, loggedIn: true})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where : { id: req.params.id},
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote where post.id = vote.post_id)'), 'vote_count'],
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