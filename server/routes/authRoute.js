import express from 'express';
import {login, signOut} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/signout', signOut)

export default router;
