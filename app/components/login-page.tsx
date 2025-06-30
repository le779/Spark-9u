"use client"
import { useState } from "react"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VercelLogo, NextJsLogo } from "@/components/ui/icons"

interface LoginPageProps {
  onLogin: (userData: { name: string; email: string }) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLogin({ name: email.split("@")[0], email })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 w-48">
          <Image src="/spark-logo.png" alt="Spark by AIBS Logo" width={192} height={64} priority />
        </div>
        <h1 className="text-4xl font-bold text-gray-200 mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-8">Sign in to continue with Spark AI</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-900 border-gray-700 h-12 text-base"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-900 border-gray-700 h-12 text-base"
            required
          />
          <Button type="submit" className="w-full h-12 text-base bg-white text-black hover:bg-gray-200">
            Sign In
          </Button>
        </form>
        <p className="text-xs text-gray-600 mt-4">Demo: Use any email and password to proceed.</p>
      </div>
      <footer className="absolute bottom-8 text-center">
        <div className="flex items-center justify-center gap-6">
          <span className="text-sm text-gray-500">Powered by</span>
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" aria-label="Next.js">
            <NextJsLogo className="h-6 w-auto text-gray-400 hover:text-white transition-colors" />
          </a>
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" aria-label="Vercel">
            <VercelLogo className="h-5 w-auto text-gray-400 hover:text-white transition-colors" />
          </a>
        </div>
      </footer>
    </div>
  )
}
