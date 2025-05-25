const { DataTypes, INTEGER, STRING } = require('sequelize');
const { sequelize } = require('../config/db');

const UserModel = sequelize.define('user_registers', {
  // id: {
  //   type: INTEGER,
  //   autoIncrement: true,
  //   primaryKey: true
  // },
  username: { 
    type: STRING, 
    allowNull: false, 
    // unique: true 
  },
  password: { 
    type: STRING, 
    allowNull: false 
  },
  email: { 
    type: STRING, 
    allowNull: false, 
    // unique: true 
  },
  is_admin: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = UserModel;