import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CandidateAttributes {
  id: string;
  email: string;
  passwordHash?: string;
  title?: string;
  firstName: string;
  middleInitials?: string;
  lastName: string;
  age?: number;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  citizenship?: string;
  dateOfBirth?: Date;
  languages?: string[];
  phoneNumber?: string;
  skypeId?: string;
  physicalAddress?: string;
  city?: string;
  country?: string;
  placeOfBirth?: string;
  nextOfKinName?: string;
  nextOfKinRelationship?: string;
  nextOfKinContact?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  height?: number;
  weight?: number;
  hairColor?: string;
  eyeColor?: string;
  bloodGroup?: string;
  employmentNumber?: string;
  profilePhotoUrl?: string;
  crewStatus?: 'onboard' | 'on_vacation' | 'available' | 'unavailable';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CandidateCreationAttributes extends Optional<CandidateAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> {}

class Candidate extends Model<CandidateAttributes, CandidateCreationAttributes> implements CandidateAttributes {
  public id!: string;
  public email!: string;
  public passwordHash?: string;
  public title?: string;
  public firstName!: string;
  public middleInitials?: string;
  public lastName!: string;
  public age?: number;
  public gender?: string;
  public maritalStatus?: string;
  public nationality?: string;
  public citizenship?: string;
  public dateOfBirth?: Date;
  public languages?: string[];
  public phoneNumber?: string;
  public skypeId?: string;
  public physicalAddress?: string;
  public city?: string;
  public country?: string;
  public placeOfBirth?: string;
  public nextOfKinName?: string;
  public nextOfKinRelationship?: string;
  public nextOfKinContact?: string;
  public emergencyContactName?: string;
  public emergencyContactRelationship?: string;
  public emergencyContactPhone?: string;
  public height?: number;
  public weight?: number;
  public hairColor?: string;
  public eyeColor?: string;
  public bloodGroup?: string;
  public employmentNumber?: string;
  public profilePhotoUrl?: string;
  public crewStatus?: 'onboard' | 'on_vacation' | 'available' | 'unavailable';
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Candidate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleInitials: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    citizenship: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    skypeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    physicalAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placeOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKinName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKinRelationship: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKinContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContactRelationship: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    hairColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eyeColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employmentNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    profilePhotoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    crewStatus: {
      type: DataTypes.ENUM('onboard', 'on_vacation', 'available', 'unavailable'),
      allowNull: true,
      defaultValue: 'available',
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
    tableName: 'candidates',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['employmentNumber'] },
      { fields: ['crewStatus'] },
    ],
  }
);

export default Candidate;

