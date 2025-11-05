import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface JobPostingAttributes {
  id: string;
  cruiseLineName: string;
  positionTitle: string;
  positionDescription: string;
  requirements: string;
  specifications: string;
  department?: string;
  employmentType?: string;
  startDate?: Date;
  applicationDeadline?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface JobPostingCreationAttributes extends Optional<JobPostingAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> {}

class JobPosting extends Model<JobPostingAttributes, JobPostingCreationAttributes> implements JobPostingAttributes {
  public id!: string;
  public cruiseLineName!: string;
  public positionTitle!: string;
  public positionDescription!: string;
  public requirements!: string;
  public specifications!: string;
  public department?: string;
  public employmentType?: string;
  public startDate?: Date;
  public applicationDeadline?: Date;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

JobPosting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cruiseLineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    positionTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    positionDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employmentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    applicationDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'job_postings',
    timestamps: true,
    indexes: [
      { fields: ['cruiseLineName'] },
      { fields: ['positionTitle'] },
      { fields: ['isActive'] },
      { fields: ['applicationDeadline'] },
    ],
  }
);

export default JobPosting;

