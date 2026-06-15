import { getSessionUser, getCurrentProfile, isStaffRole } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";
import { accountNav, routes } from "@/config/routes";
import { cn } from "@/lib/utils";

export async function AccountShell({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  const user = await getSessionUser();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:px-10">
      <aside className="w-full border-b border-vault-forest/10 pb-4 md:w-60 md:rounded-sm md:border-b-0 md:border-r md:border-vault-forest/10 md:bg-vault-ivory md:p-5 md:pr-6 md:shadow-panel">
        {profile && (
          <div className="mb-6 hidden md:block">
            <p className="brand-eyebrow text-[10px]">Client</p>
            <p className="mt-1 text-sm text-vault-ink">{profile.full_name ?? profile.email}</p>
            <p className="text-xs capitalize text-vault-muted-light">{profile.role}</p>
          </div>
        )}
        <nav className="flex gap-4 overflow-x-auto pb-4 md:flex-col md:gap-1 md:pb-0">
          {accountNav.map((item) => (
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
          {profile && isStaffRole(profile.role) && (
            <Link
              href={routes.admin}
              className="whitespace-nowrap rounded-sm px-3 py-2 text-sm text-vault-gold hover:bg-vault-warm"
            >
              Admin Dashboard
            </Link>
          )}
        </nav>
        {user && (
          <div className="mt-6 hidden md:block">
            <SignOutButton />
          </div>
        )}
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
