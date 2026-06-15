import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-vault-cream disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-vault-gold text-vault-forest-deep shadow-[0_4px_20px_-6px_rgba(184,152,90,0.5)] hover:bg-vault-gold-light hover:shadow-[0_6px_24px_-4px_rgba(184,152,90,0.55)]",
        secondary:
          "bg-vault-forest text-vault-cream shadow-[0_2px_12px_-4px_rgba(27,61,50,0.35)] hover:bg-vault-forest-light",
        outline:
          "border border-vault-forest/25 bg-vault-ivory text-vault-forest hover:border-vault-forest hover:bg-vault-forest hover:text-vault-cream",
        ghost:
          "text-vault-forest hover:bg-vault-forest/8 hover:text-vault-forest-deep",
        link: "text-vault-gold underline-offset-4 hover:text-vault-gold-light hover:underline",
        atelierOutline:
          "border border-vault-gold-brush/35 bg-transparent text-vault-cream-text hover:border-vault-gold-brush hover:bg-vault-gold-brush/10",
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-10 text-sm tracking-luxury uppercase",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
