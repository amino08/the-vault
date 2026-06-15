import Link from "next/link";
import { routes, marketingNav } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-vault-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div className="space-y-4">
          <p className="font-serif text-xl text-vault-ivory">{siteConfig.shortName}</p>
          <p className="text-sm text-vault-pearl/60">{siteConfig.tagline}</p>
        </div>

        <nav className="flex flex-col gap-3">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-vault-pearl/60 hover:text-vault-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm text-vault-pearl/60">
          <Link href={routes.privacy} className="hover:text-vault-gold">
            Privacy Policy
          </Link>
          <Link href={routes.terms} className="hover:text-vault-gold">
            Terms of Service
          </Link>
          <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-vault-gold">
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 py-6 text-center text-xs text-vault-pearl/40 md:px-10">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
