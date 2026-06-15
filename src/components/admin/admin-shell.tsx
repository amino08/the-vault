import Link from "next/link";
import { adminNav } from "@/config/routes";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  return (
    <aside className="w-full border-b border-vault-forest/10 pb-4 md:w-60 md:rounded-sm md:border-b-0 md:border-r md:border-vault-forest/10 md:bg-vault-ivory md:p-5 md:pr-6 md:shadow-panel">
      <p className="mb-4 hidden brand-eyebrow text-[10px] md:block">Enter Aevum · Operations</p>
      <nav className="flex gap-4 overflow-x-auto pb-4 md:flex-col md:gap-1 md:pb-0">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-sm px-3 py-2 text-sm text-vault-muted transition-colors hover:bg-vault-warm hover:text-vault-forest",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:px-10">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function AdminPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="surface-panel rounded-sm border-dashed border-vault-forest/20 p-10">
      <h2 className="font-serif text-xl text-vault-ink">{title}</h2>
      <p className="mt-2 text-sm text-vault-muted">{description}</p>
    </div>
  );
}
