import { DataTypes } from 'sequelize';

export default (sequelize,DataTypes) => {
  const Note = sequelize.define('Note', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",   // nom de la table parent
        key: "id"
      }},
   
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    category: {
      type: DataTypes.ENUM('personal', 'work', 'project', 'idea', 'meeting', 'reminder')
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high')
    },
    tags: {
      type: DataTypes.JSON
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    createdAt: 'created_at',
    updatedAt: true,
  },
   {
    tableName: 'notes',
    timestamps: false
  });
  Note.associate = models => {
    Note.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Note;
};
