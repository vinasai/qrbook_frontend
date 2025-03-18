import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://qrbook.ca/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage("OTP sent to your email");
      setStep("otp");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://qrbook.ca/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage("Password reset successful");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <Card className="backdrop-blur-sm bg-black/30 border border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              {step === "email" ? "Reset Password" : step === "otp" ? "Enter OTP" : "New Password"}
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              {step === "email" 
                ? "Enter your email to receive a reset code" 
                : step === "otp" 
                ? "Enter the OTP sent to your email and your new password"
                : "Enter your new password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === "email" ? handleSendOTP : handleVerifyOTP} className="space-y-4">
              {step === "email" && (
                <div className="space-y-2">
                  <Label className="text-gray-200" htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10 bg-gray-800/60 border-gray-700 text-gray-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>
                </div>
              )}

              {step === "otp" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-200" htmlFor="otp">OTP Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="bg-gray-800/60 border-gray-700 text-gray-200"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200" htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type="password"
                        className="pl-10 bg-gray-800/60 border-gray-700 text-gray-200"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded bg-red-500/20 border border-red-500/50"
                >
                  <p className="text-red-200 text-sm">{error}</p>
                </motion.div>
              )}

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded bg-green-500/20 border border-green-500/50"
                >
                  <p className="text-green-200 text-sm">{message}</p>
                </motion.div>
              )}

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {step === "email" ? "Sending OTP..." : "Verifying..."}
                  </>
                ) : (
                  step === "email" ? "Send Reset Code" : "Reset Password"
                )}
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-full text-gray-400 hover:text-gray-300"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}