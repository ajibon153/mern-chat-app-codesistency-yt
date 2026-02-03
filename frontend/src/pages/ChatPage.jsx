import React from "react"
import { useAuthStore } from "../store/useAuthStore"

const ChatPage = () => {
    const { logout } = useAuthStore()
    return (
        <div>
            ChatPage
            <br />
            <button className="auth-btn" type="submit" onClick={logout}>
                Logout
            </button>
        </div>
    )
}

export default ChatPage
