"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const countryCodes = [
  { value: "+1", label: "United States (+1)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+91", label: "India (+91)" },
  { value: "+86", label: "China (+86)" },
  { value: "+81", label: "Japan (+81)" },
  { value: "+49", label: "Germany (+49)" },
  { value: "+33", label: "France (+33)" },
  { value: "+39", label: "Italy (+39)" },
  { value: "+7", label: "Russia (+7)" },
  { value: "+55", label: "Brazil (+55)" },
  { value: "+52", label: "Mexico (+52)" },
  { value: "+34", label: "Spain (+34)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+1", label: "Canada (+1)" },
  { value: "+82", label: "South Korea (+82)" },
  { value: "+31", label: "Netherlands (+31)" },
  { value: "+90", label: "Turkey (+90)" },
  { value: "+966", label: "Saudi Arabia (+966)" },
  { value: "+27", label: "South Africa (+27)" },
  { value: "+41", label: "Switzerland (+41)" },
  { value: "+46", label: "Sweden (+46)" },
  { value: "+47", label: "Norway (+47)" },
  { value: "+45", label: "Denmark (+45)" },
  { value: "+358", label: "Finland (+358)" },
  { value: "+48", label: "Poland (+48)" },
  { value: "+43", label: "Austria (+43)" },
  { value: "+32", label: "Belgium (+32)" },
  { value: "+351", label: "Portugal (+351)" },
  { value: "+30", label: "Greece (+30)" },
  { value: "+353", label: "Ireland (+353)" },
  { value: "+64", label: "New Zealand (+64)" },
  { value: "+65", label: "Singapore (+65)" },
  { value: "+60", label: "Malaysia (+60)" },
  { value: "+66", label: "Thailand (+66)" },
  { value: "+62", label: "Indonesia (+62)" },
  { value: "+84", label: "Vietnam (+84)" },
  { value: "+63", label: "Philippines (+63)" },
  { value: "+92", label: "Pakistan (+92)" },
  { value: "+880", label: "Bangladesh (+880)" },
  { value: "+94", label: "Sri Lanka (+94)" },
  { value: "+977", label: "Nepal (+977)" },
  { value: "+20", label: "Egypt (+20)" },
  { value: "+212", label: "Morocco (+212)" },
  { value: "+971", label: "United Arab Emirates (+971)" },
  { value: "+972", label: "Israel (+972)" },
  { value: "+98", label: "Iran (+98)" },
  { value: "+964", label: "Iraq (+964)" },
  { value: "+36", label: "Hungary (+36)" },
  { value: "+420", label: "Czech Republic (+420)" },
  { value: "+421", label: "Slovakia (+421)" },
  { value: "+40", label: "Romania (+40)" },
  { value: "+359", label: "Bulgaria (+359)" },
  { value: "+380", label: "Ukraine (+380)" },
  { value: "+375", label: "Belarus (+375)" },
  { value: "+370", label: "Lithuania (+370)" },
  { value: "+371", label: "Latvia (+371)" },
  { value: "+372", label: "Estonia (+372)" },
  { value: "+373", label: "Moldova (+373)" },
  { value: "+381", label: "Serbia (+381)" },
  { value: "+385", label: "Croatia (+385)" },
  { value: "+386", label: "Slovenia (+386)" },
  { value: "+387", label: "Bosnia and Herzegovina (+387)" },
  { value: "+389", label: "North Macedonia (+389)" },
  { value: "+355", label: "Albania (+355)" },
  { value: "+382", label: "Montenegro (+382)" },
  { value: "+383", label: "Kosovo (+383)" },
  { value: "+356", label: "Malta (+356)" },
  { value: "+357", label: "Cyprus (+357)" },
  { value: "+354", label: "Iceland (+354)" },
  { value: "+352", label: "Luxembourg (+352)" },
  { value: "+377", label: "Monaco (+377)" },
  { value: "+423", label: "Liechtenstein (+423)" },
  { value: "+376", label: "Andorra (+376)" },
  { value: "+378", label: "San Marino (+378)" },
  { value: "+379", label: "Vatican City (+379)" },
]

export function CountryCodeSelector({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const selectedCountry = countryCodes.find(code => code.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${!value ? "text-muted-foreground" : ""}`}
        >
          {selectedCountry ? selectedCountry.label : "Select country code"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country code..." />
          <CommandList>
            <CommandEmpty>No country code found.</CommandEmpty>
            <CommandGroup>
              {countryCodes.map((code) => (
                <CommandItem
                  key={code.value}
                  onSelect={() => {
                    onChange(code.value === value ? "" : code.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === code.value ? "opacity-100" : "opacity-0")} />
                  {code.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

