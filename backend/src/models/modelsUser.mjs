

export default (sequelize,DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    password: { type: DataTypes.STRING, allowNull: false ,valite:{isColString:{msg:"entrer une champs valide"},notNull:{msg:"le nom ne peux pas etre null"}}},
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin', 'rh', 'supervisor', 'agent', 'daf', 'dg'),
      allowNull: false,
    },status_activite: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    avatar: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: DataTypes.DATE,
    department: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
  },{
    createdAt: 'created_at',
    updatedAt: true,
  }, {
    tableName: 'users',
    timestamps: true,
  });
  User.associate = models => {
    User.hasMany(models.Call, { foreignKey: 'user_id' , onDelete: 'CASCADE'});
    User.hasMany(models.TimeEntry, { foreignKey: 'user_id' , onDelete: 'CASCADE'});
    User.hasMany(models.Note, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    User.hasMany(models.Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    User.hasMany(models.ComplianceDocument, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    User.belongsTo(models.LeaveRequest, { foreignKey: 'user_id' , onDelete: 'CASCADE'});

 
    };

  return User;
};