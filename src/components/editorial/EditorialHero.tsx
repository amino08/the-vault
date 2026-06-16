import Link from "next/link";
import { Container } from "@/components/layout/section";
import { routes } from "@/config/routes";
import { editorialHero } from "@/content/editorial";
import { HeroConfiguratorShowcase } from "@/components/editorial/HeroConfiguratorShowcase";

export function EditorialHero() {
  const headlineLines = editorialHero.headline.split("\n");

  return (
    <section className="hero-editorial relative overflow-hidden pb-12 pt-16 md:pb-16 md:pt-20 lg:pb-20">
      <div className="absolute inset-0 bg-brand-radial-light" aria-hidden />

      <Container className="relative" size="wide">
        <div className="hero-editorial-grid">
          <div className="hero-editorial-showcase">
            <HeroConfiguratorShowcase />
          </div>

          <div className="hero-editorial-copy">
            <h1 className="font-serif text-4xl font-light leading-[1.08] tracking-wide text-balance text-vault-ink sm:text-5xl lg:text-[3.5rem] xl:text-6xl">
              {headlineLines.map((line, i) => (
                <span key={line} className={i > 0 ? "block text-vault-forest" : "block"}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-vault-muted lg:text-lg">
              {editorialHero.subheadline}
            </p>
            <div className="mt-10">
              <Link href={routes.create} className="hero-cta hero-cta-primary">
                Begin Commission
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
