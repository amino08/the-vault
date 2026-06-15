import Link from "next/link";
import { routes, marketingNav } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-vault-forest/20 bg-vault-forest-deep text-vault-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div className="space-y-4">
          <p className="font-serif text-xl text-vault-cream">{siteConfig.shortName}</p>
          <p className="text-sm text-vault-pearl/80">{siteConfig.tagline}</p>
          <p className="text-[10px] uppercase tracking-luxury text-vault-gold/90">
            A commission division of Enter Aevum
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-vault-pearl/75 transition-colors hover:text-vault-gold-light"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm text-vault-pearl/75">
          <Link href={routes.privacy} className="transition-colors hover:text-vault-gold-light">
            Privacy Policy
          </Link>
          <Link href={routes.terms} className="transition-colors hover:text-vault-gold-light">
            Terms of Service
          </Link>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="transition-colors hover:text-vault-gold-light"
          >
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>

      <div className="border-t border-vault-forest/30 px-6 py-6 text-center text-xs text-vault-pearl/50 md:px-10">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
