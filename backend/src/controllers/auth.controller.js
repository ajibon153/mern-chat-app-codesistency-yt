import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" })
        }

        // create model first
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        // 123456 => as$dffghjkl_dn34t5g6h7j8k9
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ fullName, email, password: hashedPassword })
        if (newUser) {
            await newUser.save()
            const token = generateToken(newUser._id, res) // set cookie

            res.status(201).json({
                // 201 mean something successfully CREATED
                data: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    token
                },
                message: "User created successfully"
            })

            // TODO send welcome email to user
        } else {
            res.status(400).json({ message: "Failed to create user" })
        }
    } catch (error) {
        console.log("error", error)

        res.status(500).json({ message: "Server Error in signup controller: " + error })
    }
}
