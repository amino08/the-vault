import { cn } from "@/lib/utils";

interface EditorialDescriptionBoxProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function EditorialDescriptionBox({
  children,
  className,
  centered = false,
}: EditorialDescriptionBoxProps) {
  return (
    <p
      className={cn(
        "editorial-desc-box",
        centered && "editorial-desc-box-centered",
        className,
      )}
    >
      {children}
    </p>
  );
}
