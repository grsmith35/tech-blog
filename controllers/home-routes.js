const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// get all the posts for homepage
router.get('/', (req, res) => {
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: [
              'id',
              'comment_text',
              'post_id',
              'user_id',
              'created_at',
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
        const posts = dbRequestData.map(post => post.get({ plain: true }));
        res.render('homepage', {
          posts,
          loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  // get a single post
  router.get('/post/:id', withAuth, (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']      ],
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
        if (!dbRequestData) {
          res.status(404).json({ message: 'No posts found with this id' });
          return;
        }
  
        const post = dbRequestData.get({ plain: true });
  
        res.render('single-post', {
          post,
          loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });

  router.post('/logout', (req, res) => {
    if(req.session.loggedin) {
      req.session.destroy(() => {
        res.status(204).end();
      })
    } else {
      res.status(400).end();
    }
  })

module.exports = router;