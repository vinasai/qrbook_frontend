"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CountryCode {
  value: string;
  label: string;
}

interface CountryData {
  name: {
    common: string;
  };
  idd: {
    root: string;
    suffixes?: string[];
  };
}

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CountryCodeSelector({ value, onChange }: CountryCodeSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [countryCodes, setCountryCodes] = React.useState<CountryCode[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd');
        const data: CountryData[] = await response.json();
        
        const formattedCountryCodes = data
          .filter((country) => country.idd.root)
          .map((country) => {
            const code = country.idd.root + (country.idd.suffixes?.[0] || '');
            return {
              value: code,
              label: `${country.name.common} (${code})`
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        
        setCountryCodes(formattedCountryCodes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching country codes:', error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const selectedCountry = countryCodes.find((code) => code.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${!value ? "text-muted-foreground" : ""}`}
        >
          {loading ? "Loading..." : selectedCountry ? selectedCountry.label : "Select country code"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country code..." />
          <CommandList>
            <CommandEmpty>No country code found.</CommandEmpty>
            <CommandGroup>
              {loading ? (
                <CommandItem>Loading country codes...</CommandItem>
              ) : (
                countryCodes.map((code) => (
                  <CommandItem
                    key={code.value}
                    onSelect={() => {
                      onChange(code.value === value ? "" : code.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === code.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {code.label}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
