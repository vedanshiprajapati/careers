"use client";
import React, { useState } from "react";
import { MessageCircle, Send, Menu } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useRouter, useParams } from "next/navigation";
import ChatSidebar from "./ChatSideBar";

interface chatType {
  id: number;
  title: string;
  last_message: string;
  last_message_at: string;
  message_count: number;
}

interface ChatAppProps {
  chatId?: string; // This will come from the route params
}

const ChatApp: React.FC<ChatAppProps> = ({ chatId }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { messages, sendMessage } = useChat();
  const router = useRouter();

  // Convert chatId to number, undefined if not provided or invalid
  const selectedChatId = chatId ? parseInt(chatId, 10) : undefined;
  const isHomePage = !chatId; // True when no chat is selected (homepage)

  const handleChatSelect = (chat: chatType) => {
    // Navigate to the specific chat
    router.push(`/chat/${chat.id}`);
  };

  const handleNewChat = () => {
    // Navigate to the homepage (new chat)
    router.push("/");
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage({ text: inputMessage.trim() });
      setInputMessage("");

      // If we're on the homepage (new chat), you might want to create a new chat
      // and redirect to it after sending the first message
      if (isHomePage) {
        // This is where you'd typically create a new chat in your backend
        // and then redirect to the new chat ID
        // For now, we'll just keep it on the homepage
        console.log("Creating new chat...");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F4EA] font-inter">
      {/* Sidebar Component */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedChatId={selectedChatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-[#B87C4C]/20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[#F7F4EA] rounded"
          >
            <Menu className="w-5 h-5 text-[#B87C4C]" />
          </button>
          <h1 className="text-xl font-bold text-[#B87C4C]">Careers</h1>
          <div className="w-9"></div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {isHomePage ? (
            // Homepage - Show welcome screen when no chat is selected
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#B87C4C] to-[#A06B3B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to Careers AI
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Your personal career assistant. Get guidance on job
                    searches, interview prep, resume reviews, and career
                    development.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button className="p-4 bg-white border border-[#B87C4C]/20 rounded-xl hover:shadow-lg transition-all duration-200 hover:border-[#B87C4C]/40">
                    <div className="text-[#B87C4C] font-semibold mb-2">
                      Resume Review
                    </div>
                    <div className="text-sm text-gray-600">
                      Get feedback on your resume
                    </div>
                  </button>
                  <button className="p-4 bg-white border border-[#B87C4C]/20 rounded-xl hover:shadow-lg transition-all duration-200 hover:border-[#B87C4C]/40">
                    <div className="text-[#B87C4C] font-semibold mb-2">
                      Interview Prep
                    </div>
                    <div className="text-sm text-gray-600">
                      Practice interview questions
                    </div>
                  </button>
                  <button className="p-4 bg-white border border-[#B87C4C]/20 rounded-xl hover:shadow-lg transition-all duration-200 hover:border-[#B87C4C]/40">
                    <div className="text-[#B87C4C] font-semibold mb-2">
                      Career Path
                    </div>
                    <div className="text-sm text-gray-600">
                      Explore career opportunities
                    </div>
                  </button>
                  <button className="p-4 bg-white border border-[#B87C4C]/20 rounded-xl hover:shadow-lg transition-all duration-200 hover:border-[#B87C4C]/40">
                    <div className="text-[#B87C4C] font-semibold mb-2">
                      Salary Info
                    </div>
                    <div className="text-sm text-gray-600">
                      Research salary ranges
                    </div>
                  </button>
                </div>

                {/* Input Box */}
                <div className="relative max-w-3xl mx-auto">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about your career..."
                    className="w-full p-4 pr-12 bg-white border border-[#B87C4C]/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B87C4C]/30 focus:border-transparent resize-none shadow-lg"
                    rows={1}
                    style={{ minHeight: "60px" }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="absolute right-3 bottom-3 w-10 h-10 bg-[#B87C4C] hover:bg-[#A06B3B] disabled:bg-[#B87C4C]/40 text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Chat View - Show when a specific chat is selected
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-[#B87C4C]/20">
                <h2 className="text-lg font-semibold text-gray-800">
                  Chat #{selectedChatId}
                </h2>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#B87C4C]/40" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.role === "user"
                              ? "bg-[#B87C4C] text-white"
                              : "bg-white border border-[#B87C4C]/20 text-gray-800"
                          }`}
                        >
                          {message.parts.map((part, i) => {
                            switch (part.type) {
                              case "text":
                                return (
                                  <div key={`${message.id}-${i}`}>
                                    {part.text}
                                  </div>
                                );
                              case "tool-weather":
                                return (
                                  <pre key={`${message.id}-${i}`}>
                                    {JSON.stringify(part, null, 2)}
                                  </pre>
                                );
                            }
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-[#B87C4C]/20">
                <div className="relative max-w-4xl mx-auto">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full p-4 pr-12 bg-[#F7F4EA] border border-[#B87C4C]/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B87C4C]/30 focus:border-transparent resize-none"
                    rows={1}
                    style={{ minHeight: "60px" }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="absolute right-3 bottom-3 w-10 h-10 bg-[#B87C4C] hover:bg-[#A06B3B] disabled:bg-[#B87C4C]/40 text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
