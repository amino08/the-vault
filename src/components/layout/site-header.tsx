import Link from "next/link";
import { routes, marketingNav } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-vault-forest/10 bg-vault-ivory/95 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href={routes.home} className="group">
          <span className="block font-serif text-lg tracking-wide text-vault-forest">
            {siteConfig.shortName}
          </span>
          <span className="block text-[10px] uppercase tracking-luxury text-vault-gold">
            by Enter Aevum
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-luxury text-vault-muted transition-colors hover:text-vault-forest"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href={routes.account}>Portal</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={routes.create}>Begin Commission</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
