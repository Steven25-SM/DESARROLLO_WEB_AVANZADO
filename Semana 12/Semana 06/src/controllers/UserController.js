import userRepository from "../repositories/userRepository.js";

class UserController {
    async showCreateForm(req, res) {
        res.render("user-form");
    }
    async create(req, res) {
        try {
            await userRepository.create(req.body);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}

export default new UserController();