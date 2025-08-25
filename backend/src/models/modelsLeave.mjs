import { DataTypes } from 'sequelize';

export default (sequelize,DataTypes) => {
  const LeaveRequest = sequelize.define('LeaveRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('conge_paye', 'conge_maladie', 'conge_maternite', 'conge_paternite', 'formation', 'personnel'),
      allowNull: false
    },
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    days: DataTypes.INTEGER,
    reason: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false
    },
    approvedBy: DataTypes.STRING,
    rejectionReason: DataTypes.TEXT,
    urgency: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent')
    }
  },
  {
    createdAt: 'created_at',
    updatedAt: true,
  }, {
    tableName: 'leave_requests',
    timestamps: false
  });
   LeaveRequest.associate = models => {
    LeaveRequest.hasMany(models.User, { foreignKey: 'user_id' });
   };

  return LeaveRequest;
};
