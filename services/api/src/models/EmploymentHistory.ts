import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Candidate from './Candidate';

interface EmploymentHistoryAttributes {
  id: string;
  candidateId: string;
  employerName: string;
  position: string;
  duties: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EmploymentHistoryCreationAttributes extends Optional<EmploymentHistoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isCurrent' | 'endDate'> {}

class EmploymentHistory extends Model<EmploymentHistoryAttributes, EmploymentHistoryCreationAttributes> implements EmploymentHistoryAttributes {
  public id!: string;
  public candidateId!: string;
  public employerName!: string;
  public position!: string;
  public duties!: string;
  public startDate!: Date;
  public endDate?: Date;
  public isCurrent!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public candidate?: Candidate;
}

EmploymentHistory.init(
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
    employerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duties: {
      type: DataTypes.TEXT,
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
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'employment_history',
    timestamps: true,
    indexes: [
      { fields: ['candidateId'] },
    ],
  }
);

EmploymentHistory.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });

export default EmploymentHistory;

