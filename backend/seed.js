const bcrypt = require('bcryptjs');
const { sequelize, User, Student, Company, Job } = require('./models');

const seedDatabase = async () => {
  try {
    // Ensure DB is in sync
    await sequelize.sync({ force: true });
    console.log('Database synced and cleared.');

    // Seed Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@college.edu',
      password: adminPassword,
      role: 'Admin'
    });

    // Seed Student
    const studentPassword = await bcrypt.hash('student1', 10);
    const studentUser = await User.create({
      name: 'John Doe',
      email: 'john@student.edu',
      password: studentPassword,
      role: 'Student'
    });
    
    await Student.create({
      cgpa: 8.5,
      skills: 'React, Node.js, SQL',
      resumeUrl: 'https://example.com/resume.pdf',
      userId: studentUser.id
    });

    // Seed Company
    const companyPassword = await bcrypt.hash('company1', 10);
    const companyUser = await User.create({
      name: 'TechCorp HR',
      email: 'hr@techcorp.com',
      password: companyPassword,
      role: 'Company'
    });
    
    const company = await Company.create({
      companyName: 'TechCorp',
      industry: 'Software',
      website: 'www.techcorp.com',
      description: 'A leading software company',
      userId: companyUser.id
    });

    // Seed Job
    await Job.create({
      title: 'Frontend Developer Intern',
      description: 'Work on cutting edge React and Tailwind UI.',
      type: 'Internship',
      salaryRange: '15000 INR/month',
      eligibilityCriteria: 'CGPA > 7.0',
      skillsRequired: 'React, Tailwind, HTML, CSS',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      companyId: company.id
    });

    console.log('Seed data inserted successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
