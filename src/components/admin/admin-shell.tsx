import Link from "next/link";
import { adminNav } from "@/config/routes";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  return (
    <aside className="w-full border-b border-vault-forest/25 pb-4 md:w-60 md:rounded-sm md:border-b-0 md:border-r md:bg-vault-forest/[0.08] md:p-5 md:pr-6">
      <p className="mb-4 hidden text-[10px] uppercase tracking-luxury text-vault-gold md:block">
        Enter Aevum · Internal
      </p>
      <nav className="flex gap-4 overflow-x-auto pb-4 md:flex-col md:gap-1 md:pb-0">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-sm px-3 py-2 text-sm text-vault-pearl/75 transition-colors hover:bg-vault-forest/20 hover:text-vault-gold",
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
    <div className="brand-panel border-dashed p-10">
      <h2 className="font-serif text-xl text-vault-cream">{title}</h2>
      <p className="mt-2 text-sm text-vault-pearl/65">{description}</p>
    </div>
  );
}
