import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser as faUserIcon,
  faAt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTiktok,
  faInstagram,
  faYoutube,
  faFacebook,
  faWhatsapp,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner"; // Direct import from sonner
import { validateForm } from "../utils/validation";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ContactForm from "../components/ContactForm";
import SocialMediaForm from "../components/SocialMediaForm";
import { useNavigate } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const platforms = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
];

interface FormData {
  name: string;
  pronouns: string;
  jobPosition: string;
  mobileNumber: string;
  email: string;
  website: string;
  address: string;
  profileImage: File | null;
  description: string;
  socialMedia: { platform: string; url: string; }[];
  [key: string]: string | File | null | { platform: string; url: string; }[];
}

interface InputChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

export default function CreatorForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    pronouns: "",
    jobPosition: "",
    mobileNumber: "",
    email: "",
    website: "",
    address: "",
    profileImage: null,
    description: "",
    socialMedia: [],
  });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const handleSocialMediaChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addSocialMediaLink = () => {
    setFormData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: '', url: '' }]
    }));
  };

  const removeSocialMediaLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Format phone number if it exists
    if (formData.mobileNumber) {
      // Remove any non-digit characters except +
      const cleaned = formData.mobileNumber.replace(/[^\d+]/g, '');
      
      // Check if it has country code (starts with +)
      if (!cleaned.startsWith('+')) {
        toast.error("Invalid Phone Number", {
          description: "Phone number must include country code (e.g. +1 for US/Canada)",
        });
        return;
      }

      // Format the number as +XX XX-XXX-XXXX or +XX XX-XXX-XX
      const matches = cleaned.match(/^\+(\d{1,4})(\d{2})(\d{3})(\d{2,4})$/);
      if (!matches) {
        toast.error("Invalid Phone Number", {
          description: "Phone number must be 8-10 digits with country code",
        });
        return;
      }

      // Update the formData with formatted number
      setFormData(prev => ({
        ...prev,
        mobileNumber: `+${matches[1]} ${matches[2]}-${matches[3]}-${matches[4]}`
      }));
    }

    // Validate form data
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((error) => {
        toast.error("Validation Error", {
          description: error,
        });
      });
      return;
    }

    // Get userId from cookies
    const userId = Cookies.get("userId");
    if (!userId) {
      toast.error("Authentication Error", {
        description: "Please login to create a business card",
      });
      return;
    }

    // Create FormData object
    const formDataWithFile = new FormData();

    // Append userId
    formDataWithFile.append("userId", userId);

    // Append all non-file fields dynamically
    Object.keys(formData).forEach((key) => {
      if (key !== "socialMedia" && key !== "profileImage") {
        formDataWithFile.append(key, formData[key] as string);
      }
    });

    // Append social media as JSON string
    formDataWithFile.append("socialMedia", JSON.stringify(formData.socialMedia));

    // Append profile image if exists
    if (formData.profileImage) {
      formDataWithFile.append("profileImage", formData.profileImage);
    }

    try {
      const response = await fetch("https://qrbook.ca/api/qr-codes", {
        method: "POST",
        body: formDataWithFile,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create QR code");
      }

      toast.success("Success", {
        description: "QR code created successfully",
      });

      navigate("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create QR code";
      toast.error("Error", {
        description: errorMessage,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      pronouns: "",
      jobPosition: "",
      mobileNumber: "",
      email: "",
      website: "",
      address: "",
      profileImage: null,
      description: "",
      socialMedia: [],
    });
    setErrors({});
    setCurrentStep(0);
  };

  const steps = [
    { title: "Personal Info", icon: faUserIcon },
    { title: "Contact", icon: faEnvelope },
    { title: "Social Media", icon: faAt },
  ];

  return (
    <div className="min-h-screen pb-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back
            </Button>
          </div>
          <CardTitle className="text-xl font-sans text-center">
            Create Your Digital Business Card
          </CardTitle>
          <CardDescription className="text-center font-sans text-lg">
            Generate a beautiful, shareable digital business card with QR code
            in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep.toString()} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {steps.map((step, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  onClick={() => setCurrentStep(index)}
                  disabled={index > currentStep}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-sans"
                >
                  <FontAwesomeIcon icon={step.icon} className="mr-2 " />

                  {step.title}
                </TabsTrigger>
              ))}
            </TabsList>
            <form onSubmit={handleSubmit} className="space-y-8 mt-8">
              <TabsContent value="0">
                <PersonalInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleFileChange={handleFileChange}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="1">
                <ContactForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="2">
                <SocialMediaForm
                  formData={formData}
                  handleSocialMediaChange={handleSocialMediaChange}
                  addSocialMediaLink={addSocialMediaLink}
                  removeSocialMediaLink={removeSocialMediaLink}
                  errors={errors}
                />
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="font-sans"
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              className="font-sans"
              onClick={() => {
                const currentStepErrors = validateForm(formData, currentStep);
                if (Object.keys(currentStepErrors).length > 0) {
                  setErrors(currentStepErrors);
                  Object.values(currentStepErrors).forEach((error) => {
                    toast.error("Validation Error", {
                      description: error,
                    });
                  });
                } else {
                  setCurrentStep((prev) =>
                    Math.min(steps.length - 1, prev + 1),
                  );
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" onClick={handleSubmit}>
              Generate Business Card
            </Button>
          )}
        </CardFooter>
      </Card>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Business Card Created Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your digital business card has been generated. You can now view
              and share it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => (window.location.href = "/myqrs")}
            >
              Go to My QRs
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
