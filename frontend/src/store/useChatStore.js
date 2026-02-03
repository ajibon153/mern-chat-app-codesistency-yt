import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (user) => set({ selectedUser: user }),

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

    getAllContacts: async () => {
        try {
            set({ isUserLoading: true })
            const res = await axiosInstance.get("/messages/contacts")
            set({ allContacts: res?.data?.data })
            toast.success("Contacts loaded successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    },

    getMyPartnerChats: async () => {
        try {
            set({ isUserLoading: true })
            const res = await axiosInstance.post("/messages/chats")
            set({ chats: res.data })
            toast.success("Chats loaded successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    }
}))
