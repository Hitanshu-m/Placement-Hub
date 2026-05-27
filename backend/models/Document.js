const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING, // e.g., 'Aadhar', '10th Marksheet', '12th Marksheet'
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Rejected'),
    defaultValue: 'Pending'
  }
});

Document.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Document, { foreignKey: 'studentId' });

module.exports = Document;
