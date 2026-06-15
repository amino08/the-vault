import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-sm border border-vault-forest/15 bg-vault-ivory px-4 py-2 text-sm text-vault-ink placeholder:text-vault-muted-light focus-visible:border-vault-gold/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-vault-gold/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
