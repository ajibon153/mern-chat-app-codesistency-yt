import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"

const notificationSound = new Audio("/sounds/notification.mp3")

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isMessagesSend: false,
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
            toast.error(error.response.data.message || error?.message || "Something went wrong while loading contacts")
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
            toast.error(error.response.data.message || error?.message || "Something went wrong while getting chats")
        } finally {
            set({ isUserLoading: false })
        }
    },
    getMessagesByUserId: async (userId) => {
        try {
            set({ isMessagesLoading: true })
            const res = await axiosInstance.get("/messages/chat/" + userId)
            set({ messages: res.data?.data })
            // toast.success("Messages loaded successfully!")
        } catch (error) {
            toast.error(error.response.data.message || error?.message || "Something went wrong while getting messages")
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        const { authUser } = useAuthStore.getState()

        const tempId = `temp-${Date.now()}`

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true // flag to identify optimistic messages (optional)
        }
        set({ messages: [...messages, optimisticMessage] })

        try {
            set({ isMessagesSend: true })
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)

            set({ messages: messages.concat(res.data?.data) })
            return true
        } catch (error) {
            set({ messages: messages })

            toast.error(error.response.data.message || error?.message || "Something went wrong while sending message")
            return false
        } finally {
            set({ isMessagesSend: false })
        }
    },
    subscribeToMessages: async () => {
        const { selectedUser, isSoundEnabled } = get()
        if (!selectedUser) return

        const socket = useAuthStore.getState().socket
        console.log("subscribeToMessages", socket)

        socket.on("newMessage", (newMessage) => {
            const isMessageForCurrentChat =
                newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id

            if (isMessageForCurrentChat) {
                const currentMessage = get().messages
                set({ messages: [...currentMessage, newMessage] })
                console.log("isSoundEnabled", isSoundEnabled)
            }

            if (isSoundEnabled) {
                console.log("notificationSound", notificationSound)

                notificationSound.currentTime = 0 // reset to start
                notificationSound.play().catch((e) => console.log("Audio play failed:", e))
            }
        })
    },
    unsubscribeFromMessages: async () => {
        const socket = useAuthStore.getState().socket
        console.log("unsubscribeFromMessages", socket)
        socket.off("newMessage")
    }
}))
