import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "./Combobox";
import { CountryCodeSelector } from "./CountryCodeSelector";
import { useState, useEffect } from "react";

interface Platform {
  value: string;
  label: string;
  urlPattern: RegExp;
  placeholder: string;
  baseUrl: string;
}

interface SocialMediaLink {
  platform: string;
  url: string;
}

interface FormData {
  socialMedia: SocialMediaLink[];
}

interface Props {
  formData: FormData;
  handleSocialMediaChange: (index: number, field: string, value: string) => void;
  addSocialMediaLink: () => void;
  removeSocialMediaLink: (index: number) => void;
  errors: { [key: string]: string };
}

const platforms: Platform[] = [
  {
    value: "tiktok",
    label: "TikTok",
    urlPattern: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/?$/,
    placeholder: "@username",
    baseUrl: "https://tiktok.com/@",
  },
  {
    value: "instagram",
    label: "Instagram",
    urlPattern: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/,
    placeholder: "@username",
    baseUrl: "https://instagram.com/",
  },
  {
    value: "youtube",
    label: "YouTube",
    urlPattern: /^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|@)?[\w.-]+\/?$/,
    placeholder: "@channel",
    baseUrl: "https://youtube.com/@",
  },
  {
    value: "facebook",
    label: "Facebook",
    urlPattern: /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+\/?$/,
    placeholder: "username or page-name",
    baseUrl: "https://facebook.com/",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    urlPattern: /^https?:\/\/(api\.)?whatsapp\.com\/(send\/)?\?phone=\d+$/,
    placeholder: "phone number",
    baseUrl: "https://wa.me/",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    urlPattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w.-]+\/?$/,
    placeholder: "profile-name",
    baseUrl: "https://linkedin.com/in/",
  },
  {
    value: "github",
    label: "GitHub",
    urlPattern: /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/?$/,
    placeholder: "username",
    baseUrl: "https://github.com/",
  },
];

// Phone number formatting function
const formatPhoneNumber = (value: string, countryCode: string) => {
  // Remove all non-digit characters
  const number = value.replace(/\D/g, "");
  
  // Get the country code without the + symbol
  const code = countryCode.replace('+', '');
  
  // Define country-specific formats
  const formats: Record<string, (num: string) => string> = {
    '1': (num) => { // US/Canada
      if (num.length <= 3) return num;
      if (num.length <= 6) return `${num.slice(0, 3)}-${num.slice(3)}`;
      return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
    },
    '94': (num) => { // Sri Lanka
      if (num.length <= 2) return num;
      if (num.length <= 5) return `${num.slice(0, 2)}-${num.slice(2)}`;
      return `${num.slice(0, 2)}-${num.slice(2, 5)}-${num.slice(5)}`;
    },
    '91': (num) => { // India
      if (num.length <= 5) return num;
      return `${num.slice(0, 5)}-${num.slice(5)}`;
    },
    '44': (num) => { // UK
      if (num.length <= 4) return num;
      if (num.length <= 7) return `${num.slice(0, 4)}-${num.slice(4)}`;
      return `${num.slice(0, 4)}-${num.slice(4, 7)}-${num.slice(7)}`;
    },
  };

  // Use country-specific format or default format
  const formatter = formats[code] || ((num) => {
    if (num.length <= 3) return num;
    if (num.length <= 6) return `${num.slice(0, 3)}-${num.slice(3)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
  });

  return formatter(number);
};

export default function SocialMediaForm({
  formData,
  handleSocialMediaChange,
  addSocialMediaLink,
  removeSocialMediaLink,
  errors,
}: Props) {
  const [whatsappCountryCodes, setWhatsappCountryCodes] = useState<Record<number, string>>({});
  const [whatsappLocalNumbers, setWhatsappLocalNumbers] = useState<Record<number, string>>({});

  const handleUrlChange = (index: number, value: string, platform: string) => {
    const selectedPlatform = platforms.find(p => p.value === platform);
    if (!selectedPlatform) {
      handleSocialMediaChange(index, "url", value);
      return;
    }

    // If input doesn't start with http(s)://, assume it's just the username/path
    if (!value.match(/^https?:\/\//)) {
      // Remove any @ symbol from the start of the input
      const cleanValue = value.replace(/^@/, '');
      
      // For WhatsApp, handle phone number formatting
      if (platform === 'whatsapp') {
        const countryCode = whatsappCountryCodes[index] || '+1';
        const formattedNumber = formatPhoneNumber(cleanValue, countryCode);
        setWhatsappLocalNumbers(prev => ({ ...prev, [index]: formattedNumber }));
        
        // Remove any non-digit characters for the WhatsApp URL
        const phoneNumber = formattedNumber.replace(/\D/g, '');
        handleSocialMediaChange(index, "url", `https://wa.me/${phoneNumber}`);
      } else {
        handleSocialMediaChange(index, "url", `${selectedPlatform.baseUrl}${cleanValue}`);
      }
    } else {
      handleSocialMediaChange(index, "url", value);
    }
  };

  const handleWhatsappCountryCodeChange = (index: number, code: string) => {
    setWhatsappCountryCodes(prev => ({ ...prev, [index]: code }));
    const localNumber = whatsappLocalNumbers[index] || '';
    const formattedNumber = formatPhoneNumber(localNumber, code);
    setWhatsappLocalNumbers(prev => ({ ...prev, [index]: formattedNumber }));
    
    // Update the URL with the new country code
    const phoneNumber = formattedNumber.replace(/\D/g, '');
    handleSocialMediaChange(index, "url", `https://wa.me/${phoneNumber}`);
  };

  return (
    <div className="space-y-4">
      {formData.socialMedia.map((link, index) => {
        const selectedPlatform = platforms.find(p => p.value === link.platform);
        const isWhatsapp = link.platform === 'whatsapp';
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex space-x-2">
              <Combobox
                value={link.platform}
                onChange={(value: string) =>
                  handleSocialMediaChange(index, "platform", value)
                }
              />

              {isWhatsapp ? (
                <div className="flex gap-2 flex-1">
                  <div className="w-[180px]">
                    <CountryCodeSelector 
                      value={whatsappCountryCodes[index] || '+1'} 
                      onChange={(code) => handleWhatsappCountryCodeChange(index, code)}
                    />
                  </div>
                  <Input
                    type="text"
                    value={whatsappLocalNumbers[index] || ''}
                    onChange={(e) => handleUrlChange(index, e.target.value, link.platform)}
                    placeholder="Enter phone number"
                    className="flex-1"
                  />
                </div>
              ) : (
                <Input
                  type="text"
                  value={link.url.replace(selectedPlatform?.baseUrl || '', '')}
                  onChange={(e) =>
                    handleUrlChange(index, e.target.value, link.platform)
                  }
                  placeholder={selectedPlatform?.placeholder || "Enter URL"}
                  className="flex-1"
                />
              )}

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeSocialMediaLink(index)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
            {errors[`socialMedia${index}Url`] && (
              <p className="text-sm text-red-500 mt-1">
                {errors[`socialMedia${index}Url`]}
              </p>
            )}
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        onClick={addSocialMediaLink}
        className="w-full font-sans text-lg"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2 " />
        Add Social Media Link
      </Button>
    </div>
  );
}
