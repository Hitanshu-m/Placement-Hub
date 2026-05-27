const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware, roleMiddleware(['Admin']));

router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/documents/pending', adminController.getPendingDocuments);
router.put('/document/:id/verify', adminController.verifyDocument);
router.get('/stats', adminController.getStats);

module.exports = router;
