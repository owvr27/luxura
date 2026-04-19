import { hashPassword } from './auth.js';
import prisma from './prisma.js';
async function main() {
    console.log('🌱 Seeding database...');
    // Create default admin user
    const adminEmail = 'admin@luxora.com';
    const adminPassword = 'admin123'; // Change this in production!
    const adminName = 'Admin User';
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (existingAdmin) {
        console.log('✅ Admin user already exists');
        // Update to admin role if not already
        if (existingAdmin.role !== 'admin') {
            await prisma.user.update({
                where: { email: adminEmail },
                data: { role: 'admin' },
            });
            console.log('✅ Updated existing user to admin role');
        }
    }
    else {
        const passwordHash = await hashPassword(adminPassword);
        await prisma.user.create({
            data: {
                name: adminName,
                email: adminEmail,
                role: 'admin',
                passwordHash,
            },
        });
        console.log('✅ Created admin user');
    }
    console.log('\n📋 Default Admin Credentials:');
    console.log('   Email: admin@luxora.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the password in production!');
    console.log('✅ Seeding completed!\n');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
