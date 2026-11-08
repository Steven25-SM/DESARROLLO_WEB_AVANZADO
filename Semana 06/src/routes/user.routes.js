import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

router.get("/new", userController.showCreateForm);
router.post("/", userController.create);

export default router;