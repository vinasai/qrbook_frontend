import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faGlobe,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountryCodeSelector } from "./CountryCodeSelector";
import { useState, useEffect } from "react";

interface FormData {
  mobileNumber: string;
  email: string;
  website?: string;
  address?: string;
}

interface ContactFormProps {
  formData: FormData;
  handleInputChange: (e: { target: { name: string; value: string } }) => void;
  errors: {
    mobileNumber?: string;
    email?: string;
    website?: string;
    address?: string;
  };
}

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
    // Handle 8-digit numbers (e.g., 123-456-78)
    if (num.length === 8) {
      return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
    }
    // Handle 9-digit numbers (e.g., 123-456-789)
    if (num.length === 9) {
      return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
    }
    // Handle 10-digit numbers (e.g., 123-456-7890)
    if (num.length === 10) {
      return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
    }
    // Handle partial numbers
    if (num.length <= 3) return num;
    if (num.length <= 6) return `${num.slice(0, 3)}-${num.slice(3)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
  });

  return formatter(number);
};

// Get max length based on country code
const getMaxLength = (countryCode: string): number => {
  const code = countryCode.replace('+', '');
  const lengths: Record<string, number> = {
    '1': 10,  // US/Canada
    '94': 9,  // Sri Lanka
    '91': 10, // India
    '44': 11, // UK
  };
  return lengths[code] || 10; // Default to 10 if country not found
};

export default function ContactForm({ formData, handleInputChange, errors }: ContactFormProps) {
  const [countryCode, setCountryCode] = useState("+1");
  const [localNumber, setLocalNumber] = useState("");
  const [maxLength, setMaxLength] = useState(15); // Increased max length to be more flexible

  useEffect(() => {
    if (formData.mobileNumber) {
      const match = formData.mobileNumber.match(/^\+\d+\s*(.*)$/);
      if (match) {
        const [, number] = match;
        setLocalNumber(number);
        const codeMatch = formData.mobileNumber.match(/^\+\d+/);
        if (codeMatch) {
          const code = codeMatch[0];
          setCountryCode(code);
          setMaxLength(getMaxLength(code));
        }
      }
    }
  }, [formData.mobileNumber]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    const formatted = formatPhoneNumber(input, countryCode);
    setLocalNumber(formatted);
    
    const fullNumber = `${countryCode} ${formatted}`;
    handleInputChange({
      target: {
        name: "mobileNumber",
        value: fullNumber
      }
    });
  };

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
    setMaxLength(getMaxLength(code));
    const fullNumber = `${code} ${localNumber}`;
    handleInputChange({
      target: {
        name: "mobileNumber",
        value: fullNumber
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-sans text-md" htmlFor="mobileNumber">
          Mobile Number
        </Label>
        <div className="flex gap-2">
          <div className="w-[180px]">
            <CountryCodeSelector 
              value={countryCode} 
              onChange={handleCountryCodeChange}
            />
          </div>
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faPhone}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              id="mobileNumber"
              name="localNumber"
              value={localNumber}
              onChange={handlePhoneChange}
              className="pl-10"
              placeholder="Enter phone number"
              maxLength={maxLength}
            />
          </div>
        </div>
        {errors.mobileNumber && (
          <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>
        )}
      </div>

      <div>
        <Label className="font-sans text-md" htmlFor="email">
          Email
        </Label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="example@example.com"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <Label className="font-sans text-md" htmlFor="website">
          Website
        </Label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faGlobe}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="https://example.com"
          />
        </div>
        {errors.website && (
          <p className="text-sm text-red-500 mt-1">{errors.website}</p>
        )}
      </div>
      
      <div>
        <Label className="font-sans text-md" htmlFor="address">
          Address
        </Label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faLocationDot}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="123 Main St, City, Country"
          />
        </div>
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{errors.address}</p>
        )}
      </div>
    </div>
  );
}
