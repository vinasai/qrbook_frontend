"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import AOS from "aos"
import "aos/dist/aos.css"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AnimatedBackground } from "../components/ElegantAnimatedBackground"
import { UserIcon, PhoneIcon, Share2Icon, LayoutIcon, PaletteIcon, RocketIcon } from "lucide-react"


export default function HomePage() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  const steps = [
    { icon: UserIcon, title: "Enter Personal Info", description: "Start by providing your basic details." },
    { icon: PhoneIcon, title: "Add Contact Information", description: "Include ways for people to reach you." },
    { icon: Share2Icon, title: "Connect Social Media", description: "Link your social profiles to expand your reach." },
  ]

  const features = [
    {
      icon: LayoutIcon,
      title: "Customizable Templates",
      description: "Choose from a variety of professional templates.",
    },
    {
      icon: PaletteIcon,
      title: "Easy Customization",
      description: "Personalize colors, fonts, and layouts with ease.",
    },
    { icon: RocketIcon, title: "Quick Launch", description: "Go live with your landing page in minutes, not hours." },
  ]

  const testimonials = [
    {
      name: "Sarah L.",
      role: "Entrepreneur",
      quote: "This tool saved me so much time. I had my landing page up in no time!",
    },
    {
      name: "Mike R.",
      role: "Marketing Manager",
      quote: "The templates are sleek and professional. Our conversion rates improved significantly.",
    },
    {
      name: "Emily T.",
      role: "Freelancer",
      quote: "As a non-designer, this platform made it easy for me to create a stunning page.",
    },
  ]

  const faqs = [
    {
      question: "Is it mobile responsive?",
      answer:
        "Yes, all our templates are fully responsive and will look great on any device, from smartphones to desktops.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "We offer 24/7 customer support to help you with any questions or issues you might encounter while using our platform.",
    },
  ]

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log("Signed up with email:", email)
    alert("Thanks for signing up! Check your email for updates.")
    setEmail("")
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden ">
      <AnimatedBackground />

      

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center pt-20 md:pt-32 pb-16">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <span className="text-lg font-geo text-primary/60 tracking-wide">QRBook</span>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b font-geo from-primary to-primary/80">
                Create Your
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-primary/90 to-rose-300 font-pacifico">
                Perfect Landing
              </span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-xl sm:text-2xl md:text-3xl text-primary/40 mb-8 leading-relaxed font-geo tracking-wide max-w-xl mx-auto px-4">
              Design, generate, and share stunning landing pages in minutes. Get started with just a few clicks!
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center mb-20"
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => (window.location.href = "/creator-form")}
              className="font-geo text-xl px-8 py-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              Create Your Landing Page
            </Button>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-geo text-center text-primary mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/[0.05]"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <step.icon className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
                <h3 className="text-2xl font-passion text-primary mb-2">{step.title}</h3>
                <p className="text-primary/60 font-geo text-xl">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-geo text-center text-primary mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/[0.05]"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-2xl font-passion text-primary mb-2">{feature.title}</h3>
                <p className="text-primary/60 font-geo  text-xl">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-geo text-center text-primary mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-primary font-geo text-2xl hover:text-indigo-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-primary/60 font-geo text-xl">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-background border-t border-border py-8">
        <div className="container text-xl mx-auto px-4 md:px-6 font-geo text-center text-primary/60">
          <p>&copy; 2025 QRBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

