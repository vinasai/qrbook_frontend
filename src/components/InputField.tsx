import React, { forwardRef } from "react";
import {
  User as UserIcon,
  AtSign,
  Briefcase,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

const InputField = forwardRef(
  (
    {
      label,
      name,
      icon: Icon,
      error,
      type = "text",
      placeholder,
      ...props
    }: {
      label: string;
      name: string;
      icon: React.ElementType;
      error?: string;
      type?: string;
      placeholder?: string;
      [key: string]: any;
    },
    ref
  ) => (
    <div className="group relative transition-all duration-300 hover:scale-[1.02]">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        <Icon className="w-4 h-4 mr-2 text-blue-600" />
        {label}
      </label>
      <input
        type={type}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-blue-200"
        } focus:outline-none focus:ring-4 transition-all duration-300`}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 absolute -bottom-6">{error}</p>
      )}
    </div>
  )
);

export default InputField;
