import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full bg-surface px-3 text-base text-fg outline outline-border placeholder:text-muted",
        "focus-visible:outline-2 focus-visible:outline-sage",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full bg-surface px-3 py-3 text-base text-fg outline outline-border placeholder:text-muted",
        "focus-visible:outline-2 focus-visible:outline-sage",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "font-display text-xs font-semibold uppercase tracking-[0.16em] text-muted",
        className,
      )}
      {...props}
    />
  );
}
