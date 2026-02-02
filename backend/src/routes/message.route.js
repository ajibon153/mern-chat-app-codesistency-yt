import express from "express"

const router = express.Router()

router.get("/get", (req, res) => {
    // handle login
    res.status(200).json({ message: "Messages retrieved successfully" })
})

router.post("/send", (req, res) => {
    // handle login
    res.status(200).json({ message: "Message sent successfully" })
})

export default router
