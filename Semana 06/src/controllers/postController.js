import postService from "../services/postService.js";
import userRepository from "../repositories/userRepository.js";

function parseHashtags(hashtags) {
    return hashtags ? hashtags.split(",").map(h => h.trim()).filter(Boolean) : [];
}

class PostController {
    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            res.render("posts", { posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async showCreateForm(req, res) {
        const users = await userRepository.findAll();
        res.render("post-form", { post: null, users });
    }
    async create(req, res) {
        try {
            const { userId, hashtags, ...rest } = req.body;
            const postData = { ...rest, hashtags: parseHashtags(hashtags) };
            await postService.createPost(userId, postData);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    async showEditForm(req, res) {
        const post = await postService.getPostById(req.params.id);
        const users = await userRepository.findAll();   // 👈 ahora sí se cargan
        res.render("post-form", { post, users });
    }
    async update(req, res) {
        try {
            const { hashtags, userId, ...rest } = req.body;
            const postData = { ...rest, hashtags: parseHashtags(hashtags) };
            if (userId) postData.user = userId;   // 👈 permite cambiar el autor
            await postService.updatePost(req.params.id, postData);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    async delete(req, res) {
        await postService.deletePost(req.params.id);
        res.redirect("/posts");
    }
}

export default new PostController();