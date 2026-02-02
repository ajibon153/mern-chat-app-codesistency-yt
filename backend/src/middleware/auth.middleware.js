import { ENV } from "../lib/env"
import jwt from "jsonwebtoken"

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" })
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" })
        }

        const user = await User.findById(decoded.userId).select("-password")
        if (!user) return res.status(401).json({ message: "Unauthorized: User not found" })
        req.user = user
        next()
    } catch (error) {
        console.log("Error in auth middleware:", error)

        return res.status(401).json({ message: "Unauthorized: Invalid token" })
    }
}
