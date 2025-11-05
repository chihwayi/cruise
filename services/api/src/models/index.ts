import sequelize from '../config/database';
import Candidate from './Candidate';
import JobPosting from './JobPosting';
import Application from './Application';
import EmploymentHistory from './EmploymentHistory';
import Document from './Document';
import Contract from './Contract';

// Initialize all models
const models = {
  Candidate,
  JobPosting,
  Application,
  EmploymentHistory,
  Document,
  Contract,
};

// Sync database (use with caution in production)
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Database sync error:', error);
    throw error;
  }
};

export default models;

