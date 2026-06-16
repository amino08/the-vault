import Link from "next/link";
import { Container } from "@/components/layout/section";
import { routes } from "@/config/routes";
import { editorialHero } from "@/content/editorial";
import { HeroConfiguratorShowcase } from "@/components/editorial/HeroConfiguratorShowcase";

export function EditorialHero() {
  return (
    <section className="hero-editorial relative overflow-hidden pb-12 pt-16 md:pb-16 md:pt-20 lg:pb-20">
      <div className="absolute inset-0 bg-brand-radial-light" aria-hidden />

      <Container className="relative" size="wide">
        <div className="hero-editorial-grid">
          <div className="hero-editorial-showcase">
            <HeroConfiguratorShowcase />
          </div>

          <div className="hero-editorial-copy">
            <h1 className="hero-headline">{editorialHero.headline}</h1>
            <p className="hero-secondary">{editorialHero.secondary}</p>
            <p className="hero-caption">{editorialHero.caption}</p>
            <div className="hero-cta-wrap">
              <Link href={routes.create} className="hero-cta hero-cta-primary">
                {editorialHero.cta}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
