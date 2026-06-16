import Link from "next/link";
import { Container } from "@/components/layout/section";
import { routes } from "@/config/routes";
import { editorialHero } from "@/content/editorial";
import { HeroConfiguratorShowcase } from "@/components/editorial/HeroConfiguratorShowcase";

export function EditorialHero() {
  return (
    <section className="hero-editorial relative overflow-hidden pb-14 pt-12 md:pb-20 md:pt-16 lg:pb-24">
      <div className="absolute inset-0 bg-brand-radial-light" aria-hidden />

      <Container className="relative" size="wide">
        <div className="hero-editorial-stack">
          <div className="hero-editorial-intro">
            <h1 className="hero-headline">{editorialHero.headline}</h1>
            <p className="hero-secondary">{editorialHero.secondary}</p>
            <p className="hero-caption">{editorialHero.caption}</p>
            <div className="hero-cta-wrap">
              <Link href={routes.create} className="hero-cta hero-cta-primary">
                {editorialHero.cta}
              </Link>
            </div>
          </div>

          <div className="hero-editorial-showcase">
            <HeroConfiguratorShowcase />
          </div>
        </div>
      </Container>
    </section>
  );
}
