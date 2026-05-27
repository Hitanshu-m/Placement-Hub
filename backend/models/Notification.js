const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
});

Notification.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Notification, { foreignKey: 'userId' });

module.exports = Notification;
