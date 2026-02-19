import Link from "next/link";
import { formatPercent, formatNOK } from "@/lib/amm";
import { Clock, TrendingUp, BarChart3 } from "lucide-react";

interface MarketCardProps {
  id: string;
  title: string;
  category: string;
  yesPrice: number;
  volume: number;
  closeDate: Date;
  status: string;
}

const categoryColors: Record<string, string> = {
  politics: "bg-red-100 text-red-700",
  energy: "bg-amber-100 text-amber-700",
  sports: "bg-green-100 text-green-700",
  weather: "bg-sky-100 text-sky-700",
  culture: "bg-purple-100 text-purple-700",
  economy: "bg-blue-100 text-blue-700",
};

const categoryLabels: Record<string, string> = {
  politics: "Politikk",
  energy: "Energi",
  sports: "Sport",
  weather: "Vaer",
  culture: "Kultur",
  economy: "Okonomi",
};

export default function MarketCard({
  id,
  title,
  category,
  yesPrice,
  volume,
  closeDate,
  status,
}: MarketCardProps) {
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(closeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  const yesPercent = Math.round(yesPrice * 100);
  const noPercent = 100 - yesPercent;

  return (
    <Link href={`/markets/${id}`} className="group block">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
        <div className="mb-3 flex items-start justify-between">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              categoryColors[category] || "bg-slate-100 text-slate-700"
            }`}
          >
            {categoryLabels[category] || category}
          </span>
          {status === "open" ? (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              {daysLeft}d igjen
            </span>
          ) : (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
              Stengt
            </span>
          )}
        </div>

        <h3 className="mb-4 text-base font-semibold leading-snug text-slate-900 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>

        <div className="mb-3 flex gap-2">
          <div className="flex-1 rounded-lg bg-emerald-50 px-3 py-2 text-center">
            <div className="text-lg font-bold text-emerald-600">
              {yesPercent}%
            </div>
            <div className="text-xs text-emerald-600/70">Ja</div>
          </div>
          <div className="flex-1 rounded-lg bg-rose-50 px-3 py-2 text-center">
            <div className="text-lg font-bold text-rose-500">{noPercent}%</div>
            <div className="text-xs text-rose-500/70">Nei</div>
          </div>
        </div>

        {/* Probability bar */}
        <div className="mb-3 h-2 overflow-hidden rounded-full bg-rose-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${yesPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {formatNOK(volume)} volum
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {formatPercent(yesPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
