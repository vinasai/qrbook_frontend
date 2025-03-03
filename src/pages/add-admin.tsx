"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserPlus, Loader2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  mobile: z.string().min(10, {
    message: "Mobile number must be at least 10 digits.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export default function AddAdmin() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)
    
    try {
      const response = await fetch("https://qrbook.ca/api/users/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.name,
          email: values.email,
          mobileNo: values.mobile,
          password: values.password,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin")
      }

      setSuccess("Admin created successfully!")
      form.reset()
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  function onReset() {
    form.reset()
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="p-8 animate-fade-in space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Add New Admin
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Create new administrator accounts with system access
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border bg-background/95 backdrop-blur-sm shadow-lg max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/30">
                <p className="text-destructive flex items-center gap-2">
                  <span className="text-sm font-medium">{error}</span>
                </p>
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/30">
                <p className="text-emerald-500 flex items-center gap-2">
                  <span className="text-sm font-medium">{success}</span>
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="focus-visible:ring-primary/20"
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      className="focus-visible:ring-primary/20"
                      placeholder="+1 234 567 890"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="focus-visible:ring-primary/20"
                      placeholder="admin@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="focus-visible:ring-primary/20"
                      placeholder="••••••••"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                onClick={onReset}
                variant="secondary"
                className="px-8"
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button 
                type="submit" 
                className="px-8 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Admin"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}