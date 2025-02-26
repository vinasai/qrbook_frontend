"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import { useState } from "react"

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
    try {
      const response = await fetch("https://qrbook.ca:5002/api/users/admin", {
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

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      setSuccess("Admin created successfully!")
      form.reset()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    }
  }

  function onReset() {
    form.reset()
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <UserPlus className="h-8 w-8 text-white" />
        <h1 className="text-4xl font-sans text-white">Add an Admin</h1>
      </div>
      <div className="rounded-xl bg-[#1f1f1f] p-6 max-w-2xl border border-white/10 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xl font-sans">Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-[#2a2a2a] border-0 text-white h-12 focus-visible:ring-white/20" />
                  </FormControl>
                  <FormMessage className="text-[#fb9797]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xl font-sans">Mobile No</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      className="bg-[#2a2a2a] border-0 text-white h-12 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormMessage className="text-[#fb9797]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xl font-sans">E-Mail</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="bg-[#2a2a2a] border-0 text-white h-12 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormMessage className="text-[#fb9797]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xl font-sans">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="bg-[#2a2a2a] border-0 text-white h-12 focus-visible:ring-white/20"
                    />
                  </FormControl>
                  <FormMessage className="text-[#fb9797]" />
                </FormItem>
              )}
            />
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                onClick={onReset}
                className="bg-[#2a2a2a] text-white hover:bg-[#2a2a2a]/90 px-8 font-sans"
              >
                Reset
              </Button>
              <Button type="submit" className="bg-white text-black hover:bg-white/90 px-8 font-sans">
                Done
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}