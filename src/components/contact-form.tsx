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

// Phone number formatting function
const formatPhoneNumber = (value: string) => {
  // Remove all non-digit characters
  const number = value.replace(/\D/g, "");
  
  // Format based on length
  if (number.length <= 3) return number;
  if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
  return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 10)}`;
};

export default function ContactForm({ formData, handleInputChange, errors }) {
  const [countryCode, setCountryCode] = useState(formData.countryCode || "+1");
  const [localNumber, setLocalNumber] = useState("");

  useEffect(() => {
    // Extract local number from full mobile number on component mount
    if (formData.mobileNumber) {
      const match = formData.mobileNumber.match(/^\+\d+\s*(.*)$/);
      if (match) {
        setLocalNumber(match[1]);
      }
    }
  }, []);

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digits
    const formatted = formatPhoneNumber(input);
    setLocalNumber(formatted);
    
    // Combine country code and local number for the full mobile number
    const fullNumber = `${countryCode} ${formatted}`;
    handleInputChange({
      target: {
        name: "mobileNumber",
        value: fullNumber
      }
    });
  };

  const handleCountryCodeChange = (code) => {
    setCountryCode(code);
    // Update full number when country code changes
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
              placeholder="123-456-7890"
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
      
      {/* Address field */}
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
