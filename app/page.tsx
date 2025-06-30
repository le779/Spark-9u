"use client"
import { useState, useEffect } from "react"
import LoginPage from "./components/login-page"
import ChatInterface from "./components/chat-interface"

interface User {
  name: string
  email: string
  id: string
  createdAt: string
}

export default function SparkApp() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data from localStorage on app start
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
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: { name: string; email: string }) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    localStorage.setItem("spark-user", JSON.stringify(newUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("spark-user")
    localStorage.removeItem("spark-chat-history")
    localStorage.removeItem("spark-settings")
  }

  const handleUserUpdate = (updatedData: { name: string; email: string }) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)
      localStorage.setItem("spark-user", JSON.stringify(updatedUser))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Spark AI...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <ChatInterface user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
}
