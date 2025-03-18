import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "./Combobox";

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

export default function SocialMediaForm({
  formData,
  handleSocialMediaChange,
  addSocialMediaLink,
  removeSocialMediaLink,
  errors,
}: Props) {
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
      
      // For WhatsApp, ensure the number is properly formatted
      if (platform === 'whatsapp') {
        const phoneNumber = cleanValue.replace(/\D/g, '');
        handleSocialMediaChange(index, "url", `https://wa.me/${phoneNumber}`);
      } else {
        handleSocialMediaChange(index, "url", `${selectedPlatform.baseUrl}${cleanValue}`);
      }
    } else {
      handleSocialMediaChange(index, "url", value);
    }
  };

  return (
    <div className="space-y-4">
      {formData.socialMedia.map((link, index) => {
        const selectedPlatform = platforms.find(p => p.value === link.platform);
        return (
          <div key={index} className="space-y-2">
            <div className="flex space-x-2">
              <Combobox
                value={link.platform}
                onChange={(value: string) =>
                  handleSocialMediaChange(index, "platform", value)
                }
              />

              <Input
                type="text"
                value={link.url.replace(selectedPlatform?.baseUrl || '', '')}
                onChange={(e) =>
                  handleUrlChange(index, e.target.value, link.platform)
                }
                placeholder={selectedPlatform?.placeholder || "Enter URL"}
                className="flex-1"
              />

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
