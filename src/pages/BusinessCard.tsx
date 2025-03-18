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
import PersonalInfoForm from '../components/PersonalInfoForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define types for our data
interface SocialMedia {
  platform: string;
  url: string;
}

interface PersonalInfo {
  name: string;
  jobPosition: string;
  email: string;
  mobileNumber: string;
  profileImage: string;
  description?: string;
  address?: string;
  websiteTitle?: string;
  socialMedia?: SocialMedia[];
  paymentConfirmed?: boolean;
  createdAt: string;
}

interface ContactItemProps {
  icon: string;
  label: string;
  value: string;
  onClick: () => void;
}

interface AddressItemProps {
  address: string;
  onClick: () => void;
}

interface WebsitePreviewProps {
  url: string;
  title: string;
  onClick: () => void;
}

interface SocialIconProps {
  href: string;
  icon: string;
  platform: string;
}

interface ShareButtonProps {
  icon: string;
  onClick: () => void;
  label: string;
  color: string;
}

// Add interface for FloatingBubbles props
interface FloatingBubblesProps {
  count: number;
  className?: string;
}

// Declare the FloatingBubbles component with proper props
declare module "@/components/floating-bubbles" {
  const FloatingBubbles: React.FC<FloatingBubblesProps>;
  export default FloatingBubbles;
}

// Update the Theme type to match what ThemeProvider expects
interface ThemeProviderProps {
  defaultTheme: "light" | "dark" | "system";
  storageKey: string;
  children: React.ReactNode;
}

// Update the ThemeProvider declaration
declare module "../components/theme-provider" {
  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export const useTheme: () => { theme: string | undefined };
}

