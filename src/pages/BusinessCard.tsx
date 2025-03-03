import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import BlurText from "../components/BlurText";
import { SpinnerDiamond } from "spinners-react";
import { ThemeProvider, useTheme } from "../components/theme-provider";
import ThemeToggle from "../components/ThemeToggle";
import FloatingBubbles from "@/components/floating-bubbles";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-hot-toast"; // Changed from sonner to react-hot-toast

const BusinessCardContent = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDownloadVCF = async () => {
    try {
      const loadingToast = toast.loading("Preparing contact card...");
      const imageUrl = `https://qrbook.ca${personalInfo.profileImage}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();

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

      const blob = new Blob([vcfData], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${personalInfo.name}.vcf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Contact card downloaded successfully!");
    }
  };

  const handleCopyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const socialMediaIcons = {
    tiktok: "simple-icons:tiktok",
    instagram: "mdi:instagram",
    youtube: "mdi:youtube",
    facebook: "mdi:facebook",
    whatsapp: "mdi:whatsapp",
    linkedin: "mdi:linkedin",
    github: "mdi:github",
    twitter: "ri:twitter-x-fill",
    website: "mdi:web",
    snapchat: "mdi:snapchat",
    telegram: "mdi:telegram",
    discord: "ic:baseline-discord",
    pinterest: "mdi:pinterest",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SpinnerDiamond
          size={90}
          thickness={180}
          speed={100}
          color="rgba(65, 57, 172, 1)"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          Loading contact information...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Icon
          icon="solar:danger-triangle-bold"
          className="w-16 h-16 text-red-500 mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          {error}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          <Icon icon="mdi:refresh" className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!personalInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Icon
          icon="solar:user-broken"
          className="w-16 h-16 text-amber-500 mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Contact Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          We couldn't find the contact information you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between align-middle overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 mt-0 md:-mt-16 lg:-mt-20">
      <FloatingBubbles count={15} className="opacity-30 dark:opacity-16" />

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
          transition={{ duration: 0.7 }}
          className="w-full max-w-5xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Section - Profile Details - Reduced sizes for desktop */}
            <div className="w-full md:w-2/5 lg:w-1/3 p-4 md:p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800/90 dark:to-gray-900/90">
              <motion.div
                className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img
                  src={
                    personalInfo.profileImage
                      ? `https://qrbook.ca${personalInfo.profileImage}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&background=0D8ABC&color=fff&size=256`
                  }
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&background=0D8ABC&color=fff&size=256`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-full" />
              </motion.div>

              <motion.div
                className="mt-4 md:mt-5 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {personalInfo.name}
                </h1>
                <Badge className="mt-2 text-sm font-medium bg-blue-600/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-600/30">
                  {personalInfo.jobPosition}
                </Badge>
              </motion.div>

              <motion.div
                className="mt-4 md:mt-6 w-full space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <ContactItem
                  icon="mdi:email-outline"
                  label="Email"
                  value={personalInfo.email}
                  onClick={() =>
                    handleCopyToClipboard(
                      personalInfo.email,
                      "Email copied to clipboard"
                    )
                  }
                />
                <ContactItem
                  icon="mdi:phone-outline"
                  label="Phone"
                  value={personalInfo.mobileNumber}
                  onClick={() =>
                    handleCopyToClipboard(
                      personalInfo.mobileNumber,
                      "Phone number copied to clipboard"
                    )
                  }
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-4 md:mt-6 w-full"
              >
                <Button
                  onClick={handleDownloadVCF}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:account-plus-outline" className="w-5 h-5" />
                  Add to Contacts
                </Button>
              </motion.div>
            </div>

            {/* Right Section - Description and Social Links - Optimized spacing */}
            <div className="w-full md:w-3/5 lg:w-2/3 p-4 md:p-6 bg-white dark:bg-gray-900">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Icon icon="mdi:information-outline" className="mr-2 inline-block" />
                  About
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 md:p-4 rounded-xl shadow-sm">
                  {personalInfo.description ? (
                    <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                      {personalInfo.description}
                    </p>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center py-2 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                        <Icon 
                          icon="mdi:text-box-outline" 
                          className="w-6 h-6 text-blue-600 dark:text-blue-400" 
                        />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                        No description available yet.
                      </p>
                      <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-1 italic">
                        Contact me to learn more about my professional expertise.
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="mt-5 md:mt-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Icon icon="mdi:connection" className="mr-2 inline-block" />
                    Connect with me
                  </h2>
                
                  {personalInfo.socialMedia && personalInfo.socialMedia.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 md:gap-3">
                      {personalInfo.socialMedia.map((social, index) => (
                        <SocialIcon
                          key={index}
                          href={social.url}
                          platform={social.platform}
                          icon={
                            socialMediaIcons[social.platform.toLowerCase()] ||
                            "mdi:link-variant"
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Icon 
                            icon="mdi:account-network-outline" 
                            className="w-6 h-6 text-blue-600 dark:text-blue-400" 
                          />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          No social platforms available yet. Connect through contact details 
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="mt-5 md:mt-6 pt-4 border-t border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4">
                  <div className="text-center md:text-left w-full md:w-auto">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-1 flex items-center justify-center md:justify-start">
                      <Icon icon="mdi:share-variant-outline" className="mr-2" />
                      Share My Profile
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Connect with me on your preferred platform
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <ShareButton 
                      icon="mdi:email-outline"
                      onClick={() => {
                        const subject = `Contact information for ${personalInfo.name}`;
                        const body = `Here's the contact information for ${personalInfo.name}:\n\n${window.location.href}`;
                        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                      }}
                      label="Email"
                      color="bg-gray-600"
                    />
                    <ShareButton 
                      icon="mdi:whatsapp"
                      onClick={() => {
                        const text = `Check out ${personalInfo.name}'s contact information: ${window.location.href}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                      }}
                      label="WhatsApp"
                      color="bg-green-600"
                    />
                    <ShareButton 
                      icon="mdi:content-copy"
                      onClick={() => {
                        handleCopyToClipboard(window.location.href, "Link copied to clipboard");
                      }}
                      label="Copy"
                      color="bg-blue-600"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer - Reduced top margin */}
      <footer className="w-full py-2 md:py-3 px-4 md:px-6 text-center z-10">
        <motion.div
          className="text-xs md:text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p>
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
          <span className="hidden sm:inline-block">•</span>
          <p>
            Powered by{" "}
            <a
              href="https://vinasai.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Vinasai Inc
            </a>
          </p>
        </motion.div>
      </footer>
    </div>
  );
};

function ContactItem({ icon, label, value, onClick }) {
  return (
    <div
      className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center flex-shrink-0">
        <Icon
          icon={icon}
          className="w-4 h-4 text-blue-600 dark:text-blue-400"
        />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white truncate">
          {value}
        </p>
      </div>
      <Icon
        icon="mdi:content-copy"
        className="w-4 h-4 text-gray-400 dark:text-gray-500"
      />
    </div>
  );
}

function SocialIcon({ href, icon, platform }) {
  const getPlatformColor = (platform) => {
    const colors = {
      instagram: "from-pink-500 to-purple-600",
      facebook: "from-blue-600 to-blue-700",
      twitter: "from-blue-400 to-blue-500",
      linkedin: "from-blue-700 to-blue-800",
      github: "from-gray-800 to-black",
      youtube: "from-red-600 to-red-700",
      tiktok: "from-black to-gray-800",
      website: "from-indigo-500 to-purple-600",
      whatsapp: "from-green-500 to-green-600",
      telegram: "from-blue-400 to-blue-600",
      discord: "from-indigo-600 to-indigo-800",
      pinterest: "from-red-500 to-red-700",
      snapchat: "from-yellow-400 to-yellow-500",
    };
    
    return colors[platform.toLowerCase()] || "from-blue-400 to-indigo-500";
  };
  
  const platformColor = getPlatformColor(platform);
  
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
  );
}

export default BusinessCard
