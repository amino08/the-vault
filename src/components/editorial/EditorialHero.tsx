import Link from "next/link";
import { Container } from "@/components/layout/section";
import { routes } from "@/config/routes";
import { editorialHero } from "@/content/editorial";
import { HeroBackgroundVideo } from "@/components/editorial/HeroBackgroundVideo";
import { HeroConfiguratorShowcase } from "@/components/editorial/HeroConfiguratorShowcase";

export function EditorialHero() {
  const headlineLines = editorialHero.headline.split("\n");

  return (
    <section className="hero-with-video relative overflow-hidden pb-10 pt-16 md:pb-14 md:pt-20">
      <HeroBackgroundVideo />
      <div className="hero-video-overlay" aria-hidden />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="hero-copy-panel order-2 lg:order-1">
            <p className="brand-eyebrow">{editorialHero.eyebrow}</p>
            <h1 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-wide text-balance text-vault-ink sm:text-5xl md:text-6xl xl:text-[4.25rem]">
              {headlineLines.map((line, i) => (
                <span key={line} className={i > 0 ? "block text-vault-forest" : "block"}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-vault-muted">
              {editorialHero.subheadline}
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-vault-muted-light">
              {editorialHero.supportCopy}
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
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
