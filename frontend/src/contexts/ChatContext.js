import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context easily
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
