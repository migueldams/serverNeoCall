// models/ComplianceDocument.model.js
export default (sequelize, DataTypes) => {
    const ComplianceDocument = sequelize.define('ComplianceDocument', {
        id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
        name: DataTypes.STRING,
        type: {
            type: DataTypes.ENUM('gdpr', 'policy', 'procedure', 'contract'),
        },
        version: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('draft', 'active', 'archived'),
        },
        content: DataTypes.TEXT
    },
        {
            createdAt: 'created_at',
            updatedAt: false,
        });
        ComplianceDocument.associate = models => {
    ComplianceDocument.hasMany(models.User, { foreignKey: 'user_id' });
    };

    return ComplianceDocument;
};
