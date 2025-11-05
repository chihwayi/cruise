import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Candidate from './Candidate';

interface DocumentAttributes {
  id: string;
  candidateId: string;
  documentType: 'passport' | 'visa' | 'medical' | 'seaman_book' | 'contract' | 'employment_agreement' | 'stcw_certificate' | 'peme' | 'identity_card' | 'resume' | 'certificate' | 'other';
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  expiryDate?: Date;
  isExpired: boolean;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isExpired' | 'isVerified'> {}

class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public id!: string;
  public candidateId!: string;
  public documentType!: 'passport' | 'visa' | 'medical' | 'seaman_book' | 'contract' | 'employment_agreement' | 'stcw_certificate' | 'peme' | 'identity_card' | 'resume' | 'certificate' | 'other';
  public fileName!: string;
  public fileUrl!: string;
  public fileSize?: number;
  public mimeType?: string;
  public expiryDate?: Date;
  public isExpired!: boolean;
  public isVerified!: boolean;
  public verifiedAt?: Date;
  public verifiedBy?: string;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public candidate?: Candidate;
}

Document.init(
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
    documentType: {
      type: DataTypes.ENUM('passport', 'visa', 'medical', 'seaman_book', 'contract', 'employment_agreement', 'stcw_certificate', 'peme', 'identity_card', 'resume', 'certificate', 'other'),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
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
    tableName: 'documents',
    timestamps: true,
    indexes: [
      { fields: ['candidateId'] },
      { fields: ['documentType'] },
      { fields: ['isExpired'] },
      { fields: ['expiryDate'] },
    ],
  }
);

Document.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });

export default Document;

