const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');

const Internship = sequelize.define('Internship', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Internship'),
    defaultValue: 'Full-time',
  },
  salaryRange: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  eligibilityCriteria: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stipend: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  skillsRequired: {
    type: DataTypes.STRING, // Comma separated for smart match
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Open', 'Closed'),
    defaultValue: 'Open'
  }
});

Internship.belongsTo(Company, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Company.hasMany(Internship, { foreignKey: 'companyId' });

module.exports = Internship;
