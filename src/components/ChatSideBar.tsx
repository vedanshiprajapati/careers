"use client";
import React, { useState, useEffect } from "react";
import { Plus, MessageCircle, User, Settings, Search, X } from "lucide-react";

interface chatType {
  id: number;
  title: string;
  last_message: string;
  last_message_at: string;
  message_count: number;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChatId?: number;
  onChatSelect: (chat: chatType) => void;
  onNewChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  selectedChatId,
  onChatSelect,
  onNewChat,
}) => {
  const [chatList, setChatList] = useState<chatType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchChats = async () => {
    setLoading(true);
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data that would come from Supabase
    const mockData = [
      {
        id: 1,
        title: "Career Path in AI/ML",
        last_message:
          "What are the key skills needed for a machine learning engineer role?",
        last_message_at: "2024-03-15T10:30:00Z",
        message_count: 12,
      },
      {
        id: 2,
        title: "Resume Review Tips",
        last_message: "How can I improve my resume for tech roles?",
        last_message_at: "2024-03-14T15:20:00Z",
        message_count: 8,
      },
      {
        id: 3,
        title: "Interview Preparation",
        last_message: "What are common behavioral interview questions?",
        last_message_at: "2024-03-13T09:45:00Z",
        message_count: 15,
      },
    ];

    setChatList(mockData);
    setLoading(false);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const formatTime = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diffInHours = (now - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredChats = chatList.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`${
        isOpen ? "w-80" : "w-0"
      } transition-all duration-300 ease-in-out overflow-hidden bg-white border-r border-[#B87C4C]/20 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#B87C4C]/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#B87C4C]">Careers</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-[#F7F4EA] rounded"
          >
            <X className="w-5 h-5 text-[#B87C4C]" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full bg-[#B87C4C] hover:bg-[#A06B3B] text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[#B87C4C]/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B87C4C]/60" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F4EA] border border-[#B87C4C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87C4C]/30 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-[#B87C4C]/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#B87C4C]/10 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? "No chats found" : "No chats yet"}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 hover:bg-[#F7F4EA] ${
                    selectedChatId === chat.id
                      ? "bg-[#F7F4EA] border-l-4 border-[#B87C4C]"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#B87C4C] to-[#A06B3B] rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate text-sm">
                          {chat.title}
                        </h3>
                        <span className="text-xs text-[#B87C4C]/60 flex-shrink-0 ml-2">
                          {formatTime(chat.last_message_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.last_message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#B87C4C]/60">
                          {chat.message_count} messages
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-[#B87C4C]/10">
        <div className="flex items-center gap-3 p-3 hover:bg-[#F7F4EA] rounded-lg cursor-pointer transition-colors duration-200">
          <div className="w-10 h-10 bg-gradient-to-br from-[#B87C4C] to-[#A06B3B] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800 text-sm">John Doe</div>
            <div className="text-xs text-[#B87C4C]/60">john@example.com</div>
          </div>
          <Settings className="w-4 h-4 text-[#B87C4C]/60" />
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
