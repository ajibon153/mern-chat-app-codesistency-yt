import express from "express"

const router = express.Router()

router.get("/signup", (req, res) => {
    // handle login
    res.status(200).json({ message: "Signup successful" })
})

router.post("/login", (req, res) => {
    // handle login
    res.status(200).json({ message: "Login successful" })
})

router.post("/register", (req, res) => {
    // handle registration
    res.status(201).json({ message: "Registration successful" })
})

export default router
