// models/FinancialReport.model.js
export default (sequelize, DataTypes) => {
  const FinancialReport = sequelize.define('FinancialReport', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    period: DataTypes.STRING,
    totalRevenue: DataTypes.FLOAT,
    totalExpenses: DataTypes.FLOAT,
    profit: DataTypes.FLOAT,
    campaigns: {
      type: DataTypes.JSON,
    },
    createdAt: DataTypes.DATE,
  },
  {
    createdAt: 'created_at',
    updatedAt: false,
  });

  return FinancialReport;
};
