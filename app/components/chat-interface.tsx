"use client"
import { useState, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Sparkles,
  UserIcon,
  Trash2,
  Settings,
  LogOut,
  MessageSquare,
  Menu,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import AccountSettings from "./account-settings"
import RightSidebar from "./right-sidebar"

interface ChatInterfaceProps {
  user: {
    name: string
    email: string
    id: string
    createdAt: string
  }
  onLogout: () => void
  onUserUpdate: (userData: { name: string; email: string }) => void
}

export default function ChatInterface({ user, onLogout, onUserUpdate }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat()
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [leftSidebarHovered, setLeftSidebarHovered] = useState(false)
  const [rightSidebarHovered, setRightSidebarHovered] = useState(false)

  // Load chat history and settings on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("spark-chat-history")
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory)
        setChatHistory(history)
      } catch (error) {
        console.error("Error loading chat history:", error)
      }
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const chatSession = {
        id: Date.now().toString(),
        messages,
        timestamp: new Date().toISOString(),
        userId: user.id,
      }

      const updatedHistory = [chatSession, ...chatHistory.slice(0, 9)] // Keep last 10 sessions
      setChatHistory(updatedHistory)
      localStorage.setItem("spark-chat-history", JSON.stringify(updatedHistory))
    }
  }, [messages, user.id])

  const clearConversation = () => {
    setMessages([])
  }

  const handleAccountUpdate = (updatedUser: { name: string; email: string }) => {
    onUserUpdate(updatedUser)
    setShowAccountSettings(false)
  }

  const loadChatSession = (sessionMessages: any[]) => {
    setMessages(sessionMessages)
    setShowRightSidebar(false)
  }

  if (showAccountSettings) {
    return <AccountSettings user={user} onSave={handleAccountUpdate} onCancel={() => setShowAccountSettings(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 relative">
      {/* Left Sidebar Hover Area */}
      <div
        className="fixed left-0 top-0 w-4 h-full z-50 bg-transparent"
        onMouseEnter={() => setLeftSidebarHovered(true)}
      />

      {/* Left Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out ${
          leftSidebarHovered ? "translate-x-0" : "-translate-x-full"
        }`}
        onMouseEnter={() => setLeftSidebarHovered(true)}
        onMouseLeave={() => setLeftSidebarHovered(false)}
      >
        <div className="w-64 h-full bg-white border-r shadow-lg flex flex-col">
          <div className="border-b bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <div className="flex items-center gap-2 p-4">
              <Sparkles className="h-6 w-6" />
              <h2 className="font-semibold">Spark AI</h2>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Welcome back,</h3>
                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={clearConversation}
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Conversation
                </Button>

                <Button onClick={() => setShowAccountSettings(true)} variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </div>

              <div className="mt-6 p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Chat Stats</span>
                </div>
                <p className="text-xs text-purple-600">Current Messages: {messages.length}</p>
                <p className="text-xs text-purple-600">Total Sessions: {chatHistory.length}</p>
              </div>
            </div>
          </div>

          <div className="border-t p-4">
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Left Sidebar Indicator */}
      {!leftSidebarHovered && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm rounded-r-lg shadow-lg p-2 transition-opacity duration-300 hover:bg-white">
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </div>
      )}

      {/* Right Sidebar Hover Area */}
      <div
        className="fixed right-0 top-0 w-4 h-full z-50 bg-transparent"
        onMouseEnter={() => setRightSidebarHovered(true)}
      />

      {/* Right Sidebar */}
      {(rightSidebarHovered || showRightSidebar) && (
        <div
          className={`fixed right-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out ${
            rightSidebarHovered || showRightSidebar ? "translate-x-0" : "translate-x-full"
          }`}
          onMouseEnter={() => setRightSidebarHovered(true)}
          onMouseLeave={() => {
            setRightSidebarHovered(false)
            setShowRightSidebar(false)
          }}
        >
          <RightSidebar
            messages={messages}
            chatHistory={chatHistory}
            onLoadSession={loadChatSession}
            onClose={() => {
              setShowRightSidebar(false)
              setRightSidebarHovered(false)
            }}
            user={user}
          />
        </div>
      )}

      {/* Right Sidebar Indicator */}
      {!rightSidebarHovered && !showRightSidebar && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm rounded-l-lg shadow-lg p-2 transition-opacity duration-300 hover:bg-white">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white/80 backdrop-blur-sm px-4 relative z-20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Chat with Spark
              </h1>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="flex items-center gap-2"
          >
            <Menu className="h-4 w-4" />
            Functions
          </Button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 p-4">
          <Card className="h-full flex flex-col shadow-xl">
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-12rem)] p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles className="h-16 w-16 text-purple-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Hello {user.name}! 👋</h3>
                    <p className="text-gray-500 max-w-md">
                      I'm Spark, your AI assistant. Ask me anything or start a conversation!
                    </p>
                    <div className="mt-6 text-sm text-gray-400 space-y-1">
                      <p>💡 Hover over the left edge to access your profile and settings</p>
                      <p>🔧 Hover over the right edge to access functions and history</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === "user" ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
                            }`}
                          >
                            {message.role === "user" ? (
                              <UserIcon className="h-4 w-4" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>

            {/* Input Form */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
