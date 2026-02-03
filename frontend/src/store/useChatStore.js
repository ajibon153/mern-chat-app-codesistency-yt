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
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

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
            // toast.success("Contacts loaded successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    },

    getMyChatPartners: async () => {
        try {
            set({ isUserLoading: true })
            const res = await axiosInstance.get("/messages/chats")
            set({ chats: res.data?.data })
            // toast.success("Chats loaded successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    },
    getMessagesByUserId: async (userId) => {
        try {
            set({ isMessagesLoading: true })
            const res = await axiosInstance.get("/messages/chat/" + userId)
            set({ messages: res.data?.data })
            toast.success("Messages loaded successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (messageData) => {
        try {
            const userId = get().selectedUser._id
            const res = await axiosInstance.post("/messages/send/" + userId, messageData)
            const oldMessage = get().messages || []
            const newMessage = res.data?.data
            console.log("oldMessage", oldMessage)
            console.log("newMessage", newMessage)

            set({ messages: [...oldMessage, newMessage] })
            toast.success("Messages send successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    subscribeToMessages: async () => {},
    unsubscribeFromMessages: async () => {}
}))
