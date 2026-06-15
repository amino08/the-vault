import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-vault-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-vault-gold text-vault-forest-deep shadow-[0_4px_24px_-6px_rgba(201,169,98,0.45)] hover:bg-vault-gold-light hover:shadow-[0_6px_28px_-4px_rgba(201,169,98,0.5)]",
        outline:
          "border border-vault-gold/45 bg-vault-forest/10 text-vault-cream hover:border-vault-gold hover:bg-vault-forest/20 hover:text-vault-gold-light",
        ghost:
          "text-vault-pearl hover:bg-vault-forest/15 hover:text-vault-gold",
        link: "text-vault-gold underline-offset-4 hover:text-vault-gold-light hover:underline",
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-10 text-base tracking-luxury uppercase",
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
