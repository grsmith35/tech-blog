const router = require('express').Router();
const {User, Post, Comment} = require('../../models');

//GET /api/comment routes
router.get('/', (req, res) => {
    Comment.findAll({})
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.post('/', (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
    Comment.update(req.body, {
        where: {
            id: req.body.id
        }
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.delete('./:id', (req, res) => {
    Comment.destroy({
        where: {id: req.body.id}
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(400).json({message: "No comments were found with this id"});
        }
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});


module.exports = router;