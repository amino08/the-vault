import { editorialQuote } from "@/content/editorial";

/** Spacer between hero and first editorial content — house voice only */
export function HeroQuoteSpacer() {
  return (
    <section className="hero-quote-spacer" aria-label="House philosophy">
      <div className="hero-quote-spacer-rule" aria-hidden />
      <blockquote className="hero-quote-spacer-text">
        <p className="font-serif text-2xl font-light italic leading-relaxed text-vault-forest md:text-3xl lg:text-4xl">
          &ldquo;{editorialQuote.text}&rdquo;
        </p>
        {editorialQuote.attribution && (
          <footer className="mt-6 text-[10px] uppercase tracking-[0.24em] text-vault-muted-light">
            {editorialQuote.attribution}
          </footer>
        )}
      </blockquote>
      <div className="hero-quote-spacer-rule" aria-hidden />
    </section>
  );
}
