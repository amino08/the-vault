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
      <aside className="w-full border-b border-vault-forest/25 pb-4 md:w-60 md:rounded-sm md:border-b-0 md:border-r md:bg-vault-forest/[0.08] md:p-5 md:pr-6">
        {profile && (
          <div className="mb-6 hidden md:block">
            <p className="text-[10px] uppercase tracking-luxury text-vault-gold/80">Client</p>
            <p className="mt-1 text-sm text-vault-cream">{profile.full_name ?? profile.email}</p>
            <p className="text-xs capitalize text-vault-pearl/55">{profile.role}</p>
          </div>
        )}
        <nav className="flex gap-4 overflow-x-auto pb-4 md:flex-col md:gap-1 md:pb-0">
          {accountNav.map((item) => (
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
          {profile && isStaffRole(profile.role) && (
            <Link
              href={routes.admin}
              className="whitespace-nowrap rounded-sm px-3 py-2 text-sm text-vault-gold hover:bg-vault-forest/20"
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
