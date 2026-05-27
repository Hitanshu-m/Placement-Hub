const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Student = sequelize.define('Student', {
  cgpa: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  skills: {
    type: DataTypes.STRING, // Comma separated for display/search
    allowNull: true,
  },
  skillsData: {
    type: DataTypes.JSON, // For structured skill data from AI analyzer
    allowNull: true,
  },
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documentStatus: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending'
  }
});

// Setup relationships
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

module.exports = Student;
