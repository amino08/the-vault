import { cn } from "@/lib/utils";
import type { ProcessStage } from "@/content/editorial";
import { EditorialImage } from "@/components/editorial/EditorialImage";

interface ProcessStagePanelProps {
  stage: ProcessStage;
  reversed?: boolean;
}

export function ProcessStagePanel({ stage, reversed = false }: ProcessStagePanelProps) {
  return (
    <article
      className={cn(
        "grid items-center gap-8 md:gap-12 lg:gap-16",
        "md:grid-cols-2",
        reversed && "md:[&>*:first-child]:order-2",
      )}
    >
      <div className="editorial-process-frame">
        <EditorialImage
          asset={stage.image}
          sizes="(max-width: 768px) 100vw, 45vw"
          aspectClassName="aspect-[4/3] md:aspect-[5/4]"
        />
        <span className="editorial-process-step" aria-hidden>
          {String(stage.step).padStart(2, "0")}
        </span>
      </div>

      <div className="space-y-5 md:py-4 lg:py-8">
        <p className="brand-eyebrow-gold">{stage.eyebrow}</p>
        <h2 className="font-serif text-3xl font-light leading-snug text-vault-ink md:text-4xl">
          {stage.title}
        </h2>
        <p className="max-w-lg body-editorial md:text-base">{stage.body}</p>
        {stage.note && (
          <p className="max-w-lg border-l-2 border-vault-gold/40 pl-4 text-sm italic text-vault-muted-light">
            {stage.note}
          </p>
        )}
      </div>
    </article>
  );
}

interface ProcessTimelineProps {
  stages: ProcessStage[];
}

export function ProcessTimeline({ stages }: ProcessTimelineProps) {
  return (
    <div className="space-y-20 md:space-y-28 lg:space-y-32">
      {stages.map((stage, index) => (
        <div key={stage.step}>
          {index > 0 && (
            <div className="mb-20 md:mb-28" aria-hidden>
              <div className="brand-rule mx-auto max-w-xs" />
            </div>
          )}
          <ProcessStagePanel stage={stage} reversed={index % 2 === 1} />
        </div>
      ))}
    </div>
  );
}
