import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 md:py-32", className)}>
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
}

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-16 space-y-4", className)}>
      {eyebrow && <p className="brand-eyebrow">{eyebrow}</p>}
      <h1 className="font-serif text-4xl font-light tracking-wide text-vault-ivory md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-lg text-vault-pearl/70">{description}</p>
      )}
    </div>
  );
}
