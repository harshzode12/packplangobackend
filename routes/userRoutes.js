import express from 'express';
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin / Protected routes
router.get('/', getUsers);        // get all users
router.get('/:id', getUserById); // get user by ID
router.put('/:id', updateUser);  // update user
router.delete('/:id', deleteUser); // delete user

export default router;
