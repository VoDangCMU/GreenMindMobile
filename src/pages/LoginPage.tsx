"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/apis/login";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setAuth = useAppStore((state) => state.setAuth);
  const access_token = useAppStore((state) => state.access_token);
  const setBypassAuthGate = useAppStore((state) => state.setBypassAuthGate);

  useEffect(() => {
    if (access_token) {
      navigate("/home");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAutoFillDemoDaNang = () => {
    setEmail("khoa.nguyenba@outlook.com");
    setPassword("Khoa123123");
  };

  const handleAutoFillDemoHue = () => {
    setEmail("hue@gmail.com");
    setPassword("Khoa123123");
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
      toast.success("Đăng nhập thành công! " + data.user.fullName);
      navigate("/home");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-greenery-50 to-greenery-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-greenery-500 rounded-full flex items-center justify-center shadow-md mb-3">
            <Link to="/home" onClick={() => setBypassAuthGate(true)}>
              <Leaf className="w-8 h-8 text-white" />
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold text-greenery-700 mb-1 tracking-tight text-center drop-shadow-sm"
            onClick={handleAutoFillDemoDaNang}
          >
            GREEN MIND
          </h1>
          <p
            className="text-greenery-600 text-base text-center max-w-xs"
            onClick={handleAutoFillDemoHue}
          >
            Welcome back! Sign in to your account to continue
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 bg-white/90 rounded-2xl shadow-lg px-5 py-6"
        >
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
            <a
              href="#"
              className="text-greenery-600 hover:text-greenery-700 font-medium"
            >
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
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {"Don't have an account? "}
            <Link
              to="/register"
              className="text-greenery-600 hover:text-greenery-700 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
