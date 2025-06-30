"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { VercelLogo, NextJsLogo, UserIcon } from "@/components/ui/icons"
import {
  Menu,
  Send,
  Plus,
  MessageSquare,
  Settings,
  Bot,
  LogOut,
  ChevronRight,
  Paperclip,
  ImageIcon,
  X,
} from "lucide-react"
import LoginPage from "./components/login-page"
import type { Message } from "ai"

interface User {
  name: string
  email: string
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export default function SparkApp() {
  const [user, setUser] = useState<User | null>(null)
  const [isAppLoading, setIsAppLoading] = useState(true)
  const { messages, setMessages, append, isLoading: isChatLoading } = useChat()
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  const [localInput, setLocalInput] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("spark-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error loading user data:", error)
        localStorage.removeItem("spark-user")
      }
    }
    setIsAppLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("spark-user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("spark-user")
    setMessages([])
  }

  const handleNewChat = () => {
    setMessages([])
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments((prev) => [...prev, ...files])
    event.target.value = "" // Reset file input
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!localInput && attachments.length === 0) return

    const content: Array<{ type: "text"; text: string } | { type: "image"; image: string }> = []
    if (localInput) {
      content.push({ type: "text", text: localInput })
    }

    for (const file of attachments) {
      if (file.type.startsWith("image/")) {
        const base64 = await toBase64(file)
        content.push({ type: "image", image: base64 })
      }
    }

    const newMessage: Message = {
      role: "user",
      content,
    }

    await append(newMessage)
    setLocalInput("")
    setAttachments([])
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-950 text-white">
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <div className="w-32">
          <Image src="/spark-logo.png" alt="Spark by AIBS Logo" width={128} height={40} />
        </div>
      </div>
      <div className="flex-1 p-2">
        <Button onClick={handleNewChat} variant="ghost" className="w-full justify-start gap-2 text-lg">
          <Plus className="h-5 w-5" />
          New Chat
        </Button>
        <div className="mt-8">
          <h3 className="px-2 text-sm font-medium text-gray-400">Recent</h3>
          <div className="mt-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 truncate"
              onClick={() => alert("Functionality to load recent chats coming soon!")}
            >
              <MessageSquare className="h-4 w-4" />
              What is quantum computing?
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 truncate"
              onClick={() => alert("Functionality to load recent chats coming soon!")}
            >
              <MessageSquare className="h-4 w-4" />
              10 ideas for a new SaaS product
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => alert("Settings page coming soon!")}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-center gap-4">
          <span className="text-xs text-gray-500">Powered by</span>
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            <NextJsLogo className="h-5 w-auto text-gray-400 hover:text-white transition-colors" />
          </a>
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            <VercelLogo className="h-4 w-auto text-gray-400 hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </div>
  )

  if (isAppLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen w-full bg-black relative">
      {/* Desktop Hover Sidebar */}
      <div
        className="hidden lg:block absolute left-0 top-0 h-full w-4 z-20"
        onMouseEnter={() => setIsSidebarVisible(true)}
      />
      <div
        className={`hidden lg:flex lg:w-72 h-full transition-transform duration-300 ease-in-out z-10 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
        onMouseLeave={() => setIsSidebarVisible(false)}
      >
        <SidebarContent />
      </div>
      {!isSidebarVisible && (
        <div className="hidden lg:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 bg-gray-900/50 backdrop-blur-sm p-1 rounded-r-full">
          <ChevronRight className="h-6 w-6 text-gray-400" />
        </div>
      )}

      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 border-b border-gray-800">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-gray-950 border-r-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold text-gray-200 lg:ml-4">Spark</h1>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto p-4 md:p-8">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-16">
                  <div className="inline-block p-5 bg-gray-900 rounded-full mb-4">
                    <Image src="/spark-logo.png" alt="Spark Logo" width={64} height={64} className="invert" />
                  </div>
                  <h2 className="text-3xl font-semibold text-gray-200">How can I help you today?</h2>
                </div>
              ) : (
                <div className="space-y-8">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-4 items-start ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {m.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div className={`flex-1 max-w-[80%] ${m.role === "user" ? "text-right" : "text-left"}`}>
                        <p className="font-semibold text-gray-200 mb-1">{m.role === "user" ? "You" : "Spark"}</p>
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {typeof m.content === "string" ? (
                            <p className="whitespace-pre-wrap text-left">{m.content}</p>
                          ) : (
                            <div className="space-y-2">
                              {m.content.map((part, index) => {
                                if (part.type === "text") {
                                  return (
                                    <p key={index} className="whitespace-pre-wrap text-left">
                                      {part.text}
                                    </p>
                                  )
                                }
                                if (part.type === "image") {
                                  return (
                                    <Image
                                      key={index}
                                      src={(part.image as string) || "/placeholder.svg"}
                                      alt="User attachment"
                                      width={200}
                                      height={200}
                                      className="rounded-md"
                                    />
                                  )
                                }
                                return null
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      {m.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex gap-4 items-start justify-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 pt-2">
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
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </main>

        <footer className="p-4">
          <div className="max-w-3xl mx-auto">
            {attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="relative bg-gray-800 p-2 rounded-lg flex items-center gap-2">
                    {file.type.startsWith("image/") ? (
                      <Image
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={file.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <Paperclip className="h-6 w-6 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-300 truncate max-w-xs">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                multiple
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  alert("Document attachments are not yet supported, but you can attach images!")
                  e.target.value = ""
                }}
                className="hidden"
                multiple
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute left-3"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5 text-gray-400 hover:text-white" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute left-12"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5 text-gray-400 hover:text-white" />
              </Button>
              <Input
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder="Message Spark..."
                className="bg-gray-900 border-gray-700 rounded-full h-14 pl-24 pr-16 text-lg focus-visible:ring-1 focus-visible:ring-blue-500"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-gray-700 hover:bg-gray-600"
                disabled={isChatLoading || (!localInput.trim() && attachments.length === 0)}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <p className="text-xs text-center text-gray-600 mt-3">
              Spark may display inaccurate info, including about people, so double-check its responses.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
