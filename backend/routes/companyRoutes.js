const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware, roleMiddleware(['Company']));

router.post('/jobs', companyController.postInternship);
router.get('/jobs', companyController.getCompanyInternships);
router.get('/jobs/:jobId/applications', companyController.getInternshipApplications);
router.put('/applications/:id/status', companyController.updateApplicationStatus);

module.exports = router;
