const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Internship = require('./Internship');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('Applied', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected'),
    defaultValue: 'Applied'
  },
  resumeUsed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  matchScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  }
});

Application.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Application, { foreignKey: 'studentId' });

Application.belongsTo(Internship, { foreignKey: 'internshipId' });
Internship.hasMany(Application, { foreignKey: 'internshipId' });

module.exports = Application;
