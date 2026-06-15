import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      {children}
    </section>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

const sizeClasses = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
};

export function Container({ children, className, size = "default" }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-6 md:px-10", sizeClasses[size], className)}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  dark?: boolean;
}

export function PageHeader({ eyebrow, title, description, className, dark = false }: PageHeaderProps) {
  return (
    <div className={cn("mb-12 space-y-5 md:mb-16", className)}>
      {eyebrow && <p className={dark ? "atelier-eyebrow" : "brand-eyebrow"}>{eyebrow}</p>}
      <h1
        className={cn(
          "font-serif text-4xl font-light tracking-wide md:text-5xl lg:text-6xl",
          dark ? "text-vault-cream-text" : "text-vault-ink",
        )}
      >
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-lg leading-relaxed",
            dark ? "text-vault-pearl/70" : "text-vault-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
