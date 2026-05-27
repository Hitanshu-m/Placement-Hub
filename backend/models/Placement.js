const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Company = require('./Company');

const Placement = sequelize.define('Placement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

Placement.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasOne(Placement, { foreignKey: 'studentId' });

Placement.belongsTo(Company, { foreignKey: 'companyId' });
Company.hasMany(Placement, { foreignKey: 'companyId' });

module.exports = Placement;
