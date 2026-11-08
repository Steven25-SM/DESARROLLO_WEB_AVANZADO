import postRepository from "../repositories/postRepository.js";
import userRepository from "../repositories/userRepository.js";

class PostService {
    async createPost(userId, postData) {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error("Usuario no encontrado");
        return await postRepository.create({ ...postData, user: user._id });
    }
    async getPosts() {
        return await postRepository.findAll();
    }
    async getPostById(id) {
        return await postRepository.findById(id);
    }
    async getPostsByUser(userId) {
        return await postRepository.findByUser(userId);
    }
    async updatePost(id, postData) {
        return await postRepository.update(id, postData);
    }
    async deletePost(id) {
        return await postRepository.delete(id);
    }
}

export default new PostService();