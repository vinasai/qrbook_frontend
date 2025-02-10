import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import AnimatedBackground3D from "../components/AnimatedBackground3D"
import BlurText from "../components/BlurText"
import { SpinnerDiamond } from "spinners-react"
import { ThemeProvider, useTheme } from "../components/theme-provider"
import ThemeToggle from "../components/ThemeToggle"
import FloatingBubbles from "@/components/floating-bubbles"

const BusinessCardContent = () => {
  const { theme } = useTheme()
  const { id } = useParams()
  const [personalInfo, setPersonalInfo] = useState(null)

  useEffect(() => {
  const fetchCardData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/cards/encoded/${id}`
      );
      setPersonalInfo(response.data);
    } catch (error) {
      // Fallback to original ID endpoint
      try {
        const fallbackResponse = await axios.get(
          `http://localhost:5000/api/cards/${id}`
        );
        setPersonalInfo(fallbackResponse.data);
      } catch (fallbackError) {
        console.error("Both endpoints failed:", fallbackError);
      }
    }
  };

  fetchCardData();
}, [id]);

  if (!personalInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SpinnerDiamond
          size={90}
          thickness={180}
          speed={100}
          color="rgba(65, 57, 172, 1)"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
      </div>
    )
  }

  const handleDownloadVCF = () => {
    const vcfData = `BEGIN:VCARD
VERSION:3.0
FN:${personalInfo.name}
N:${personalInfo.name.split(" ")[1] || ""};${personalInfo.name.split(" ")[0]};;;
EMAIL;TYPE=E-Mail:${personalInfo.email}
TEL;TYPE=CELL,PREF:${personalInfo.mobileNumber}
PHOTO;VALUE=URI:${personalInfo.profileImage}
END:VCARD`.replace(/\n/g, "\r\n")

    const blob = new Blob([vcfData], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${personalInfo.name}.vcf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleAnimationComplete = () => {
    console.log("Animation completed!")
  }

  const socialMediaIcons = {
    tiktok: "simple-icons:tiktok",
    instagram: "mdi:instagram",
    youtube: "mdi:youtube",
    facebook: "mdi:facebook",
    whatsapp: "mdi:whatsapp",
    linkedin: "mdi:linkedin",
    github: "mdi:github",
    twitter: "mdi:twitter",
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between overflow-hidden">
      <FloatingBubbles />

      {/* Header */}
      <header className="w-full p-4 md:p-6 z-10">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-5xl font-pacifico bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              {personalInfo.name}
            </span>
          </motion.div>
          <ThemeToggle />
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center p-4 md:p-6 z-10">
        <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Left Section - Profile Image */}
          <motion.div
            className="relative w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-blue-400 dark:border-blue-600 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={`http://localhost:5000${personalInfo.profileImage}`}
              alt={personalInfo.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-full" />
          </motion.div>

          {/* Right Section - Info */}
          <div className="text-center md:text-left">
            <BlurText
              text={`Hi, I'm ${personalInfo.name}`}
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-passion mb-2 md:mb-4 text-gray-900 dark:text-white"
              animationDelay={0.8}
            />

            <BlurText
              text={personalInfo.jobPosition}
              delay={100}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-lg sm:text-xl font-russo md:text-xl text-blue-600 dark:text-blue-400 mb-4 md:mb-6"
              animationDelay={1.2}
            />

            <BlurText
              text={personalInfo.description}
              delay={50}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-xl sm:text-3xl md:text-4xl font-geo text-gray-600 dark:text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto md:mx-0"
              animationDelay={1.6}
            />

            {/* Contact Info */}
            <motion.div
              className="inline-flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 bg-gray-200 dark:bg-gray-800 rounded-lg sm:rounded-full px-4 py-2 sm:py-1 mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <div className="flex items-center gap-2">
                <Icon icon="mdi:email" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-lg sm:text-xl text-gray-800 font-russo dark:text-gray-200">{personalInfo.email}</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-400 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <Icon icon="mdi:phone" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-lg sm:text-xl text-gray-800 font-russo dark:text-gray-200">{personalInfo.mobileNumber}</span>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex flex-wrap justify-center md:justify-start gap-4 mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              {personalInfo.socialMedia.map((social, index) => (
                <SocialIcon key={index} href={social.url} icon={socialMediaIcons[social.platform]} />
              ))}
            </motion.div>

            {/* Get in Touch Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
            >
              <button
                onClick={handleDownloadVCF}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-full transition-all duration-300 inline-flex items-center gap-2"
              >
                <span className="font-russo">Get in Touch</span>
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}>
                  👋
                </motion.span>
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-4 md:p-6 text-center z-10">
        <motion.p
          className="text-lg sm:text-xl font-geo text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.8 }}
        >
          © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
        </motion.p>
      </footer>
    </div>
  )
}

function SocialIcon({ href, icon }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
      whileHover={{ scale: 1.1, rotate: 10 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon icon={icon} className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 dark:text-gray-200" />
    </motion.a>
  )
}

function BusinessCard() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="business-card-theme">
      <BusinessCardContent />
    </ThemeProvider>
  )
}

export default BusinessCard

