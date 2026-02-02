import express from "express"
import { signup } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", (req, res) => {
    // handle login
    res.status(200).json({ message: "Login successful" })
})

router.post("/register", (req, res) => {
    // handle registration
    res.status(201).json({ message: "Registration successful" })
})

export default router
