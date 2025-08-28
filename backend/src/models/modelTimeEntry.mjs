import { DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export default (sequelize,DataTypes) => {
  const TimeEntry = sequelize.define('TimeEntry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },userId:{
      type: DataTypes.INTEGER,
    },
    
    checkIn: {type: DataTypes.DATE ,defaultValue: Sequelize.NOW},
    checkOut: DataTypes.DATE,
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW // 🟢 Définit automatiquement la date du jour
    },
    duration: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'half_day'),
      defaultValue : 'present'
    },
    notes: DataTypes.TEXT
  }, {
    tableName: 'time_entries',
    timestamps: false
  });
  TimeEntry.associate = models => {
  TimeEntry.belongsTo(models.User, { foreignKey: 'userId' });
}


  return TimeEntry;
};
