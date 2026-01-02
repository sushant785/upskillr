import express from "express";
import { register, login, refreshToken, logout } from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
