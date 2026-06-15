import Link from "next/link";
import { adminNav } from "@/config/routes";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  return (
    <aside className="w-full border-b border-white/5 md:w-56 md:border-b-0 md:border-r md:pr-8">
      <p className="mb-4 hidden text-xs uppercase tracking-luxury text-vault-gold md:block">
        Internal
      </p>
      <nav className="flex gap-4 overflow-x-auto pb-4 md:flex-col md:gap-1 md:pb-0">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap px-3 py-2 text-sm text-vault-pearl/70 hover:text-vault-gold",
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
    <div className="border border-dashed border-vault-gold/20 bg-vault-charcoal/50 p-10">
      <h2 className="font-serif text-xl">{title}</h2>
      <p className="mt-2 text-sm text-vault-pearl/60">{description}</p>
    </div>
  );
}
