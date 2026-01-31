const router = require('express').Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.userId });
  res.json(post);
});

router.get('/', async (_, res) => {
  const posts = await Post.find().populate('author', 'name');
  res.json(posts);
});

router.put('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.userId) return res.sendStatus(403);
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

router.delete('/:id', auth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
