"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, BedDouble, Zap, Sun, UtensilsCrossed,
  MessageSquareQuote, CalendarCheck, Mail, Settings, LogOut,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/hebergements", label: "Hébergements", icon: BedDouble },
  { href: "/admin/activites", label: "Activités", icon: Zap },
  { href: "/admin/day-pass", label: "Day Pass", icon: Sun },
  { href: "/admin/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquareQuote },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-[#0f0f0f] border-r border-white/5 flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-white/5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Admin</p>
        <h2 className="text-sm font-semibold text-white leading-tight">Arabian Desert Home</h2>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
