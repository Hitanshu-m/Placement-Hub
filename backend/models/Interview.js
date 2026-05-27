const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Company = require('./Company');
const Job = require('./Job');

const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mode: {
    type: DataTypes.ENUM('Online', 'Offline'),
    defaultValue: 'Online'
  },
  linkOrVenue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
    defaultValue: 'Scheduled'
  }
});

Interview.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Interview, { foreignKey: 'studentId' });

Interview.belongsTo(Company, { foreignKey: 'companyId' });
Company.hasMany(Interview, { foreignKey: 'companyId' });

Interview.belongsTo(Job, { foreignKey: 'jobId' });
Job.hasMany(Interview, { foreignKey: 'jobId' });

module.exports = Interview;
