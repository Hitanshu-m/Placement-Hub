const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.use(authMiddleware, roleMiddleware(['Student']));

router.get('/profile', studentController.getProfile);
router.put('/profile', upload.single('resume'), studentController.updateProfile);
router.get('/recommendations', studentController.getRecommendations);
router.post('/apply/:jobId', studentController.applyJob);
router.get('/applications', studentController.getApplications);

module.exports = router;
