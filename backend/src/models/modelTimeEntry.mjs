import { DataTypes } from 'sequelize';

export default (sequelize,DataTypes) => {
  const TimeEntry = sequelize.define('TimeEntry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
    date: DataTypes.DATEONLY,
    duration: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'half_day')
    },
    notes: DataTypes.TEXT
  }, {
    tableName: 'time_entries',
    timestamps: false
  });
  TimeEntry.associate = models => {
    TimeEntry.belongsTo(models.User, { foreignKey: 'user_id' });
  };


  return TimeEntry;
};
