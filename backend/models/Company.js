const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Company = sequelize.define('Company', {
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

// Setup relationships
Company.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Company, { foreignKey: 'userId' });

module.exports = Company;
