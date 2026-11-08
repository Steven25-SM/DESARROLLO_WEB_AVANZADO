import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
    const adminEmail = 'admin@tecsup.edu.pe';
    const existingAdmin = await userRepository.findByEmail(adminEmail);

    if (!existingAdmin) {
        let adminRole = await roleRepository.findByName('admin');
        if (!adminRole) {
            adminRole = await roleRepository.create({ name: 'admin' });
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        const hashedPassword = await bcrypt.hash('Admin123#', saltRounds);

        await userRepository.create({
            name: 'Admin',
            lastName: 'Tecsup',
            email: adminEmail,
            password: hashedPassword,
            phoneNumber: '999888777',
            birthdate: new Date('1990-01-01'),
            adress: 'Av. Tecsup 123',
            url_profile: 'https://via.placeholder.com/150',
            roles: [adminRole._id]
        });

        console.log('Seeded Admin User: admin@tecsup.edu.pe / Admin123#');
    }
}