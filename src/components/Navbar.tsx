"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Home, BarChart3, Briefcase } from "lucide-react";

export default function Navbar({ balance }: { balance: number }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Hjem", icon: Home },
    { href: "/markets", label: "Markeder", icon: BarChart3 },
    { href: "/portfolio", label: "Portefolje", icon: Briefcase },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-blue-700">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Raago
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
          <span className="text-sm font-semibold text-emerald-700">
            {balance.toLocaleString("nb-NO")} kr
          </span>
        </div>
      </div>
    </nav>
  );
}
