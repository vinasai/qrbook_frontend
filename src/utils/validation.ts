export const validateForm = (formData, currentStep = -1) => {
  const errors = {};

  if (currentStep === 0 || currentStep === -1) {
    if (!formData.name) errors.name = "Name is required";
    if (!formData.jobPosition) errors.jobPosition = "Job position is required";
  }

  if (currentStep === 1 || currentStep === -1) {
    // Mobile number validation (now includes combined validation)
    if (!formData.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    } else {
      const phoneRegex = /^\+\d{1,4}\d{6,14}$/; // Validates international format
      if (!phoneRegex.test(formData.mobileNumber)) {
        errors.mobileNumber = "Invalid mobile number format";
      }
    }
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
  }

  if (currentStep === 2 || currentStep === -1) {
    if (formData.socialMedia.length === 0) {
      errors.socialMedia = "At least one social media link is required";
    } else {
      formData.socialMedia.forEach((link, index) => {
      if (!link.platform)
        errors[`socialMedia${index}Platform`] = "Platform is required";
      if (!link.url) errors[`socialMedia${index}Url`] = "URL is required";
      else if (!/^(https?:\/\/)?\S+/.test(link.url))
        errors[`socialMedia${index}Url`] = "Invalid URL format";
      });
    }
  }

  return errors;
};
