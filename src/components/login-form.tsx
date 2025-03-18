import { useAuth } from "./AuthContext";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "./icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Mail, Lock, Loader2, Eye, EyeOff, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("https://qrbook.ca/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.token, data.user.fullName, data.user.userId, data.user.type);

      navigate(data.user.type === "admin" ? "/payment-info" : "/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl px-4"
      >
        <Card className="backdrop-blur-sm bg-black/30 border border-gray-700 shadow-xl">
          <CardHeader className="space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center"
            >
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <QrCode className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold font-sans text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="font-sans text-gray-300 text-lg">
                Sign in to access your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 md:px-10">
            <form
              onSubmit={handleLogin}
              className={cn("space-y-8", className)}
              {...props}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-2.5">
                  <Label
                    className="font-sans text-gray-200 text-base"
                    htmlFor="email"
                  >
                    Email
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10 py-6 bg-gray-800/60 border-gray-700 text-gray-200 focus-visible:ring-blue-500 text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label
                    className="font-sans text-gray-200 text-base"
                    htmlFor="password"
                  >
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10 py-6 bg-gray-800/60 border-gray-700 text-gray-200 focus-visible:ring-blue-500 text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-400 hover:text-blue-300 p-0"
                >
                  Forgot Password?
                </Button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-md bg-red-500/20 border border-red-500/50"
                >
                  <p className="text-red-200 text-base font-sans">{error}</p>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  className="w-full font-sans text-lg py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-800 pt-8 pb-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base font-sans text-gray-400"
            >
              Don't have an account?{" "}
              <Button
                onClick={() => navigate("/register")}
                variant="link"
                className="text-blue-400 hover:text-blue-300 p-0 font-sans"
              >
                Create an account
              </Button>
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
