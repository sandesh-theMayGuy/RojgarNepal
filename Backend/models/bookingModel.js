import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import User from "./userModel.js";
import Service from "./serviceModel.js";


const Booking = sequelize.define('Booking', {
  bid: {
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
  sid: {
    type: DataTypes.INTEGER,
    references: {
      model: Service,
      key: 'sid'
    }
  },
  bookingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  bookingTime: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  timestamps: false
});


Booking.belongsTo(User, { foreignKey: 'uid' });
Booking.belongsTo(Service, { foreignKey: 'sid' });


export default Booking;