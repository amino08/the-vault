import Image from "next/image";

interface CommissionRenderSnapshotProps {
  imageUrl: string;
  title?: string;
  referenceNumber?: string;
}

export function CommissionRenderSnapshot({
  imageUrl,
  title = "Design Preview",
  referenceNumber,
}: CommissionRenderSnapshotProps) {
  return (
    <div className="mb-8 border border-white/5 bg-vault-charcoal p-8">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-xs uppercase tracking-luxury text-vault-gold">{title}</p>
        {referenceNumber && (
          <p className="text-[11px] tracking-wide text-vault-pearl/45">{referenceNumber}</p>
        )}
      </div>
      <div className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden border border-vault-gold/15 bg-[#070707]">
        <Image
          src={imageUrl}
          alt="Ring design preview captured at submission"
          fill
          unoptimized
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </div>
      <p className="mt-3 text-[11px] tracking-wide text-vault-pearl/40">
        Captured from your live configurator at submission.
      </p>
    </div>
  );
}
