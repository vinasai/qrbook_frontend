interface SocialMedia {
  platform: string;
  url: string;
}

interface FormData {
  name: string;
  pronouns: string;  // Added pronouns as required
  jobPosition: string;
  mobileNumber: string;
  email: string;
  description?: string;
  socialMedia: SocialMedia[];
  website?: string;
  address?: string;
  profileImage?: File | null;
}

interface ValidationErrors {
  [key: string]: string;
}

interface PlatformValidator {
  pattern: RegExp;
  example: string;
}

type PlatformPatterns = {
  [key in 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'whatsapp' | 'linkedin' | 'github']: PlatformValidator;
}

const platformPatterns: PlatformPatterns = {
  tiktok: {
    pattern: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/?$/,
    example: "https://tiktok.com/@username",
  },
  instagram: {
    pattern: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/,
    example: "https://instagram.com/username",
  },
  youtube: {
    pattern: /^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|@)?[\w.-]+\/?$/,
    example: "https://youtube.com/@channel",
  },
  facebook: {
    pattern: /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+\/?$/,
    example: "https://facebook.com/username",
  },
  whatsapp: {
    pattern: /^https?:\/\/(api\.)?whatsapp\.com\/(send\/)?\?phone=\d+$|^https?:\/\/wa\.me\/\d+$/,
    example: "https://wa.me/1234567890",
  },
  linkedin: {
    pattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w.-]+\/?$/,
    example: "https://linkedin.com/in/profile-name",
  },
  github: {
    pattern: /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/?$/,
    example: "https://github.com/username",
  },
};

export const validateForm = (formData: FormData, currentStep: number = -1): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (currentStep === 0 || currentStep === -1) {
    if (!formData.name) errors.name = "Name is required";
    if (!formData.pronouns) errors.pronouns = "Pronouns are required";  // Added pronouns validation
    if (!formData.jobPosition) errors.jobPosition = "Job position is required";
  }

  if (currentStep === 1 || currentStep === -1) {
    // Mobile number validation for format: +XX XX-XXX-XXXX or XX-XXX-XXXX
    if (!formData.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    } else {
      // Remove all non-digit characters for length check
      const digitsOnly = formData.mobileNumber.replace(/\D/g, "");
      
      // Check if the number has country code
      const hasCountryCode = formData.mobileNumber.startsWith('+');
      
      if (hasCountryCode) {
        // Format with country code: +XX XX-XXX-XXXX
        const phoneRegex = /^\+\d{1,4}\s\d{2}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(formData.mobileNumber)) {
          errors.mobileNumber = "Invalid format. Please use: +[country code] XX-XXX-XXXX";
        }
      } else {
        // Format without country code: XX-XXX-XXXX or XXX-XXX-XXX
        const phoneRegex = /^\d{2}-\d{3}-\d{4}$|^\d{3}-\d{3}-\d{3}$/;
        if (!phoneRegex.test(formData.mobileNumber)) {
          errors.mobileNumber = "Invalid format. Please use: XX-XXX-XXXX or XXX-XXX-XXX";
        }
      }

      // Validate length based on whether country code is present
      if (hasCountryCode && digitsOnly.length !== 10) {
        errors.mobileNumber = "Phone number must be 10 digits with country code";
      } else if (!hasCountryCode && digitsOnly.length !== 9 && digitsOnly.length !== 10) {
        errors.mobileNumber = "Phone number must be 9 or 10 digits without country code";
      }
    }

    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
  }

  if (currentStep === 2 || currentStep === -1) {
    // Validate social media entries only if they are provided
    if (formData.socialMedia && formData.socialMedia.length > 0) {
      formData.socialMedia.forEach((link: SocialMedia, index: number) => {
        // Only validate if either platform or URL is provided
        if (link.platform || link.url) {
          // If one field is provided, the other becomes required
          if (!link.platform && link.url) {
            errors[`socialMedia${index}Platform`] = "Platform is required when URL is provided";
          }
          if (link.platform && !link.url) {
            errors[`socialMedia${index}Url`] = "URL is required when platform is selected";
          }
          // If both are provided, validate the URL format
          if (link.platform && link.url && link.platform in platformPatterns) {
            const platformValidator = platformPatterns[link.platform as keyof PlatformPatterns];
            if (!platformValidator.pattern.test(link.url)) {
              errors[`socialMedia${index}Url`] = `Invalid URL format for ${link.platform}. Example: ${platformValidator.example}`;
            }
          }
        }
      });
    }
  }

  return errors;
};
