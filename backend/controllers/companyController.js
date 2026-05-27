const { Internship, Application, Student, User, Notification } = require('../models');

// Post a new Job/Internship
exports.postInternship = async (req, res) => {
  try {
    const { title, description, type, salaryRange, eligibilityCriteria, skillsRequired, deadline, domain, location, stipend } = req.body;
    
    // get company id from user
    const companyUser = await User.findByPk(req.user.id, { include: 'Company' });
    if (!companyUser || !companyUser.Company) {
      return res.status(400).json({ message: 'Company profile not found' });
    }

    const internship = await Internship.create({
      title,
      description,
      type: type || 'Full-time',
      salaryRange,
      eligibilityCriteria,
      skillsRequired,
      deadline,
      domain,
      location,
      stipend,
      companyId: companyUser.Company.id
    });

    res.status(201).json({ message: 'Job posted successfully', internship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get internships posted by company
exports.getCompanyInternships = async (req, res) => {
  try {
    const companyUser = await User.findByPk(req.user.id, { include: 'Company' });
    const internships = await Internship.findAll({ where: { companyId: companyUser.Company.id }});
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// View applications for a specific job
exports.getInternshipApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.findAll({
      where: { internshipId: jobId },
      include: [
        { model: Student, include: [{ model: User, attributes: ['name', 'email'] }] }
      ]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update Application Status (Shortlist, Reject, etc)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. 'Shortlisted', 'Rejected'
    
    const application = await Application.findByPk(id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await application.save();

    const student = await Student.findByPk(application.studentId);
    if (student) {
      const internship = await Internship.findByPk(application.internshipId);
      if (internship) {
        let msg = `Your application for ${internship.title} was updated to ${status}.`;
        if (status === 'Selected') msg = `Congratulations! You have been hired for ${internship.title}!`;
        if (status === 'Rejected') msg = `Unfortunately, your application for ${internship.title} was not selected.`;
        
        await Notification.create({
          userId: student.userId,
          message: msg
        });
      }
    }

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
