import React from 'react'

const NoConversationPlaceholder = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-300">No Conversation Selected</h2>
        <p className="text-slate-400 mt-2">Select a conversation from the list to start chatting</p>
      </div>
    </div>
  )
}

export default NoConversationPlaceholder