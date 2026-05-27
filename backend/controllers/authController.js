const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Student, Company } = require('../models');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, ...additionalData } = req.body;

    // Check existing user
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Base User
    user = await User.create({
      name, email, password: hashedPassword, role
    });

    // Handle Role Specific Data
    if (role === 'Student') {
      await Student.create({
        userId: user.id,
        cgpa: additionalData.cgpa || null,
        skills: additionalData.skills || '',
      });
    } else if (role === 'Company') {
      await Company.create({
        userId: user.id,
        companyName: additionalData.companyName || name,
        industry: additionalData.industry || '',
      });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    res.json({ token, user: payload });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Student },
        { model: Company }
      ]
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile Photo
exports.updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profilePhotoUrl = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    const { password, ...userWithoutPassword } = user.toJSON();
    res.json({ message: 'Profile photo updated', user: userWithoutPassword });
  } catch (error) {
    console.error("Profile Photo Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
