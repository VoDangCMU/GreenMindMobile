"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/apis/backend/login";
import { useAppStore } from "@/store/appStore";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setAuth = useAppStore((state) => state.setAuth);
  const access_token = useAppStore((state) => state.access_token);
  const setBypassAuthGate = useAppStore((state) => state.setBypassAuthGate);
  const { success } = useToast();

  useEffect(() => {
    if (access_token) {
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMockLogin = () => {
    setEmail("tnqb.bot2@gmail.com");
    setPassword("1234567");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      const data = await loginUser({ email, password });
      setAuth({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      });
      success("Đăng nhập thành công! " + data.user.fullName);
      navigate("/home");
    } catch (error: any) {
      error(error?.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 flex flex-col p-6">
      {/* Header top-left */}
      <div className="flex items-center space-x-2 mb-12 md:absolute md:top-8 md:left-8 pt-12">
        <Link
          to="/home"
          onClick={() => setBypassAuthGate(true)}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-greenery-500 rounded-full flex items-center justify-center shadow-md">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-greenery-700 tracking-tight">
            GREEN MIND
          </h1>
        </Link>
      </div>

  {/* Login section */}
  <div className="flex flex-1 flex-col w-full max-w-sm justify-center">
        <h2 className="text-3xl font-extrabold text-greenery-700 mb-1" onClick={handleMockLogin}>
          Login
        </h2>
        <p className="text-greenery-600 mb-6">
          Welcome back! Sign in to your account
        </p>

        {/* Form – no card */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 bg-white/70 backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-gray-200 focus:border-greenery-400 focus:ring-greenery-400 bg-white/70 backdrop-blur-sm"
              required
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="remember"
                type="checkbox"
                className="accent-green-600 w-4 h-4 rounded-full border-gray-300 focus:ring-green-500 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-green-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>


          <Button
            type="submit"
            className="w-full h-12 bg-greenery-500 hover:bg-greenery-600 text-white font-semibold text-base shadow-lg"
          >
            Sign In
          </Button>
        </form>

        {/* Sign up */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">Don't have an account?</p>
          <Link
            to="/register"
            className="text-greenery-600 hover:text-greenery-700 font-semibold text-sm"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
