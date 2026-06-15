import Link from "next/link";
import { Container } from "@/components/layout/section";
import { routes } from "@/config/routes";
import { editorialHero } from "@/content/editorial";
import { HeroConfiguratorShowcase } from "@/components/editorial/HeroConfiguratorShowcase";

export function EditorialHero() {
  const headlineLines = editorialHero.headline.split("\n");

  return (
    <section className="hero-editorial relative overflow-hidden pb-10 pt-16 md:pb-14 md:pt-20">
      <div className="absolute inset-0 bg-brand-radial-light" aria-hidden />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="order-2 space-y-7 py-4 lg:order-1 lg:py-12 xl:py-16">
            <p className="brand-eyebrow">{editorialHero.eyebrow}</p>
            <h1 className="font-serif text-4xl font-light leading-[1.1] tracking-wide text-balance text-vault-ink sm:text-5xl md:text-6xl xl:text-[4.25rem]">
              {headlineLines.map((line, i) => (
                <span key={line} className={i > 0 ? "block text-vault-forest" : "block"}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-vault-muted">
              {editorialHero.subheadline}
            </p>
            <p className="max-w-lg text-sm leading-relaxed text-vault-muted-light">
              {editorialHero.supportCopy}
            </p>
            <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
              <Link href={routes.create} className="hero-cta hero-cta-primary">
                Begin Commission
              </Link>
              <Link href={routes.process} className="hero-cta hero-cta-secondary">
                Explore The Process
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <HeroConfiguratorShowcase />
          </div>
        </div>
      </Container>
    </section>
  );
}
