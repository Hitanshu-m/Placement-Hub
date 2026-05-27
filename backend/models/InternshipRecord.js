const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Company = require('./Company');

const InternshipRecord = sequelize.define('InternshipRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Applied', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected', 'Completed'),
    defaultValue: 'Applied'
  }
});

InternshipRecord.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(InternshipRecord, { foreignKey: 'studentId' });

InternshipRecord.belongsTo(Company, { foreignKey: 'companyId' });
Company.hasMany(InternshipRecord, { foreignKey: 'companyId' });

module.exports = InternshipRecord;
