import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register', registerUser);


router.post('/login', loginUser);


router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});


router.get('/me', authMiddleware, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
