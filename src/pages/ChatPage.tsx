"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Bot, User, Lightbulb, Leaf, Heart, Target } from "lucide-react"
import {Link} from "react-router-dom"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your Green Mind AI assistant. I'm here to help you with sustainable living advice, answer questions about your behaviors, and provide personalized recommendations. How can I help you today?",
      sender: "bot",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      suggestions: [
        "How can I reduce my carbon footprint?",
        "What are some healthy meal ideas?",
        "Help me save money on groceries",
        "Show me my progress this week",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickSuggestions = [
    { text: "Eco-friendly tips", icon: Leaf, color: "bg-green-100 text-green-700" },
    { text: "Health advice", icon: Heart, color: "bg-red-100 text-red-700" },
    { text: "Goal setting", icon: Target, color: "bg-blue-100 text-blue-700" },
    { text: "Smart ideas", icon: Lightbulb, color: "bg-yellow-100 text-yellow-700" },
  ]

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("carbon") || message.includes("environment")) {
      return "Great question about reducing your carbon footprint! Based on your personality profile, here are some personalized suggestions:\n\n• Try plant-based meals 2-3 times per week\n• Use public transport or bike when possible\n• Switch to energy-efficient appliances\n• Buy local and seasonal produce\n\nWould you like specific tips for any of these areas?"
    }

    if (message.includes("health") || message.includes("meal")) {
      return "I'd love to help with healthy meal ideas! Based on your tracking data, I notice you enjoy variety. Here are some suggestions:\n\n• Mediterranean quinoa bowls\n• Colorful veggie stir-fries\n• Homemade smoothie bowls\n• Lean protein with roasted vegetables\n\nShall I provide recipes for any of these?"
    }

    if (message.includes("money") || message.includes("save") || message.includes("budget")) {
      return "Smart thinking about saving money! Here are some budget-friendly sustainable tips:\n\n• Buy in bulk to reduce packaging and cost\n• Meal prep to avoid food waste\n• Use a reusable water bottle\n• Shop at farmers markets for deals\n\nYour current savings goal is $200 this month - you're at $156!"
    }

    if (message.includes("progress") || message.includes("goals")) {
      return "You're doing amazing! Here's your recent progress:\n\n🌱 Environment: +12% improvement\n💪 Health: 28 healthy meals this month\n💰 Finance: $156 saved (78% of goal)\n👥 Community: 5 friends influenced\n\nKeep up the great work! What area would you like to focus on next?"
    }

    return "That's an interesting question! I'm here to help with sustainable living, health tips, financial advice, and tracking your green journey. Could you tell me more about what specific area you'd like help with?"
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 flex flex-col">
      <div className="max-w-sm mx-auto w-full flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <Link to="/home">
            <Button variant="ghost" className="p-2">
              <ArrowLeft className="w-5 h-5 text-greenery-700" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-greenery-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-greenery-700">Green Mind AI</h1>
              <p className="text-xs text-gray-500">Your sustainability assistant</p>
            </div>
          </div>
          <div className="w-9" />
        </div>

        {/* Quick Suggestions */}
        <div className="p-4 bg-white border-b">
          <div className="flex space-x-2 overflow-x-auto">
            {quickSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className={`flex-shrink-0 ${suggestion.color} border-0`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {suggestion.text}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === "user" ? "bg-greenery-500" : "bg-gray-200"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user" ? "bg-greenery-500 text-white" : "bg-white shadow-sm border"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-greenery-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-white shadow-sm border rounded-lg p-3">
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

          {/* Show suggestions after bot messages */}
          {messages.length > 0 &&
            messages[messages.length - 1].sender === "bot" &&
            messages[messages.length - 1].suggestions && (
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs border-greenery-200 text-greenery-700 hover:bg-greenery-50 bg-transparent"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about sustainable living..."
              className="flex-1 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-greenery-500 hover:bg-greenery-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
