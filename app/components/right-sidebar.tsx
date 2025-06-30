"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { X, Download, History, Copy, FileText, MessageSquare, Lightbulb, Zap } from "lucide-react"

interface RightSidebarProps {
  messages: any[]
  chatHistory: any[]
  onLoadSession: (messages: any[]) => void
  onClose: () => void
  user: { name: string; email: string; id: string }
}

export default function RightSidebar({ messages, chatHistory, onLoadSession, onClose, user }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<"history" | "export" | "prompts" | "settings">("history")

  const exportChat = (format: "txt" | "json") => {
    if (messages.length === 0) return

    let content = ""
    let filename = ""

    if (format === "txt") {
      content = messages.map((msg) => `${msg.role === "user" ? "You" : "Spark"}: ${msg.content}`).join("\n\n")
      filename = `spark-chat-${new Date().toISOString().split("T")[0]}.txt`
    } else {
      content = JSON.stringify(
        {
          user: user.name,
          timestamp: new Date().toISOString(),
          messages,
        },
        null,
        2,
      )
      filename = `spark-chat-${new Date().toISOString().split("T")[0]}.json`
    }

    const blob = new Blob([content], { type: format === "txt" ? "text/plain" : "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const quickPrompts = [
    "Explain this concept in simple terms",
    "Write a professional email about",
    "Create a step-by-step guide for",
    "Summarize the key points of",
    "Help me brainstorm ideas for",
    "What are the pros and cons of",
  ]

  return (
    <div className="w-80 bg-white shadow-lg h-full flex flex-col border-l">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <h2 className="font-semibold">Functions</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b bg-gray-50">
        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("history")}
          className="flex-1 rounded-none"
        >
          <History className="h-4 w-4 mr-1" />
          History
        </Button>
        <Button
          variant={activeTab === "export" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("export")}
          className="flex-1 rounded-none"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
        <Button
          variant={activeTab === "prompts" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("prompts")}
          className="flex-1 rounded-none"
        >
          <Lightbulb className="h-4 w-4 mr-1" />
          Prompts
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Chat History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">Chat History</h3>
              </div>

              {chatHistory.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No chat history yet</p>
              ) : (
                <div className="space-y-2">
                  {chatHistory.map((session, index) => (
                    <Card key={session.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Session {chatHistory.length - index}
                            </p>
                            <p className="text-xs text-gray-500 mb-2">{new Date(session.timestamp).toLocaleString()}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {session.messages[0]?.content?.substring(0, 60)}...
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onLoadSession(session.messages)}
                            className="ml-2"
                          >
                            Load
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <MessageSquare className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{session.messages.length} messages</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Export Tab */}
          {activeTab === "export" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Download className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">Export Chat</h3>
              </div>

              {messages.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No messages to export</p>
              ) : (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Current Conversation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs text-gray-600">
                        <p>Messages: {messages.length}</p>
                        <p>Started: {new Date().toLocaleString()}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => exportChat("txt")} className="flex-1">
                          <FileText className="h-3 w-3 mr-1" />
                          Text
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => exportChat("json")} className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          JSON
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(messages.map((m) => `${m.role}: ${m.content}`).join("\n\n"))}
                        className="w-full justify-start"
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Copy to Clipboard
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Quick Prompts Tab */}
          {activeTab === "prompts" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">Quick Prompts</h3>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Starter Prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(prompt)}
                      className="w-full justify-start text-left h-auto p-2"
                    >
                      <Zap className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">{prompt}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Custom Prompt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea placeholder="Create your own prompt template..." className="text-sm" rows={3} />
                  <Button size="sm" className="w-full">
                    Save Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
