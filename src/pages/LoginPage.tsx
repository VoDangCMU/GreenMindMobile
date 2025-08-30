"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"
import {Link} from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation - in real app, you'd authenticate
    if (email && password) {
      window.location.href = "/home"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-0 shadow-xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-greenery-500 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-greenery-700">GREEN MIND</h1>
          </div>
          <div>
            <CardTitle className="text-xl text-gray-800">Welcome back</CardTitle>
            <CardDescription className="text-gray-600">Sign in to your account to continue</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-greenery-500 border-gray-300 rounded focus:ring-greenery-400"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-greenery-600 hover:text-greenery-700 font-medium">
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-greenery-500 hover:bg-greenery-600 text-white font-semibold text-base shadow-lg"
            >
              Sign In
            </Button>
          </form>
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              {"Don't have an account? "}
              <Link to="/onboarding" className="text-greenery-600 hover:text-greenery-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
