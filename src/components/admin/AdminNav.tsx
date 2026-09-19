"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, BedDouble, Zap, Sun, UtensilsCrossed,
  MessageSquareQuote, CalendarCheck, Mail, Settings, LogOut, Images, Moon, BookOpen, Tag, FileText,
  Menu, X,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/admin/devis", label: "Devis", icon: FileText },
  { href: "/admin/hebergements", label: "Hébergements", icon: BedDouble },
  { href: "/admin/activites", label: "Activités", icon: Zap },
  { href: "/admin/day-pass", label: "Day Pass", icon: Sun },
  { href: "/admin/tarifs-saisonniers", label: "Tarifs & Fermetures", icon: Tag },
  { href: "/admin/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/admin/galerie", label: "Galerie", icon: Images },
  { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquareQuote },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

function NavBody({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Admin</p>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">Arabian Desert Home</h2>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full cursor-pointer"
        >
          <Moon className="w-4 h-4" />
          {theme === "dark" ? "Mode clair" : "Mode sombre"}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Navigating on a phone should close the drawer, never leave it covering the page.
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const current = links.find((l) => (l.exact ? pathname === l.href : pathname.startsWith(l.href)));

  return (
    <>
      {/* Mobile top bar — the sidebar is too wide to keep on a phone */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center gap-3 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {current?.label ?? "Admin"}
        </span>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-[17rem] max-w-[85vw] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-4 right-3 p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <NavBody pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col h-screen sticky top-0">
        <NavBody pathname={pathname} />
      </aside>
    </>
  );
}
