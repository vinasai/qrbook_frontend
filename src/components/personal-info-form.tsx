import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faAt,
  faBriefcase,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from 'next/dynamic';

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function PersonalInfoForm({
  formData,
  handleInputChange,
  handleFileChange,
  errors,
}) {
  // Handler for the rich text editor changes
  const handleEditorChange = (content) => {
    // Simulate an event object to work with existing handleInputChange
    const event = {
      target: {
        name: 'description',
        value: content
      }
    };
    handleInputChange(event);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-sans text-md" htmlFor="name">
          Full Name
        </Label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faUser}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />

          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="John Doe"
          />
        </div>
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <Label className="font-sans text-md" htmlFor="pronouns">
          Pronouns
        </Label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faAt}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />

          <Input
            id="pronouns"
            name="pronouns"
            value={formData.pronouns}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="They/Them"
          />
        </div>
        {errors.pronouns && (
          <p className="text-sm text-red-500 mt-1">{errors.pronouns}</p>
        )}
      </div>
      <div>
        <Label className="font-sans text-md" htmlFor="jobPosition">
          Job Position
        </Label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faBriefcase}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />

          <Input
            id="jobPosition"
            name="jobPosition"
            value={formData.jobPosition}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="Software Engineer"
          />
        </div>
        {errors.jobPosition && (
          <p className="text-sm text-red-500 mt-1">{errors.jobPosition}</p>
        )}
      </div>
      
      {/* Description field with rich text editor */}
      <div>
        <Label className="font-sans text-md" htmlFor="description">
          About
        </Label>
        <ReactQuill
          id="description"
          value={formData.description || ''}
          onChange={handleEditorChange}
          theme="snow"
          placeholder="A brief description about yourself"
          className="mt-1"
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>
      

      <div>
        <Label className="font-sans text-md" htmlFor="profileImage">
          Profile Image
        </Label>
        <div className="flex items-center space-x-4">
          {formData.profileImage && (
            <img
              src={
                typeof formData.profileImage === "string"
                  ? formData.profileImage
                  : URL.createObjectURL(formData.profileImage)
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <Input
            className="font-sans"
            id="profileImage"
            name="profileImage"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        {errors.profileImage && (
          <p className="text-sm text-red-500 mt-1">{errors.profileImage}</p>
        )}
      </div>
    </div>
  );
}
