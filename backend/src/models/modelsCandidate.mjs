// models/Candidate.model.js
export default (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    phone: DataTypes.STRING,
    position: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('applied', 'screening', 'interview', 'hired', 'rejected'),
    },
    resume: DataTypes.STRING,
    experience: DataTypes.INTEGER,
    skills: {
      type: DataTypes.JSON,
    },
    salary: DataTypes.FLOAT,
    interviewDate: DataTypes.DATE,
    notes: DataTypes.TEXT,
  },{
    createdAt: 'created_at',
    updatedAt: false,
  },);

  return Candidate;
};
