import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Candidate from './Candidate';
import JobPosting from './JobPosting';

interface ApplicationAttributes {
  id: string;
  candidateId: string;
  jobPostingId: string;
  personalSummary?: string;
  screeningStatus: 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'interview_scheduled' | 'hired';
  screeningScore?: number;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'screeningStatus'> {}

class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  public id!: string;
  public candidateId!: string;
  public jobPostingId!: string;
  public personalSummary?: string;
  public screeningStatus!: 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'interview_scheduled' | 'hired';
  public screeningScore?: number;
  public resumeUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public candidate?: Candidate;
  public jobPosting?: JobPosting;
}

Application.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'candidates',
        key: 'id',
      },
    },
    jobPostingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'job_postings',
        key: 'id',
      },
    },
    personalSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    screeningStatus: {
      type: DataTypes.ENUM('pending', 'screening', 'shortlisted', 'rejected', 'interview_scheduled', 'hired'),
      defaultValue: 'pending',
    },
    screeningScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    resumeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'applications',
    timestamps: true,
    indexes: [
      { fields: ['candidateId'] },
      { fields: ['jobPostingId'] },
      { fields: ['screeningStatus'] },
      { fields: ['screeningScore'] },
    ],
  }
);

// Define associations
Application.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });
Application.belongsTo(JobPosting, { foreignKey: 'jobPostingId', as: 'jobPosting' });

export default Application;

