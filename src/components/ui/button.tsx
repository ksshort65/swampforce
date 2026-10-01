import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-center font-display font-semibold tracking-wide uppercase transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
  {
    variants: {
      variant: {
        default: "bg-sage text-sage-fg hover:bg-fg",
        outline: "border border-border-strong text-fg hover:bg-fg/10",
        ghost: "text-fg hover:bg-fg/10",
        paper: "bg-ink text-paper hover:bg-bg",
      },
      size: {
        default: "min-h-11 h-auto px-5 py-2 text-sm",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
