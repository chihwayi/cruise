import sequelize from '../config/database';
import Candidate from '../models/Candidate';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cruiserecruit.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
    const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
    const adminLastName = process.env.ADMIN_LAST_NAME || 'User';

    // Check if admin already exists
    const existingAdmin = await Candidate.findOne({ where: { email: adminEmail } });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', adminEmail);
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password: (use existing password or reset)');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    await Candidate.create({
      email: adminEmail,
      passwordHash,
      firstName: adminFirstName,
      lastName: adminLastName,
      isActive: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📋 ADMIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🌐 Login URL: http://localhost:4001/login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('⚠️  IMPORTANT: The role "admin" is set in the JWT token during login.');
    console.log('   You need to modify the login endpoint to check for admin emails');
    console.log('   and set role: "admin" in the JWT token.');
    console.log('');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

