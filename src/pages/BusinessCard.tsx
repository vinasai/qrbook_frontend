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
          `https://qrbook.ca:5002/api/cards/encoded/${id}`
        );
        setPersonalInfo(response.data);
      } catch (error) {
        // Fallback to original ID endpoint
        try {
          const fallbackResponse = await axios.get(
            `https://qrbook.ca:5002/api/cards/${id}`
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

  const handleDownloadVCF = async () => {
    try {
      const imageUrl = `https://qrbook.ca:5002${personalInfo.profileImage}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        const vcfData = `BEGIN:VCARD
VERSION:3.0
FN:${personalInfo.name}
N:${personalInfo.name.split(" ")[1] || ""};${personalInfo.name.split(" ")[0]};;;
EMAIL;TYPE=E-Mail:${personalInfo.email}
TEL;TYPE=CELL,PREF:${personalInfo.mobileNumber}
PHOTO;ENCODING=b;TYPE=JPEG:${base64data}
END:VCARD`.replace(/\n/g, "\r\n");

        const vcfBlob = new Blob([vcfData], { type: "text/vcard" });
        const url = URL.createObjectURL(vcfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${personalInfo.name}.vcf`;
        link.click();
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Error embedding image, using URI instead:", error);
      // Fallback to URI version
      const vcfData = `BEGIN:VCARD
VERSION:3.0
FN:${personalInfo.name}
N:${personalInfo.name.split(" ")[1] || ""};${personalInfo.name.split(" ")[0]};;;
EMAIL;TYPE=E-Mail:${personalInfo.email}
TEL;TYPE=CELL,PREF:${personalInfo.mobileNumber}
PHOTO;VALUE=URI:https://qrbook.ca:5002${personalInfo.profileImage}
END:VCARD`.replace(/\n/g, "\r\n");

      const blob = new Blob([vcfData], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${personalInfo.name}.vcf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

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
      <header className="w-full px-4  md:px-6 md:py-4 z-10">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <span className="text-3xl sm:text-4xl md:text-5xl font-pacifico bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text truncate max-w-[200px] sm:max-w-none">
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
            className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-blue-400 dark:border-blue-600 shadow-2xl flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={`https://qrbook.ca:5002${personalInfo.profileImage}`}
              alt={personalInfo.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-full" />
          </motion.div>

          {/* Right Section - Info */}
          <div className="text-center md:text-left w-full max-w-full">
            <BlurText
              text={`Hi, I'm ${personalInfo.name}`}
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-sans mb-2 md:mb-4 text-gray-900 dark:text-white"
              animationDelay={0.8}
            />

            <BlurText
              text={personalInfo.jobPosition}
              delay={100}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-base sm:text-lg md:text-xl text-blue-600 dark:text-blue-400 mb-3 md:mb-5"
              animationDelay={1.2}
            />

            <BlurText
              text={personalInfo.description}
              delay={50}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-geo text-gray-600 dark:text-gray-300 mb-4 md:mb-6 max-w-2xl mx-auto md:mx-0"
              animationDelay={1.6}
            />

            {/* Contact Info */}
            <motion.div
              className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 bg-gray-200 dark:bg-gray-800 rounded-lg sm:rounded-full px-4 py-2 sm:py-1 mb-4 md:mb-6 mx-auto md:mx-0 max-w-max"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <div className="flex items-center gap-2">
                <Icon icon="mdi:email" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-lg text-gray-800 font-sans dark:text-gray-200 truncate max-w-[180px] sm:max-w-none">
                  {personalInfo.email}
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-400 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <Icon icon="mdi:phone" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-lg text-gray-800 font-sans dark:text-gray-200">
                  {personalInfo.mobileNumber}
                </span>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mb-4 md:mb-6"
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
              className="flex justify-center md:justify-start"
            >
              <button
                onClick={handleDownloadVCF}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-full transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="font-sans">Get in Touch</span>
                <motion.span 
                  animate={{ x: [0, 5, 0] }} 
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                  className="text-lg sm:text-xl"
                >
                  👋
                </motion.span>
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-4 md:p-6 text-center z-10 mt-6 sm:mt-0">
        <motion.p
          className="text-sm sm:text-base md:text-lg font-geo text-gray-500 dark:text-gray-400"
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
      className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors shadow-md"
      whileHover={{ scale: 1.1, rotate: 10 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon icon={icon} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800 dark:text-gray-200" />
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