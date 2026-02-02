import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        console.log("Try to connect to Mongoose...")
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongoose connected")
    } catch (error) {
        console.error("Mongoose connection error:", error)
        process.exit(1) // 1 indicates failure, exit the process. 0 mean success
    }
}
