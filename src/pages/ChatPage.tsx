"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Lightbulb, Leaf, Heart, Target } from "lucide-react"
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";

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
    <SafeAreaLayout header={<AppHeader title="Green Mind AI" showBack />}> 
      <div className="max-w-sm mx-auto w-full flex flex-col h-screen pb-0 relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[120px]">
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
        {/* Input + Suggestions fixed at bottom, flush edges */}
        <div className="fixed bottom-0 left-0 right-0 w-full p-4 bg-white border-t z-20">
          {/* Quick Suggestions (pill style, scrollable) */}
          <div className="mb-2 flex space-x-2 overflow-x-auto scrollbar-hide">
            {quickSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className={`flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all border-0 ${suggestion.color} whitespace-nowrap focus:outline-none`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {suggestion.text}
                </button>
              );
            })}
          </div>
          <form className="flex space-x-2" onSubmit={e => {e.preventDefault(); handleSendMessage();}}>
            <input
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about sustainable living..."
              className="flex-1 rounded-full px-4 py-3 bg-gray-50 border border-gray-200 shadow focus:border-greenery-400 focus:ring-greenery-400 focus:outline-none text-sm transition-all"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="rounded-full px-4 py-3 bg-greenery-500 hover:bg-greenery-600 text-white shadow"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </SafeAreaLayout>
  )
}