const BusinessCardContent = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://qrbook.ca/api/cards/encoded/${id}`,
        );
        setPersonalInfo(response.data);
        setLoading(false);
      } catch (error) {
        // Fallback to original ID endpoint
        try {
          const fallbackResponse = await axios.get(
            `https://qrbook.ca/api/cards/${id}`,
          );
          setPersonalInfo(fallbackResponse.data);
          setLoading(false);
        } catch (fallbackError) {
          console.error("Both endpoints failed:", fallbackError);
          setError("Could not load contact information");
          setLoading(false);
        }
      }
    };

    fetchCardData();
  }, [id]);

  // Payment status check
  const isPaymentRequired = () => {
    if (!personalInfo) return false;
    
    // If payment is already confirmed, no need to check further
    if (personalInfo.paymentConfirmed) return false;

    // Check if 4 days have passed since creation
    const creationDate = new Date(personalInfo.createdAt);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceCreation >= 4;
  };

  const handleDownloadVCF = async () => {
    if (!personalInfo) return;

    try {
      const loadingToast = toast.loading("Preparing contact card...");
      const imageUrl = `https://qrbook.ca${personalInfo.profileImage}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        if (!reader.result) {
          toast.error("Failed to process image");
          return;
        }

        const base64data = (reader.result as string).split(",")[1];
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
        toast.dismiss(loadingToast);
        toast.success("Contact card downloaded successfully!");
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
PHOTO;VALUE=URI:https://qrbook.ca${personalInfo.profileImage}
END:VCARD`.replace(/\n/g, "\r\n");

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

  const handleCopyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const openInMaps = (address: string) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank");
    toast.success("Opening address in maps");
  };

  const openWebsite = (url: string) => {
    if (!url) return;
    window.open(url, "_blank");
    toast.success("Opening website");
  };

  const socialMediaIcons: Record<string, string> = {
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

  // Function to check if description has multiple line breaks
  const hasMultipleLineBreaks = (text?: string): boolean => {
    if (!text) return false;
    const brMatches = text.match(/<br\s*\/?>/gi);
    const newlineMatches = text.match(/\n\n/g);
    return (brMatches?.length > 1) || (newlineMatches?.length ?? 0) > 0;
  };

  // Render truncated description
  const renderDescription = (description?: string): React.ReactNode => {
    if (!description) return null;
    
    // If has multiple line breaks, show the "See more" icon
    if (hasMultipleLineBreaks(description)) {
      // Get first paragraph or limit description length
      let firstPart = description;
      
      // Try to get first paragraph if there are HTML breaks
      if (description.includes('<br')) {
        firstPart = description.split(/<br\s*\/?>/i)[0] + '...';
      } 
      // Or if there are newlines
      else if (description.includes('\n\n')) {
        firstPart = description.split('\n\n')[0] + '...';
      }
      // Or just limit by characters
      else if (description.length > 150) {
        firstPart = description.substring(0, 150) + '...';
      }

      return (
        <div className="relative">
          <div dangerouslySetInnerHTML={{ __html: firstPart }} />
          <div 
            className="absolute bottom-0 right-0 p-1 cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullDescription(true);
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors">
                    <Icon icon="mdi:text-box-plus-outline" className="w-5 h-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">View full description</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      );
    }

    // If no multiple line breaks, just show the description
    return <div dangerouslySetInnerHTML={{ __html: description }} />;
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

  // Payment Required Fallback UI
  if (isPaymentRequired()) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
        <FloatingBubbles count={8} className="opacity-20 dark:opacity-10" />
        
        <div className="w-full max-w-xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Card header with pulsing effect */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-500/5 dark:via-orange-500/5 dark:to-red-500/5 p-8 backdrop-blur-xl border border-amber-200/20 dark:border-amber-500/10 shadow-xl relative overflow-hidden">
              {/* Animated background effect */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"></div>
              </div>

              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 flex justify-center relative"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500 to-red-500 blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center shadow-lg">
                    <Icon icon="solar:lock-password-bold" className="w-10 h-10 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-4 relative"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-600 dark:from-amber-400 dark:to-red-400 bg-clip-text text-transparent">
                  Premium Content
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  This business card requires payment activation. Unlock full access to {personalInfo.name}'s professional profile and contact details.
                </p>
              </motion.div>
            </div>

            {/* Card body with enhanced steps */}
            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-800">
              <div className="space-y-6">
                {/* Payment steps with improved visuals */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900/50 relative overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all duration-300"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                      <span className="text-amber-700 dark:text-amber-300 text-sm font-bold">1</span>
                    </div>
                    <div className="relative">
                      <h3 className="font-semibold text-amber-900 dark:text-amber-200">Contact Card Owner</h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Get in touch with {personalInfo.name} to activate your access
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50 relative overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                      <span className="text-blue-700 dark:text-blue-300 text-sm font-bold">2</span>
                    </div>
                    <div className="relative">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-200">Complete Payment</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Follow the secure payment process to unlock premium features
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-900/50 relative overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                      <span className="text-green-700 dark:text-green-300 text-sm font-bold">3</span>
                    </div>
                    <div className="relative">
                      <h3 className="font-semibold text-green-900 dark:text-green-200">Instant Access</h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Get immediate access to contact details and premium features
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Feature list */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800"
                >
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Premium Features Include:</h4>
                  <ul className="space-y-2">
                    {[
                      { icon: "mdi:account-details-outline", text: "Full profile access" },
                      { icon: "mdi:phone-check-outline", text: "Direct contact information" },
                      { icon: "mdi:share-variant-outline", text: "Social media connections" },
                      { icon: "mdi:map-marker-outline", text: "Business location details" },
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <Icon icon={feature.icon} className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        {feature.text}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  
                  <Button
                    onClick={() => window.location.href = 'mailto:' + personalInfo.email}
                    variant="outline"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-medium py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      <Icon icon="mdi:email-outline" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Contact Owner
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Support text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-6 space-y-2"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help? Contact support at{" "}
              <a href="mailto:support@qrbook.ca" className="text-amber-600 dark:text-amber-400 hover:underline">
                support@qrbook.ca
              </a>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Secure payment processing by Stripe
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Fix the website link extraction to handle undefined
  const websiteLink =
    personalInfo?.socialMedia?.find(
      (social) => social.platform.toLowerCase() === "website",
    )?.url || "";

  return (
    <div className="min-h-screen w-full flex flex-col justify-between align-middle overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 mt-0 md:-mt-16 lg:-mt-20">
      <FloatingBubbles count={15} className="opacity-30 dark:opacity-16" />

      {/* Description Modal */}
      <Dialog open={showFullDescription} onOpenChange={setShowFullDescription}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Icon icon="mdi:information-outline" className="text-blue-600 dark:text-blue-400" />
              About {personalInfo?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            {personalInfo?.description && (
              <div dangerouslySetInnerHTML={{ __html: personalInfo.description }} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content - Adjusted to fit on one screen */}
      <main className="relative flex-grow flex items-center justify-center py-4 md:py-2 px-4 md:px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-5xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Section - Profile Details - Reduced sizes for desktop */}
            <div className="w-full md:w-2/5 lg:w-1/3 p-4 md:p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800/90 dark:to-gray-900/90">
              <motion.div
                className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-50 lg:h-50 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl flex-shrink-0"
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
                <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-900 dark:text-white">
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
                      "Email copied to clipboard",
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
                      "Phone number copied to clipboard",
                    )
                  }
                />

                {/* Add website preview if available */}
                {websiteLink && (
                  <WebsitePreview
                    url={websiteLink}
                    title={personalInfo.websiteTitle || "My Website"}
                    onClick={() => openWebsite(websiteLink)}
                  />
                )}
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
            <div className="w-full md:w-3/5 lg:w-2/3 p-4 md:p-6 bg-white dark:bg-gray-900 flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-grow"
              >
                {/* Add address if available - Moved to top of right section */}
                {personalInfo.address && (
                  <motion.div
                    className="mb-5 md:mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl overflow-hidden border border-blue-100 dark:border-blue-800/30 shadow-sm">
                      <div className="flex items-center justify-between p-3 border-b border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Icon
                              icon="mdi:map-marker"
                              className="w-4 h-4 text-blue-600 dark:text-blue-400"
                            />
                          </div>
                          <h3 className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                            Address
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 h-auto"
                          onClick={() => openInMaps(personalInfo.address || "")}
                        >
                          <Icon
                            icon="mdi:directions"
                            className="w-4 h-4 mr-1"
                          />
                          Get Directions
                        </Button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                          {personalInfo.address}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Icon
                    icon="mdi:information-outline"
                    className="mr-2 inline-block"
                  />
                  About
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 md:p-4 rounded-xl shadow-sm">
                  {personalInfo.description ? (
                    <div 
                      className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed"
                    >
                      {renderDescription(personalInfo.description)}
                    </div>
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
                        Contact me to learn more about my professional
                        expertise.
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="mt-5 md:mt-6 mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Icon icon="mdi:connection" className="mr-2 inline-block" />
                    Connect with me
                  </h2>

                  {personalInfo.socialMedia &&
                  personalInfo.socialMedia.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 md:gap-3">
                      {personalInfo.socialMedia
                        // Filter out website as it's now displayed separately
                        .filter(
                          (social) =>
                            social.platform.toLowerCase() !== "website",
                        )
                        .map((social, index) => (
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
                          No social platforms available yet. Connect through
                          contact details
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Share My Profile section - Now with mt-auto to push it to the bottom */}
              <motion.div
                className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800"
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
                      Share me on your preferred platform
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <ShareButton
                      icon="mdi:email-outline"
                      onClick={() => {
                        const subject = `Contact information for ${personalInfo.name}`;
                        const body = `Here's the contact information for ${personalInfo.name}:\n\n${window.location.href}`;
                        window.open(
                          `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
                        );
                      }}
                      label="Email"
                      color="bg-gray-600"
                    />

                    <ShareButton
                      icon="mdi:whatsapp"
                      onClick={() => {
                        const text = `Check out ${personalInfo.name}'s contact information: ${window.location.href}`;
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(text)}`,
                        );
                      }}
                      label="WhatsApp"
                      color="bg-green-600"
                    />

                    <ShareButton
                      icon="mdi:content-copy"
                      onClick={() => {
                        handleCopyToClipboard(
                          window.location.href,
                          "Link copied to clipboard",
                        );
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
            © {new Date().getFullYear()} {personalInfo.name}. All rights
            reserved.
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

function ContactItem({ icon, label, value, onClick }: ContactItemProps) {
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

// New component for address with map link
function AddressItem({ address, onClick }: AddressItemProps) {
  return (
    <motion.div
      className="mt-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800/30 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-gray-700">
          <Icon
            icon="mdi:map-marker"
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Address
              </p>
              <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                {address}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-colors">
              <Icon
                icon="mdi:directions"
                className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Click to open in maps
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// New component for website with preview
function WebsitePreview({ url, title, onClick }: WebsitePreviewProps) {
  // Extract domain for display
  const domain = url ? new URL(url).hostname.replace("www.", "") : "";

  return (
    <motion.div
      className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-gray-800"
      onClick={onClick}
      whileHover={{ y: -3 }}
    >
      <div className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 flex items-center justify-center mr-2">
          <Icon
            icon="mdi:web"
            className="w-4 h-4 text-blue-600 dark:text-blue-400"
          />
        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {title || domain}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {domain}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-sm group-hover:bg-blue-600 transition-colors">
          <Icon
            icon="mdi:open-in-new"
            className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors"
          />
        </div>
      </div>
      <div className="h-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/5 dark:to-indigo-900/5 flex items-center justify-center p-2">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          Click to visit my website
        </p>
      </div>
    </motion.div>
  );
}

function SocialIcon({ href, icon, platform }: SocialIconProps) {
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
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
  
  // Get a solid color for the icon based on the platform
  const getIconColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: "text-pink-600",
      facebook: "text-blue-600",
      twitter: "text-blue-400",
      linkedin: "text-blue-700",
      github: "text-gray-800 dark:text-gray-200",
      youtube: "text-red-600",
      tiktok: "text-gray-900 dark:text-gray-100",
      website: "text-indigo-600",
      whatsapp: "text-green-600",
      telegram: "text-blue-500",
      discord: "text-indigo-600",
      pinterest: "text-red-600",
      snapchat: "text-yellow-500",
    };

    return colors[platform.toLowerCase()] || "text-blue-600";
  };

  const iconColor = getIconColor(platform);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Fixed square container with consistent width and height */}
            <div className="w-12 h-12 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden relative">
              <Icon
                icon={icon}
                className={`w-5 h-5 ${iconColor} group-hover:text-white transition-colors duration-300 relative z-10`}
              />

              {/* Background with default low opacity that increases on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${platformColor} opacity-10 group-hover:opacity-95 transition-opacity duration-300`}
              ></div>
              
              {/* Bottom highlight bar that expands on hover */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r ${platformColor} transform scale-x-100 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.a>
        </TooltipTrigger>
        <TooltipContent
          className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg"
          side="top"
        >
          <p className="font-medium">{platform}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ShareButton({ icon, onClick, label, color }: ShareButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.button
            onClick={onClick}
            className={`${color} text-white p-2 rounded-full shadow-md`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon={icon} className="w-5 h-5" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          Share via {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function BusinessCard() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="business-card-theme">
      <BusinessCardContent />
    </ThemeProvider>
  );
}

export default BusinessCard;
