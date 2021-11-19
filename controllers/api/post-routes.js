const router = require('express').Router();
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');
const {Vote, User, Post, Comment} = require('../../models');

//GET /api/post routes
//get all posts
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
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
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
    .then(dbPostdata => res.json(dbPostdata))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
});

//route to get one post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {id: req.params.id},
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
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
    .then(dbPostdata => {
        if(!dbPostdata) {
            res.status(404).json({message: 'No post found with this id'})
            return;
        }
        res.json(dbPostdata);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//route to post new post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
    .then(dbPostdata => res.json(dbPostdata))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//route to vote
router.put('/upvote', withAuth, (req, res) => {
  console.log('to to the upvote')
  if(req.session) {
    console.log('got into the session for upvote')
    Post.upvote({...req.body, user_id: req.session.user_id}, {Vote, Comment, User})
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    })
  }
})

//route to put
router.put('/:id', withAuth, (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {id: req.params.id}
      }
    )
    .then(dbPostData => {
      if(!dbPostData) {
        res.status(404).json({message: 'No post found with this id'});
        return;
      }
      res.json(dbPostData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
  })

//router to delete
router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {id: req.params.id}
    })
    .then(dbPostData => {
      if(!dbPostData) {
        res.status(404).json({message: 'No post found with this id'});
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
  })

module.exports = router;