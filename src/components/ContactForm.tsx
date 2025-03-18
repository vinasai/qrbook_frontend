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
const formatPhoneNumber = (value: string) => {
  // Remove all non-digit characters
  const number = value.replace(/\D/g, "");
  
  // Format based on length
  if (number.length <= 2) return number;
  if (number.length <= 5) return `${number.slice(0, 2)}-${number.slice(2)}`;
  return `${number.slice(0, 2)}-${number.slice(2, 5)}-${number.slice(5, 9)}`;
};

export default function ContactForm({ formData, handleInputChange, errors }: ContactFormProps) {
  const [countryCode, setCountryCode] = useState("+1");
  const [localNumber, setLocalNumber] = useState("");

  useEffect(() => {
    if (formData.mobileNumber) {
      const match = formData.mobileNumber.match(/^\+\d+\s*(.*)$/);
      if (match) {
        const [, number] = match;
        setLocalNumber(number);
        const codeMatch = formData.mobileNumber.match(/^\+\d+/);
        if (codeMatch) {
          setCountryCode(codeMatch[0]);
        }
      }
    }
  }, [formData.mobileNumber]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    const formatted = formatPhoneNumber(input);
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
              placeholder="12-345-6789"
              maxLength={12}
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
