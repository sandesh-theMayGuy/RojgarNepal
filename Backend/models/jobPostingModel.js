import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import User from "./userModel.js";


const JobPosting = sequelize.define('JobPosting', {
  jpid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  uid: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'uid'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

JobPosting.belongsTo(User, { foreignKey: 'uid' });



  export default JobPosting;