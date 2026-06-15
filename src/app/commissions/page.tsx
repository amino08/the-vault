import Link from "next/link";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Container, PageHeader, Section } from "@/components/layout/section";

const storyCommissions = [
  {
    title: "Transformation",
    body: "Weight lost, identity claimed, a chapter closed. Pieces that mark who you became — not who you were asked to be.",
  },
  {
    title: "Anniversary & relationship",
    body: "Wedding bands, vow renewals, and private symbols between two people. Designed around shared history, not a display case.",
  },
  {
    title: "Legacy & family",
    body: "Heirloom redesigns, crest work, and generational gifts. Jewelry that outlasts the moment it commemorates.",
  },
  {
    title: "Achievement & milestone",
    body: "Business exits, championships, degrees, and personal thresholds. Commissions that reward discipline with permanence.",
  },
  {
    title: "Symbolic creation",
    body: "When the meaning is precise but the form is not yet defined. We help you find the right visual language.",
  },
] as const;

const pieceCategories = [
  {
    title: "Rings",
    body: "Engagement, signet, stackable, and statement rings — configured in our live atelier with metal, stone, and setting control.",
  },
  {
    title: "Pendants",
    body: "Personal talismans and family markers. Scale, bail, and chain weight are resolved in design review.",
  },
  {
    title: "Bracelets",
    body: "Cuffs, links, and tennis-style layouts. Built for daily wear with proportion matched to the wrist.",
  },
  {
    title: "Necklaces & chains",
    body: "From fine chains to graduated necklaces. Length, clasp, and link character are specified with the piece — not picked from a shelf.",
  },
  {
    title: "Custom concepts",
    body: "If the idea does not fit a category, it belongs here. We take on one-of-a-kind commissions with a clear story and a realistic timeline.",
  },
] as const;

const beginSteps = [
  {
    label: "Share the story",
    detail: "Tell us what the piece needs to hold — milestone, relationship, transformation, or legacy.",
  },
  {
    label: "Design in the atelier",
    detail: "Configure materials and form in our ring builder, or describe a custom concept for a private quote.",
  },
  {
    label: "Review & commission",
    detail: "Save a draft, refine with our team, and begin your commission when the direction is right.",
  },
] as const;

function EditorialRule() {
  return (
    <div className="py-2" aria-hidden>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-vault-gold/20 to-transparent" />
    </div>
  );
}

export default function CommissionsPage() {
  return (
    <>
      <Section className="pb-12 md:pb-16">
        <Container size="narrow">
          <PageHeader
            className="mb-8 md:mb-12"
            eyebrow="Commissions"
            title="What we take on"
            description="Private work for clients who want one piece — made once — for a reason that matters."
          />
          <p className="font-serif text-2xl font-light leading-snug text-vault-ivory md:text-3xl">
            Every commission begins with a story.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-vault-pearl/65">
            We translate the meaning behind the piece before we design the form. If you can name
            why it needs to exist, we can help you shape what it becomes.
          </p>
        </Container>
      </Section>

      <Section className="border-t border-white/[0.04] bg-vault-charcoal/20 py-16 md:py-24">
        <Container>
          <div className="mb-12 max-w-2xl md:mb-16">
            <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">By intention</p>
            <h2 className="mt-3 font-serif text-3xl font-light text-vault-ivory md:text-4xl">
              Stories we are asked to commemorate
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-vault-pearl/60 md:text-base">
              Most clients arrive with a reason, not a SKU. These are the narratives we work with
              most often — each treated as a design brief, not a template.
            </p>
          </div>

          <div className="grid gap-px bg-white/[0.04] md:grid-cols-2">
            {storyCommissions.map((item) => (
              <article
                key={item.title}
                className="bg-vault-black/40 p-8 md:p-10"
              >
                <h3 className="font-serif text-xl text-vault-ivory">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-vault-pearl/65">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16 md:py-24">
        <Container>
          <div className="mb-12 max-w-2xl md:mb-16">
            <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Forms</p>
            <h2 className="mt-3 font-serif text-3xl font-light text-vault-ivory md:text-4xl">
              Rings, pendants, bracelets, chains & custom work
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-vault-pearl/60 md:text-base">
              Our live configurator currently supports ring commissions. All other forms begin with
              a private inquiry — same process, same studio standards.
            </p>
          </div>

          <div className="space-y-0">
            {pieceCategories.map((piece, index) => (
              <div key={piece.title}>
                {index > 0 && <EditorialRule />}
                <div className="grid gap-3 py-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-12 md:py-10">
                  <h3 className="font-serif text-lg text-vault-gold md:pt-0.5">{piece.title}</h3>
                  <p className="text-sm leading-relaxed text-vault-pearl/70 md:text-base">
                    {piece.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-white/[0.04] bg-vault-charcoal/20 py-16 md:py-24">
        <Container size="narrow">
          <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">How to begin</p>
          <h2 className="mt-3 font-serif text-3xl font-light text-vault-ivory">
            Three ways in — one standard of care
          </h2>

          <div className="mt-12 space-y-0">
            {beginSteps.map((item, index) => (
              <div key={item.label}>
                {index > 0 && <EditorialRule />}
                <div className="py-8 md:py-10">
                  <h3 className="font-serif text-xl text-vault-ivory">{item.label}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-vault-pearl/65">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <blockquote className="mt-12 border-l border-vault-gold/30 pl-6">
            <p className="font-serif text-lg italic leading-relaxed text-vault-pearl/75">
              Your final quote is prepared after design review and stone sourcing.
            </p>
          </blockquote>
        </Container>
      </Section>

      <Section className="py-20 md:py-28">
        <Container size="narrow" className="text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Private access</p>
          <p className="mt-4 font-serif text-2xl font-light text-vault-ivory md:text-3xl">
            When you are ready, the studio door is open.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Button size="lg" asChild>
              <Link href={routes.create}>Begin a Commission</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={routes.process}>View the Process</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="text-vault-gold hover:text-vault-gold-light">
              <Link href={routes.create}>Enter the Atelier</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
