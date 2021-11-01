const router = require('express').Router();
const {User, Post, Comment} = require('../../models');

//GET /api/post routes
//get all posts
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at'
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
            'created_at'
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
        user_id: req.body.user_id
    })
    .then(dbPostdata => res.json(dbPostdata))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//route to put
router.put('/:id', (req, res) => {
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