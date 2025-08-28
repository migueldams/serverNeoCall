// models/Notification.model.js
export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },userId:{
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
    type: {
      type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
    },
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  
  },{
    createdAt: 'created_at',
    updatedAt: true,
  }, {
    tableName: 'users',
    timestamps: true,
  });
  Notification.associate = models => {
    Notification.hasMany(models.User, { foreignKey: 'user_id' });
    };


  return Notification;
};
