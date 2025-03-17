import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Mail, Lock, User, ArrowRight, Loader2, QrCode } from "lucide-react";

export default function AnimatedRegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (step === 1) {
      setStep(step + 1);
      setIsLoading(false);
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Register user
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      try {
        const response = await fetch("https://qrbook.ca/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // Redirect to login page after successful registration
        navigate("/login");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Registration failed",
        );
      } finally {
        setIsLoading(false);
      }
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
                Create Account
              </CardTitle>
              <CardDescription className="font-sans text-gray-300 text-lg">
                {step === 1
                  ? "Step 1: Your information"
                  : "Step 2: Set your password"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 md:px-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {step === 1 && (
                  <>
                    <div className="space-y-2.5">
                      <Label
                        className="font-sans text-gray-200 text-base"
                        htmlFor="fullName"
                      >
                        Full Name
                      </Label>
                      <div className="relative group">
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          className="pl-10 py-6 bg-gray-800/60 border-gray-700 text-gray-200 focus-visible:ring-blue-500 text-base"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />

                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                    </div>

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
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />

                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
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
                          type="password"
                          className="pl-10 py-6 bg-gray-800/60 border-gray-700 text-gray-200 focus-visible:ring-blue-500 text-base"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />

                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label
                        className="font-sans text-gray-200 text-base"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative group">
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="pl-10 py-6 bg-gray-800/60 border-gray-700 text-gray-200 focus-visible:ring-blue-500 text-base"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />

                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

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

                      {step === 1 ? "Processing..." : "Creating Account..."}
                    </>
                  ) : (
                    <>
                      {step === 1 ? (
                        <div className="flex items-center">
                          Next
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </>
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
              Already have an account?{" "}
              <Button
                onClick={() => navigate("/login")}
                variant="link"
                className="text-blue-400 hover:text-blue-300 p-0 font-sans"
              >
                Sign In
              </Button>
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
