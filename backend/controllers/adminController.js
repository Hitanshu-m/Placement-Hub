const { User, Student, Company, Job, Internship, Placement, Document } = require('../models');

// Get all users by role
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const whereClause = role ? { role } : {};
    const users = await User.findAll({ 
      where: whereClause,
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Verify Document
exports.verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Verified' or 'Rejected'

    const doc = await Document.findByPk(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    doc.status = status;
    await doc.save();

    // Check if all student docs are verified to update student documentStatus
    if (status === 'Verified') {
      const pendingDocs = await Document.count({ where: { studentId: doc.studentId, status: 'Pending' }});
      if (pendingDocs === 0) {
        await Student.update({ documentStatus: 'Approved' }, { where: { id: doc.studentId }});
      }
    }

    res.json({ message: 'Document updated successfully', doc });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const totalCompanies = await Company.count();
    const totalJobs = await Job.count();
    const totalPlacements = await Placement.count();

    res.json({ totalStudents, totalCompanies, totalJobs, totalPlacements });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Pending Documents
exports.getPendingDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({ 
      where: { status: 'Pending' },
      include: [{ model: Student, include: [User] }]
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
