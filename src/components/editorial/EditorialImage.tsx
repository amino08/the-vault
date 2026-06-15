import Image from "next/image";
import { cn } from "@/lib/utils";
import type { EditorialImageAsset, EditorialImageTheme } from "@/content/editorial-images";

const themeClasses: Record<EditorialImageTheme, string> = {
  "hero-presentation": "editorial-ph-hero-presentation",
  "hero-craftsmanship": "editorial-ph-hero-craftsmanship",
  "process-consultation": "editorial-ph-process-consultation",
  "process-design": "editorial-ph-process-design",
  "process-cad": "editorial-ph-process-cad",
  "process-craftsmanship": "editorial-ph-process-craftsmanship",
  "process-delivery": "editorial-ph-process-delivery",
  "create-atelier": "editorial-ph-create-atelier",
  "collection-engagement": "editorial-ph-collection-engagement",
  "collection-anniversary": "editorial-ph-collection-anniversary",
  "collection-legacy": "editorial-ph-collection-legacy",
  "collection-signet": "editorial-ph-collection-signet",
  "collection-bespoke": "editorial-ph-collection-bespoke",
  "milestone-engagement": "editorial-ph-milestone-engagement",
  "milestone-legacy": "editorial-ph-milestone-legacy",
  "milestone-achievement": "editorial-ph-milestone-achievement",
};

interface EditorialImageProps {
  asset: EditorialImageAsset;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  aspectClassName?: string;
}

export function EditorialImage({
  asset,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  fill = true,
  aspectClassName,
}: EditorialImageProps) {
  const wrapperClass = cn("relative overflow-hidden", aspectClassName, className);

  if (asset.src) {
    return (
      <div className={wrapperClass}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill={fill}
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(wrapperClass, themeClasses[asset.theme], "editorial-image-placeholder")}
      role="img"
      aria-label={asset.alt}
    >
      <span className="sr-only">{asset.alt}</span>
      <div className="editorial-ph-vignette" aria-hidden />
      <div className="editorial-ph-shimmer" aria-hidden />
    </div>
  );
}
