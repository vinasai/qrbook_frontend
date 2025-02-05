import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm({ formData, handleInputChange, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="font-geo text-2xl" htmlFor="mobileNumber">Mobile Number</Label>
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
        <Label className="font-geo text-2xl" htmlFor="email">Email</Label>
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
        <Label className="font-geo text-2xl" htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="A brief description about yourself"
        />
      </div>
    </div>
  );
}
