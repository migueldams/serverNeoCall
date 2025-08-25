import { DataTypes } from 'sequelize';

export default (sequelize,DataTypes) => {
  const Call = sequelize.define('Call', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerName: DataTypes.STRING,
    customerPhone: DataTypes.STRING,
    campaign: DataTypes.STRING,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('en_cours', 'termine', 'annule', 'rappel'),
      allowNull: false
    },
    outcome: DataTypes.STRING,
    notes: DataTypes.TEXT,
    tags: {
      type: DataTypes.JSON
    },
    recording: DataTypes.STRING
  }, {
    tableName: 'calls',
    timestamps: false
  });
  Call.associate = models => {
    Call.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Call;
};
