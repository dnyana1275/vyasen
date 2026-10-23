import { useState } from "react";
import { Check, ChevronDown, LogOut, Settings2, UserRound } from "lucide-react";
import type { SchoolRole } from "@school-sms/contracts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roleLabels: Record<SchoolRole, string> = {
  admin: "Administrator",
  principal: "Principal",
  teacher: "Teacher",
  student: "Student",
  hr: "HR",
};

interface ProfileMenuProps {
  role: SchoolRole;
  onRoleChange: (role: SchoolRole) => void;
}

export function ProfileMenu({
  role,
  onRoleChange,
  compact = false,
}: ProfileMenuProps & { compact?: boolean }) {
  const [profileName] = useState("Avery Kim");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center gap-2 rounded-xl p-1.5 text-left outline-none hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent ${compact ? "justify-center" : ""}`}
        aria-label="Open user profile menu"
      >
        <Avatar className="size-9">
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <span className={compact ? "sr-only" : "hidden min-w-0 sm:block"}>
          <span className="block text-sm font-semibold">{profileName}</span>
          <span className="block text-xs text-muted-foreground">
            {roleLabels[role]}
          </span>
        </span>
        {!compact && (
          <ChevronDown
            size={15}
            className="hidden text-muted-foreground sm:block"
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>
          <span className="block text-sm font-semibold text-foreground">
            {profileName}
          </span>
          <span className="mt-1 block font-normal">
            avery@greenwood.example
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Preview role</DropdownMenuLabel>
        {(Object.keys(roleLabels) as SchoolRole[]).map((nextRole) => (
          <DropdownMenuItem
            key={nextRole}
            onSelect={() => onRoleChange(nextRole)}
          >
            <UserRound size={15} />
            <span className="flex-1">{roleLabels[nextRole]}</span>
            {role === nextRole && <Check size={15} className="text-accent" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Settings2 size={15} />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <LogOut size={15} />
          Sign out
        </DropdownMenuItem>
        <p className="px-3 pb-2 pt-1 text-[11px] leading-relaxed text-muted-foreground">
          Role options are previews only. Access controls are not active yet.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
