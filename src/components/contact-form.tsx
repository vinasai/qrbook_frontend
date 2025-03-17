import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faGlobe,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactForm({ formData, handleInputChange, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="font-sans text-md" htmlFor="mobileNumber">
          Mobile Number
        </Label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faPhone}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />

          <Input
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="+1234567890"
          />
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
