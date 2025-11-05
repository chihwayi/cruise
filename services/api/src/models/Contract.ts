import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Candidate from './Candidate';
import JobPosting from './JobPosting';

interface ContractAttributes {
  id: string;
  candidateId: string;
  jobPostingId?: string;
  contractNumber: string;
  contractType: 'temporary' | 'permanent' | 'seasonal';
  startDate: Date;
  endDate?: Date;
  joiningDate?: Date;
  signOffDate?: Date;
  vesselName?: string;
  position: string;
  salary?: number;
  currency?: string;
  status: 'draft' | 'pending_signature' | 'signed' | 'active' | 'completed' | 'terminated';
  signedAt?: Date;
  signedBy?: string;
  documentUrl?: string;
  terms?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface ContractCreationAttributes extends Optional<ContractAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'> {}

class Contract extends Model<ContractAttributes, ContractCreationAttributes> implements ContractAttributes {
  public id!: string;
  public candidateId!: string;
  public jobPostingId?: string;
  public contractNumber!: string;
  public contractType!: 'temporary' | 'permanent' | 'seasonal';
  public startDate!: Date;
  public endDate?: Date;
  public joiningDate?: Date;
  public signOffDate?: Date;
  public vesselName?: string;
  public position!: string;
  public salary?: number;
  public currency?: string;
  public status!: 'draft' | 'pending_signature' | 'signed' | 'active' | 'completed' | 'terminated';
  public signedAt?: Date;
  public signedBy?: string;
  public documentUrl?: string;
  public terms?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public candidate?: Candidate;
  public jobPosting?: JobPosting;
}

Contract.init(
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
      allowNull: true,
      references: {
        model: 'job_postings',
        key: 'id',
      },
    },
    contractNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contractType: {
      type: DataTypes.ENUM('temporary', 'permanent', 'seasonal'),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    joiningDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    signOffDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vesselName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'USD',
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending_signature', 'signed', 'active', 'completed', 'terminated'),
      defaultValue: 'draft',
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    signedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    documentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    terms: {
      type: DataTypes.JSONB,
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
    tableName: 'contracts',
    timestamps: true,
    indexes: [
      { fields: ['candidateId'] },
      { fields: ['contractNumber'] },
      { fields: ['status'] },
      { fields: ['startDate'] },
    ],
  }
);

Contract.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });
Contract.belongsTo(JobPosting, { foreignKey: 'jobPostingId', as: 'jobPosting' });

export default Contract;

