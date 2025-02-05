import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const platforms = [
  { value: "tiktok", label: "TikTok", icon: "faTiktok" },
  { value: "instagram", label: "Instagram", icon: "faInstagram" },
  { value: "youtube", label: "YouTube", icon: "faYoutube" },
  { value: "facebook", label: "Facebook", icon: "faFacebook" },
  { value: "whatsapp", label: "WhatsApp", icon: "faWhatsapp" },
  { value: "linkedin", label: "LinkedIn", icon: "faLinkedin" },
  { value: "github", label: "GitHub", icon: "faGithub" },
]

export function Combobox({ value, onChange }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? (
            <>
              <FontAwesomeIcon icon={platforms.find((platform) => platform.value === value)?.icon} className="mr-2" />
              {platforms.find((platform) => platform.value === value)?.label}
            </>
          ) : (
            "Select platform..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search platform..." />
          <CommandList>
            <CommandEmpty>No platform found.</CommandEmpty>
            <CommandGroup>
              {platforms.map((platform) => (
                <CommandItem
                  key={platform.value}
                  value={platform.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === platform.value ? "opacity-100" : "opacity-0")} />
                  <FontAwesomeIcon icon={platform.icon} className="mr-2" />
                  {platform.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

