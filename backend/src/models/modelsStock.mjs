// models/Stock.model.js
export default (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    minThreshold: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    supplier: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('in_stock', 'low_stock', 'out_of_stock'),
    },
  },
  {
    createdAt: 'created_at',
    updatedAt: true,
  }
);

  return Stock;
};
