import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-sm border border-vault-forest/20 bg-vault-smoke px-4 py-2 text-sm text-vault-ivory placeholder:text-vault-pearl/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-vault-gold focus-visible:border-vault-gold/30 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
