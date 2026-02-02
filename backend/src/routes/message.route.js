import express from "express"
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from "../controllers/message.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.use(protectedRoute)

router.get("/contacts", getAllContacts)
router.get("/chats", getChatPartners) // show all contacts that had chat
router.get("/chat/:chatId", getMessagesByUserId)

router.post("/send/:chatId", sendMessage)

export default router
