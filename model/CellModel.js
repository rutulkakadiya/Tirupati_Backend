// models/Cell.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./UserModel');

const cellData = sequelize.define('cell_data', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  row: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  column: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_modified_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: false,
});

User.hasMany(cellData, { foreignKey: 'last_modified_by' });
cellData.belongsTo(User, { foreignKey: 'last_modified_by' });

module.exports = cellData;