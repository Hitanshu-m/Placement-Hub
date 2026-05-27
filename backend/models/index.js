const sequelize = require('../config/database');

const User = require('./User');
const Student = require('./Student');
const Company = require('./Company');
const Job = require('./Internship');
const InternshipRecord = require('./InternshipRecord');
const Placement = require('./Placement');
const Notification = require('./Notification');
const Application = require('./Application');
const Document = require('./Document');

module.exports = {
  sequelize,
  User,
  Student,
  Company,
  Job, // Keep Job for legacy but it points to Internship model
  Internship: Job, // Alias
  InternshipRecord,
  Placement,
  Notification,
  Application,
  Document
};
