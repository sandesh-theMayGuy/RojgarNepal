import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import User from "./userModel.js";
import Booking from "./bookingModel.js";



const Review = sequelize.define('Review', {
  rid: {
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
  bid: {
    type: DataTypes.INTEGER,
    references: {
      model: Booking,
      key: 'bid'
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

Review.belongsTo(User, { foreignKey: 'uid' });
Review.belongsTo(Booking, { foreignKey: 'bid' });


export default Review;