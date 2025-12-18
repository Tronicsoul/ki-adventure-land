import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-display",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-button hover:scale-105 hover:-translate-y-1 active:scale-95 rounded-full",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-full",
        outline:
          "border-2 border-primary bg-background text-primary shadow-sm hover:bg-primary hover:text-primary-foreground rounded-full",
        secondary:
          "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80 rounded-full",
        ghost:
          "hover:bg-accent hover:text-accent-foreground rounded-2xl",
        link:
          "text-primary underline-offset-4 hover:underline",
        playful:
          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-button hover:scale-105 hover:-translate-y-1 active:scale-95 rounded-full",
        accent:
          "bg-accent text-accent-foreground shadow-soft hover:scale-105 hover:-translate-y-1 active:scale-95 rounded-full",
        dino:
          "bg-dino text-dino-foreground shadow-soft hover:scale-105 hover:-translate-y-1 active:scale-95 rounded-full",
        chocolate:
          "bg-chocolate text-chocolate-foreground shadow-soft hover:scale-105 hover:-translate-y-1 active:scale-95 rounded-full",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-14 rounded-full px-8 text-lg",
        xl: "h-16 rounded-full px-10 text-xl",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
