import Link from "next/link";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Container, PageHeader, Section } from "@/components/layout/section";

const phases = [
  {
    eyebrow: "Consultation",
    title: "Private consultation",
    body: "We begin with a confidential conversation — the moment, the person, the symbolism. Not a sales call. A design intake shaped around what the piece needs to carry.",
  },
  {
    eyebrow: "Direction",
    title: "Design direction",
    body: "We translate the meaning behind the piece before we design the form. Metal, proportion, stone character, and setting language are chosen to serve the story — not the other way around.",
  },
  {
    eyebrow: "Concept",
    title: "3D preview & concept review",
    body: "You review a live configuration in our atelier — proportions, materials, and presence — before anything is cast or set. This is where the piece becomes visible.",
    note: "The 3D preview is a design reference, not the final manufacturing CAD.",
  },
  {
    eyebrow: "Refinement",
    title: "Jeweler refinement",
    body: "Our bench team adjusts geometry, setting height, prong profile, and wearability. Details that only matter when a piece is worn daily — or kept for generations.",
  },
  {
    eyebrow: "Quote",
    title: "Deposit & final quote",
    body: "Your final quote is prepared after design review and stone sourcing. A design deposit secures your place in the studio and is applied toward the completed commission.",
    note: "Estimated ranges in the configurator are a starting point — not a binding price.",
  },
  {
    eyebrow: "Atelier",
    title: "Production",
    body: "Fabrication, stone setting, and quality control happen in sequence. You receive production updates through your private client portal when milestones are reached.",
  },
  {
    eyebrow: "Delivery",
    title: "Final delivery",
    body: "The finished piece is presented with care documentation and commission records. Built to be worn, gifted, or handed down — with the story intact.",
  },
] as const;

function EditorialRule() {
  return (
    <div className="py-2" aria-hidden>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-vault-gold/20 to-transparent" />
    </div>
  );
}

export default function ProcessPage() {
  return (
    <>
      <Section className="pb-16 md:pb-20">
        <Container size="narrow">
          <PageHeader
            className="mb-10 md:mb-14"
            eyebrow="The Commission Path"
            title="From story to finished piece"
            description="A private, seven-part journey — transparent at every stage, never rushed."
          />
          <p className="font-serif text-2xl font-light leading-snug text-vault-ivory md:text-3xl">
            Every commission begins with a story.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-vault-pearl/65">
            The Vault is not a checkout flow. It is a working relationship between you, our design
            team, and the bench — with clear milestones and no surprises at the quote stage.
          </p>
        </Container>
      </Section>

      <Section className="border-t border-white/[0.04] bg-vault-charcoal/20 py-16 md:py-24">
        <Container>
          <article>
            {phases.map((phase, index) => (
              <div key={phase.title}>
                {index > 0 && <EditorialRule />}
                <div className="grid gap-4 py-10 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-14 md:py-14">
                  <p className="pt-1 text-[10px] uppercase tracking-[0.28em] text-vault-gold">
                    {phase.eyebrow}
                  </p>
                  <div className="space-y-4">
                    <h2 className="font-serif text-2xl font-light text-vault-ivory md:text-[1.75rem]">
                      {phase.title}
                    </h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-vault-pearl/70 md:text-base">
                      {phase.body}
                    </p>
                    {"note" in phase && phase.note && (
                      <p className="max-w-2xl border-l border-vault-gold/25 pl-4 text-sm italic text-vault-pearl/45">
                        {phase.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </article>
        </Container>
      </Section>

      <Section className="py-20 md:py-28">
        <Container size="narrow" className="text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Ready when you are</p>
          <p className="mt-4 font-serif text-2xl font-light text-vault-ivory md:text-3xl">
            The atelier is open to qualified commissions.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-vault-pearl/55">
            Configure a ring in real time, save your draft, or begin a full inquiry when the story
            is clear.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button size="lg" asChild>
              <Link href={routes.create}>Begin a Commission</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={routes.create}>Enter the Atelier</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
