const { Student, Job, Application, Document, User, Company } = require('../models');

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) {
      student = await Student.create({ userId: req.user.id });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update Student Profile
exports.updateProfile = async (req, res) => {
  try {
    const { cgpa, skills } = req.body;
    let student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) {
      student = await Student.create({ userId: req.user.id });
    }

    if (cgpa !== undefined && cgpa !== '') student.cgpa = cgpa;
    if (skills !== undefined && skills !== '') student.skills = skills;
    if (req.file) {
      student.resumeUrl = `/uploads/resumes/${req.file.filename}`;
      // Pushing uploaded document to the Admin's pipeline for validation:
      await Document.create({
        studentId: student.id,
        type: 'Resume PDF',
        url: student.resumeUrl,
        status: 'Pending'
      });
    }

    await student.save();

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Check Smart Job Recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student || !student.skills) return res.json([]);

    const studentSkills = student.skills.toLowerCase().split(',').map(s => s.trim());
    
    // Simple matching algorithm: Jobs requiring at least one matching skill
    const jobs = await Job.findAll({
      where: { status: 'Open' },
      include: [{ model: Company, attributes: ['companyName'] }]
    });
    
    const recommended = jobs.filter(job => {
      if (!job.skillsRequired) return false;
      const jobSkills = job.skillsRequired.toLowerCase().split(',').map(s => s.trim());
      return jobSkills.some(skill => studentSkills.includes(skill));
    });

    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Apply for a Job/Internship
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const student = await Student.findOne({ where: { userId: req.user.id } });
    
    if (!student) return res.status(400).json({ message: 'Student profile not found' });
    if (!student.resumeUrl) return res.status(400).json({ message: 'Please upload a resume first' });

    const job = await Job.findByPk(jobId);
    if (!job || job.status !== 'Open') return res.status(400).json({ message: 'Job not available' });

    // Check if already applied
    const existing = await Application.findOne({ where: { studentId: student.id, jobId } });
    if (existing) return res.status(400).json({ message: 'Already applied for this job' });

    const application = await Application.create({
      studentId: student.id,
      jobId,
      resumeUsed: student.resumeUrl
    });

    res.status(201).json({ message: 'Applied successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// View Applied Jobs
exports.getApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) return res.json([]);

    const applications = await Application.findAll({
      where: { studentId: student.id },
      include: [
        { model: Job, include: [{ model: Company, include: [{ model: User, attributes: ['name', 'email'] }] }] }
      ]
    });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
