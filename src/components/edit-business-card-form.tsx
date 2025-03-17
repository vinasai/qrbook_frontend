"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PersonalInfoForm from "./personal-info-form";
import ContactForm from "./contact-form";
import SocialMediaForm from "./social-media-form";
import axios from "axios";
import { toast } from "sonner";

interface EditBusinessCardFormProps {
  initialData: any; // Replace 'any' with your Card type
  onClose: () => void;
  onSave: (updatedCard: any) => void; // Replace 'any' with your Card type
}

export default function EditBusinessCardForm({
  initialData,
  onClose,
  onSave,
}: EditBusinessCardFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleSocialMediaChange = (index, field, value) => {
    const updatedSocialMedia = [...formData.socialMedia];
    updatedSocialMedia[index][field] = value;
    setFormData((prev) => ({ ...prev, socialMedia: updatedSocialMedia }));
  };

  const addSocialMediaLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: "", url: "" }],
    }));
  };

  const removeSocialMediaLink = (index) => {
    const updatedSocialMedia = formData.socialMedia.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({ ...prev, socialMedia: updatedSocialMedia }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();

    // Add all text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "profileImage" && key !== "socialMedia") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Handle profile image
    if (formData.profileImage && formData.profileImage instanceof File) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    // Handle social media
    formDataToSend.append("socialMedia", JSON.stringify(formData.socialMedia));

    try {
      const response = await axios.put(
        `https://qrbook.ca/api/cards/update/${initialData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Business card updated successfully!");
      onSave(response.data);
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card", {
        description:
          error.response?.data?.message ||
          "Please check your input and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Business Card</CardTitle>
          <CardDescription>
            Update your business card information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <PersonalInfoForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                errors={errors}
              />
            </TabsContent>
            <TabsContent value="contact">
              <ContactForm
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
              />
            </TabsContent>
            <TabsContent value="social">
              <SocialMediaForm
                formData={formData}
                handleSocialMediaChange={handleSocialMediaChange}
                addSocialMediaLink={addSocialMediaLink}
                removeSocialMediaLink={removeSocialMediaLink}
                errors={errors}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
