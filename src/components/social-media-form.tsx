import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "./Combobox";

export default function SocialMediaForm({
  formData,
  handleSocialMediaChange,
  addSocialMediaLink,
  removeSocialMediaLink,
  errors,
}) {
  return (
    <div className="space-y-4">
      {formData.socialMedia.map((link, index) => (
        <div key={index} className="flex space-x-2">
          <Combobox
            value={link.platform}
            onChange={(value) =>
              handleSocialMediaChange(index, "platform", value)
            }
          />

          <Input
            type="url"
            value={link.url}
            onChange={(e) =>
              handleSocialMediaChange(index, "url", e.target.value)
            }
            placeholder="https://example.com/username"
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
      ))}
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
