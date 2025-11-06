import sequelize from '../config/database';
import JobPosting from '../models/JobPosting';
import { addDays } from 'date-fns';

const sampleJobs = [
  {
    cruiseLineName: 'Royal Caribbean International',
    positionTitle: 'Deck Officer',
    positionDescription: 'Join our world-class fleet as a Deck Officer and navigate the world\'s most beautiful destinations. You\'ll be responsible for safe navigation, deck operations, and ensuring the highest standards of maritime safety. Work with state-of-the-art navigation equipment and be part of an international team.',
    requirements: 'Valid STCW certification, Officer of the Watch (OOW) license, minimum 2 years experience as deck officer, excellent communication skills, ability to work in a multicultural environment.',
    specifications: 'Bachelor\'s degree in Maritime Studies preferred, experience with large cruise vessels, knowledge of SOLAS regulations, proficiency in English, additional languages a plus.',
    department: 'Deck',
    employmentType: 'Contract',
    startDate: addDays(new Date(), 30),
    applicationDeadline: addDays(new Date(), 15),
  },
  {
    cruiseLineName: 'Carnival Cruise Line',
    positionTitle: 'Executive Chef',
    positionDescription: 'Lead our culinary team in creating exceptional dining experiences for thousands of guests. Oversee multiple restaurants, manage international cuisine offerings, and ensure the highest food safety standards. This is a leadership role perfect for experienced chefs looking to advance their career.',
    requirements: 'Culinary degree or equivalent, minimum 5 years experience in fine dining, proven leadership skills, food safety certification (HACCP), ability to manage large teams.',
    specifications: 'Experience with international cuisine, knowledge of dietary restrictions and special diets, strong organizational skills, creative menu development experience.',
    department: 'Culinary',
    employmentType: 'Permanent',
    startDate: addDays(new Date(), 45),
    applicationDeadline: addDays(new Date(), 20),
  },
  {
    cruiseLineName: 'Norwegian Cruise Line',
    positionTitle: 'Entertainment Director',
    positionDescription: 'Bring excitement and joy to our guests as Entertainment Director. Coordinate world-class shows, manage entertainment staff, and create unforgettable experiences. Work with Broadway-style productions, live music, and interactive entertainment.',
    requirements: 'Degree in Performing Arts or related field, minimum 3 years experience in entertainment management, strong leadership and organizational skills, creative vision.',
    specifications: 'Experience with large-scale productions, knowledge of sound and lighting systems, ability to work with diverse entertainment teams, excellent guest relations skills.',
    department: 'Entertainment',
    employmentType: 'Contract',
    startDate: addDays(new Date(), 60),
    applicationDeadline: addDays(new Date(), 25),
  },
  {
    cruiseLineName: 'MSC Cruises',
    positionTitle: 'Chief Engineer',
    positionDescription: 'Oversee all engineering operations aboard our luxury cruise ship. Manage engine room operations, maintenance schedules, and ensure compliance with all maritime regulations. Lead a team of engineers and technicians in maintaining our state-of-the-art vessel.',
    requirements: 'Chief Engineer license (STCW), minimum 5 years experience as Chief Engineer, strong technical knowledge, leadership experience, excellent problem-solving skills.',
    specifications: 'Experience with diesel-electric propulsion systems, knowledge of environmental regulations, ability to manage budgets and resources, strong communication skills.',
    department: 'Engineering',
    employmentType: 'Permanent',
    startDate: addDays(new Date(), 40),
    applicationDeadline: addDays(new Date(), 18),
  },
  {
    cruiseLineName: 'Princess Cruises',
    positionTitle: 'Guest Services Manager',
    positionDescription: 'Ensure exceptional guest experiences from embarkation to disembarkation. Lead the guest services team, handle special requests, resolve issues, and maintain the highest standards of customer service. This role is perfect for hospitality professionals who excel at creating memorable experiences.',
    requirements: 'Degree in Hospitality Management or related field, minimum 4 years experience in guest services, proven leadership skills, excellent communication abilities, multilingual preferred.',
    specifications: 'Experience in luxury hospitality, knowledge of cruise operations, strong problem-solving skills, ability to work under pressure, customer-focused mindset.',
    department: 'Guest Services',
    employmentType: 'Contract',
    startDate: addDays(new Date(), 35),
    applicationDeadline: addDays(new Date(), 14),
  },
  {
    cruiseLineName: 'Celebrity Cruises',
    positionTitle: 'Spa Manager',
    positionDescription: 'Manage our world-class spa and wellness center. Oversee spa operations, manage therapists and estheticians, develop wellness programs, and ensure guests receive exceptional spa experiences. Work in a luxurious environment with cutting-edge treatments.',
    requirements: 'Spa management certification, minimum 3 years experience managing spa operations, strong business acumen, excellent customer service skills, knowledge of wellness trends.',
    specifications: 'Experience with luxury spa brands, knowledge of various massage and treatment modalities, ability to train staff, strong sales and marketing skills.',
    department: 'Spa & Wellness',
    employmentType: 'Permanent',
    startDate: addDays(new Date(), 50),
    applicationDeadline: addDays(new Date(), 22),
  },
  {
    cruiseLineName: 'Holland America Line',
    positionTitle: 'Housekeeping Supervisor',
    positionDescription: 'Lead our housekeeping team in maintaining impeccable cleanliness and service standards. Oversee cabin cleaning operations, manage inventory, train staff, and ensure guest satisfaction. This role offers excellent growth opportunities.',
    requirements: 'Minimum 2 years experience in housekeeping management, strong organizational skills, ability to lead and motivate teams, attention to detail, excellent time management.',
    specifications: 'Experience in hospitality industry, knowledge of cleaning procedures and standards, ability to work in fast-paced environment, strong communication skills.',
    department: 'Housekeeping',
    employmentType: 'Contract',
    startDate: addDays(new Date(), 28),
    applicationDeadline: addDays(new Date(), 12),
  },
  {
    cruiseLineName: 'Costa Cruises',
    positionTitle: 'Bar Manager',
    positionDescription: 'Manage multiple bars and lounges across the ship. Create innovative cocktail menus, train bartenders, manage inventory, and ensure exceptional beverage service. Work with premium spirits and create memorable experiences for guests.',
    requirements: 'Bartending certification, minimum 3 years experience in bar management, knowledge of mixology, strong leadership skills, excellent customer service.',
    specifications: 'Experience with craft cocktails, knowledge of wine and spirits, ability to manage inventory and costs, creative menu development, multilingual abilities preferred.',
    department: 'Beverage',
    employmentType: 'Permanent',
    startDate: addDays(new Date(), 42),
    applicationDeadline: addDays(new Date(), 19),
  },
  {
    cruiseLineName: 'Disney Cruise Line',
    positionTitle: 'Youth Activities Coordinator',
    positionDescription: 'Create magical experiences for children and families. Plan and execute age-appropriate activities, manage youth programs, ensure child safety, and bring Disney magic to life. This role is perfect for energetic individuals who love working with children.',
    requirements: 'Degree in Education, Child Development, or related field, minimum 2 years experience working with children, CPR/First Aid certification, background check required, energetic and creative personality.',
    specifications: 'Experience with themed entertainment, knowledge of child development stages, ability to create engaging programs, strong communication with parents, Disney experience a plus.',
    department: 'Youth Programs',
    employmentType: 'Contract',
    startDate: addDays(new Date(), 55),
    applicationDeadline: addDays(new Date(), 24),
  },
  {
    cruiseLineName: 'Cunard Line',
    positionTitle: 'Sommelier',
    positionDescription: 'Curate exceptional wine experiences for our discerning guests. Manage wine cellar, conduct tastings, provide expert pairings, and educate guests about fine wines. Work in elegant dining venues with world-class wine selections.',
    requirements: 'Sommelier certification (WSET Level 3 or equivalent), minimum 3 years experience in fine dining, extensive wine knowledge, excellent presentation skills, strong sales abilities.',
    specifications: 'Knowledge of international wine regions, experience with premium wine service, ability to create wine programs, strong guest interaction skills, multilingual preferred.',
    department: 'Dining',
    employmentType: 'Permanent',
    startDate: addDays(new Date(), 38),
    applicationDeadline: addDays(new Date(), 16),
  },
];

async function seedJobs() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Check if jobs already exist
    const existingJobs = await JobPosting.count();
    if (existingJobs > 0) {
      console.log(`⚠️  ${existingJobs} jobs already exist. Skipping seed.`);
      console.log('   To re-seed, delete existing jobs first.');
      return;
    }

    console.log('🌱 Seeding jobs...');
    
    for (const job of sampleJobs) {
      await JobPosting.create(job);
      console.log(`   ✓ Created: ${job.positionTitle} - ${job.cruiseLineName}`);
    }

    console.log(`\n✅ Successfully seeded ${sampleJobs.length} jobs!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  }
}

seedJobs();

