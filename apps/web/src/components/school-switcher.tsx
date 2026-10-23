import { Check, ChevronsUpDown, Plus, School } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const schools = ["Greenwood Academy", "Cedar Grove School"];

export function SchoolSwitcher() {
  const [selectedSchool, setSelectedSchool] = useState(schools[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto max-w-64 justify-start gap-3 px-2 py-1.5 text-left"
          aria-label={`Switch school. Current school: ${selectedSchool}`}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
            <School size={18} />
          </span>
          <span className="hidden min-w-0 flex-1 sm:block">
            <span className="block truncate text-sm font-semibold">
              {selectedSchool}
            </span>
            <span className="block text-xs text-muted-foreground">
              School workspace
            </span>
          </span>
          <ChevronsUpDown
            size={15}
            className="hidden text-muted-foreground sm:block"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Your schools</DropdownMenuLabel>
        {schools.map((school) => (
          <DropdownMenuItem
            key={school}
            onSelect={() => setSelectedSchool(school)}
          >
            <School size={16} className="text-muted-foreground" />
            <span className="flex-1">{school}</span>
            {selectedSchool === school && (
              <Check size={15} className="text-accent" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Plus size={16} />
          Add or join a school
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
