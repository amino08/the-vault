import Image from "next/image";
import Link from "next/link";

interface JewelerHandoffPreviewProps {
  imageUrl: string;
  referenceNumber: string;
  commissionTitle: string;
  downloadPath: string;
}

export function JewelerHandoffPreview({
  imageUrl,
  referenceNumber,
  commissionTitle,
  downloadPath,
}: JewelerHandoffPreviewProps) {
  return (
    <div className="mb-8 border border-vault-gold/25 bg-gradient-to-b from-vault-charcoal to-vault-black p-8">
      <div className="mb-6 border-b border-vault-gold/15 pb-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">
          Jeweler Handoff Preview
        </p>
        <p className="mt-2 font-serif text-xl text-vault-ivory">{commissionTitle}</p>
        <p className="mt-1 text-sm text-vault-pearl/50">{referenceNumber}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="relative aspect-square w-full overflow-hidden border border-vault-gold/20 bg-[#070707] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.85)]">
          <Image
            src={imageUrl}
            alt={`Jeweler handoff preview for ${referenceNumber}`}
            fill
            unoptimized
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>

        <div className="space-y-4 text-sm text-vault-pearl/70">
          <p>
            Client-submitted configurator snapshot for bench reference. Use alongside the ring
            configuration summary below for metal, stone, and setting details.
          </p>
          <Link
            href={downloadPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-vault-gold/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-vault-gold transition-colors hover:border-vault-gold hover:bg-vault-gold/10"
          >
            Open full-size PNG
          </Link>
        </div>
      </div>
    </div>
  );
}
