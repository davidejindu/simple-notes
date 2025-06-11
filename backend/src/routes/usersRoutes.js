import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Register a new user → POST /api/auth/register
router.post('/register', registerUser);

// Login a user and set JWT cookie → POST /api/auth/login
router.post('/login', loginUser);


router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,  // Cookie can’t be accessed from JS
    secure: true,
    sameSite: 'None',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});
// Clear the JWT cookie → POST /api/auth/logout


// Protected route to verify if user is logged in → GET /api/auth/me
// Returns user info from the token (set by authMiddleware)
router.get('/me', authMiddleware, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});


export default router;
