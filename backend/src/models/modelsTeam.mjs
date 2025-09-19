
export default (sequelize,DataTypes) => {
  const Team = sequelize.define('Team', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },status_activite: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    campaing:{
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    avatar: DataTypes.STRING,

  },{
    createdAt: 'created_at',
    updatedAt: true,
  }, {
    tableName: 'teams',
    timestamps: true,
  });
  Team.associate = models => {
    Team.hasMany(models.User, { foreignKey: 'team',as: "users", onDelete: 'CASCADE'});
    };

  return Team;
};