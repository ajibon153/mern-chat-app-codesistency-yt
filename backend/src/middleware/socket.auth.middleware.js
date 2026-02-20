import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { ENV } from "../lib/env.js"
import { log } from "console"

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1]

        if (!token) {
            console.log("Socket connection rejected: No token provided")
            return next(new Error("Unauthorized: No token provided"))
        }

        // verify token
        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token")
            return next(new Error("Unauthorized: Invalid token"))
        }

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) return res.status(401).json({ message: "Unauthorized: User not found" })

        // Attach user info to socket object for later use in event handlers
        socket.user = user
        socket.userId = user._id.toString()

        console.log("Socket authenticated for user:", user.fullName, "with ID:", socket.userId)
        next()
    } catch (error) {
        console.log("Error in socket authentication middleware:", error)
        return next(new Error("Unauthorized: Error authenticating user"))
    }
}
