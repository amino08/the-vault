import { editorialQuote } from "@/content/editorial";

/** Editorial manifesto — transition from creation to meaning */
export function HeroQuoteSpacer() {
  return (
    <section className="hero-quote-manifesto" aria-label="House philosophy">
      <div className="hero-quote-manifesto-inner">
        <div className="hero-quote-emblem" aria-hidden>
          <span className="hero-quote-emblem-line" />
          <span className="hero-quote-emblem-mark" />
          <span className="hero-quote-emblem-line" />
        </div>

        <blockquote className="hero-quote-manifesto-text">
          <p className="hero-quote-lines">
            {editorialQuote.lines.map((line) => (
              <span key={line} className="hero-quote-line">
                {line}
              </span>
            ))}
          </p>
          {editorialQuote.attribution && (
            <footer className="hero-quote-attribution">{editorialQuote.attribution}</footer>
          )}
        </blockquote>
      </div>
    </section>
  );
}
