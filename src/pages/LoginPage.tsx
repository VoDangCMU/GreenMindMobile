"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, User, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import login from "@/apis/backend/v1/login";
import { useToast } from "@/hooks/useToast";
// import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DemoAccount {
  id: string;
  name: string;
  role: string;
  email: string;
  password?: string; // Optional if we just want to fill specific ones
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "1",
    name: "Regular User",
    role: "User",
    email: "tnqb.bot2@gmail.com",
    password: "password123", // Assuming mock password for autofill convenience
  },
  {
    id: "4",
    name: "12 Danang Nam",
    role: "User",
    email: "12danangnam@gmail.com",
    password: "1234567",
  },
  {
    id: "5",
    name: "12 Danang Nu",
    role: "User",
    email: "12danangnu@gmail.com",
    password: "1234567",
  },
  {
    id: "6",
    name: "33 Danang Nam",
    role: "User",
    email: "33danangnam@gmail.com",
    password: "1234567",
  },
  {
    id: "7",
    name: "33 Hue Nam",
    role: "User",
    email: "33huenam@gmail.com",
    password: "1234567",
  },
  {
    id: "8",
    name: "20 Danang Nam",
    role: "User",
    email: "20danangnam@gmail.com",
    password: "1234567",
  },
  {
    id: "9",
    name: "26 Danang Nam",
    role: "User",
    email: "26danangnam@gmail.com",
    password: "1234567",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const access_token = useAuthStore((state) => state.tokens?.access_token);
  const setBypassAuthGate = useAuthStore((state) => state.setBypassAuthGate);
  const toast = useToast();

  useEffect(() => {
    if (access_token) {
      navigate("/home");
    }
  }, []);

  const handleSelectAccount = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password || "1234567"); // Default or specific
    setShowDemoAccounts(false);
    toast.success(`Autofilled as ${account.name}`);
  };

  // Also import toast from sonner compatible with useToast? 
  // The existing code uses custom useToast { success, error }. 
  // I'll stick to that or standard toast if available. Use existing hooks. 
  // Wait, I can't call toast inside handleSelectAccount if it's not defined in the component scope yet?
  // Ah, I can move the function inside or just use console.log if toast isn't handy there, 
  // but I have useToast hook outcome below. I'll implement handleSelectAccount inside the component.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      const data = await login({ email, password });
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      setUser(data.user);
      toast.success("Đăng nhập thành công! " + data.user.full_name);
      navigate("/home");
    } catch (error: any) {
      // @ts-ignore
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
        <div className="cursor-pointer group" onClick={() => setShowDemoAccounts(true)}>
          <h2 className="text-3xl font-extrabold text-greenery-700 mb-1 group-hover:text-greenery-800 transition-colors flex items-center gap-2">
            Login
            <span className="opacity-0 group-hover:opacity-100 text-xs font-normal bg-greenery-100 text-greenery-700 px-2 py-0.5 rounded-full transition-opacity">
              Autofill
            </span>
          </h2>
        </div>
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

      {/* Demo Account Modal */}
      <Dialog open={showDemoAccounts} onOpenChange={setShowDemoAccounts}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Demo Account</DialogTitle>
            <DialogDescription>
              Quickly login with a pre-configured account for testing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {DEMO_ACCOUNTS.map((acc) => (
              <Card
                key={acc.id}
                className="cursor-pointer hover:bg-greenery-50 transition-colors border-l-4 border-l-transparent hover:border-l-greenery-500"
                onClick={() => handleSelectAccount(acc)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${acc.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 'bg-greenery-100 text-greenery-600'}`}>
                      {acc.role === 'Admin' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{acc.name}</h4>
                      <p className="text-sm text-gray-500">{acc.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">{acc.role}</Badge>
                    {/* <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      ***
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
