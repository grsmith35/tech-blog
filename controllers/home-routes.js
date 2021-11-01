const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// get all the posts for homepage
router.get('/', (req, res) => {
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
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
  router.get('/post/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
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

module.exports = router;