const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadImage = require('../middleware/uploadImage');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.put('/profile-photo', authMiddleware, uploadImage.single('photo'), authController.updateProfilePhoto);

module.exports = router;
