import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdateProfile: false,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data?.data })
        } catch (error) {
            console.log("Error in authCheck:", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data?.data })

            toast.success("Account created successfully!")
        } catch (error) {
            toast.error(error.response.data.message || error?.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data?.data })
            console.log("res", res)

            toast.success("Logged in successfully!")
        } catch (error) {
            console.log("error", error)

            toast.error(error.response.data.message || error?.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged out successfully!")
        } catch (error) {
            toast.error(error.response.data.message || error?.message)
        }
    },

    updateProfile: async (data) => {
        set({ isUpdateProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data?.data })
            toast.success("Profile updated successfully!")
        } catch (error) {
            console.log("Error in update profileL: ", error)

            toast.error(error.response.data.message || error?.message)
        } finally {
            set({ isUpdateProfile: false })
        }
    }
}))
