import userRepository from '../repositories/UserRepository.js';

class UserService {
    async getAll() {
        return userRepository.getAll();
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            age: user.age,
            adress: user.adress,
            url_profile: user.url_profile,
            roles: user.roles.map(r => r.name),
            createdAt: user.createdAt
        };
    }

    async updateProfile(id, updateData) {
        delete updateData.password; // Evitar actualizar contraseña por este endpoint
        delete updateData.roles;
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        Object.assign(user, updateData);
        await user.save();
        return this.getById(id);
    }
}

export default new UserService();