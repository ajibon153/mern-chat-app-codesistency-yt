import cloudinary from "../lib/cloudinary.js"
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
                    profilePic: newUser.profilePic,
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
export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const token = generateToken(user._id, res)

        res.status(200).json({
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
                token
            },
            message: "Login successful"
        })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "Server Error in login controller: " + error })
    }
}

export const logout = async (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 0 // expire the cookie immediately
    })
    res.status(200).json({ message: "Logout successful" })
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        if (!profilePic) return res.status(400).json({ message: "Profile picture is required" })

        const userId = req.user._id

        const uploadPicture = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadPicture.secure_url },
            { new: true }
        )
        res.status(200).json({
            data: updatedUser,
            message: "Profile updated successfully"
        })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "Server Error in updateProfile controller: " + error })
    }
}
