const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { accessToken, refreshToken } = require('../utils/jwt');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hash });

  const at = accessToken(user._id);
  const rt = refreshToken(user._id);

  res.cookie('refreshToken', rt, { httpOnly: true });
  res.json({ token: at, user });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const at = accessToken(user._id);
  const rt = refreshToken(user._id);

  res.cookie('refreshToken', rt, { httpOnly: true });
  res.json({ token: at, user });
});

router.post('/refresh', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    res.json({ token: accessToken(decoded.id) });
  });
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json({ user });
});

module.exports = router;
