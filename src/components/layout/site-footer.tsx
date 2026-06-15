import Link from "next/link";
import { routes, marketingNav } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-vault-forest/25 bg-vault-forest-deep">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div className="space-y-4">
          <p className="font-serif text-xl text-vault-cream">{siteConfig.shortName}</p>
          <p className="text-sm text-vault-pearl/65">{siteConfig.tagline}</p>
          <p className="text-[10px] uppercase tracking-luxury text-vault-gold/70">
            A commission division of Enter Aevum
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-vault-pearl/65 transition-colors hover:text-vault-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm text-vault-pearl/65">
          <Link href={routes.privacy} className="transition-colors hover:text-vault-gold">
            Privacy Policy
          </Link>
          <Link href={routes.terms} className="transition-colors hover:text-vault-gold">
            Terms of Service
          </Link>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="transition-colors hover:text-vault-gold"
          >
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>

      <div className="border-t border-vault-forest/20 px-6 py-6 text-center text-xs text-vault-pearl/45 md:px-10">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
