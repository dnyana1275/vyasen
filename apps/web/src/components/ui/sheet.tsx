import * as Dialog from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  children,
  className,
  ...props
}: ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(19rem,calc(100vw-2rem))] flex-col border-r border-border bg-background p-4 shadow-2xl outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close
          aria-label="Close navigation"
          className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <span aria-hidden="true">×</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
