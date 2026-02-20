import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password") // $ne means not equal to

        res.status(200).json({ data: filteredUsers, message: "Contacts retrieved successfully" })
    } catch (error) {
        console.log("Error getAllContacts", error)
        res.status(500).json({ message: "Server Error in get all contacts controller: " + error.message })
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        // find all the messages where the logged-in user is either the sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
        })

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            )
        ]

        const chatPartner = await User.find({ _id: { $in: chatPartnerIds } }).select("-password")
        res.status(200).json({ data: chatPartner, message: "Chat partners retrieved successfully" })
    } catch (error) {
        console.log("Error getChatPartners", error)
        res.status(500).json({ message: "Server Error in get all contacts controller: " + error.message })
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id
        const { chatId: userToChatId } = req.params

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }) // sort by createdAt in ascending order

        res.status(200).json({ data: messages, message: "Messages retrieved successfully" })
    } catch (error) {
        console.log("Error getMessagesByUserId", error)
        res.status(500).json({ message: "Server Error in get messages by user id controller: " + error.message })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const senderId = req.user._id
        const receiverId = req.params.chatId

        let imageUrl
        if (image) {
            // upload image to cloudinary
            const response = await cloudinary.uploader.upload(image)
            imageUrl = response.secure_url
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text,
            image: imageUrl || null
        })

        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            // check if the user is online
            // to() = just send the new message to the receiver in real-time using sockets
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        // TODO: send message in real-time if user is online - sockets
        res.status(201).json({ data: newMessage, message: "Message sent successfully" })
    } catch (error) {
        console.log("Error getMessagesByUserId", error)
        res.status(500).json({ message: "Server Error in get messages by user id controller: " + error.message })
    }
}
