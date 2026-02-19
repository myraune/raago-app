import Link from "next/link";
import { getUser, getUserPositions } from "@/lib/actions";
import { formatNOK, formatPercent } from "@/lib/amm";
import { Briefcase, TrendingUp, TrendingDown } from "lucide-react";

export const metadata = {
  title: "Portefolje - Raago",
};

export default async function PortfolioPage() {
  const user = await getUser();
  const positions = await getUserPositions();

  const totalValue = positions.reduce((sum, pos) => {
    const yesValue = pos.yesShares * pos.market.yesPrice;
    const noValue = pos.noShares * (1 - pos.market.yesPrice);
    return sum + yesValue + noValue;
  }, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Min portefolje
        </h1>
        <p className="text-sm text-slate-600">
          Oversikt over dine posisjoner og balanse.
        </p>
      </div>

      {/* Balance cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Tilgjengelig saldo</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatNOK(user.balance)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Posisjonverdi</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {formatNOK(Math.round(totalValue))}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total verdi</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {formatNOK(Math.round(user.balance + totalValue))}
          </p>
        </div>
      </div>

      {/* Positions */}
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Aktive posisjoner
      </h2>

      {positions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="mb-2 text-slate-500">Ingen aktive posisjoner enna.</p>
          <Link
            href="/markets"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Utforsk markeder &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map((pos) => {
            const yesValue = pos.yesShares * pos.market.yesPrice;
            const noValue = pos.noShares * (1 - pos.market.yesPrice);
            const currentValue = yesValue + noValue;
            const pnl = currentValue - pos.totalCost;
            const pnlPercent =
              pos.totalCost > 0 ? (pnl / pos.totalCost) * 100 : 0;

            return (
              <Link
                key={pos.market.id}
                href={`/markets/${pos.market.id}`}
                className="block"
              >
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 font-semibold text-slate-900">
                        {pos.market.title}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {pos.yesShares > 0 && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            JA: {Math.round(pos.yesShares)} aksjer
                          </span>
                        )}
                        {pos.noShares > 0 && (
                          <span className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                            NEI: {Math.round(pos.noShares)} aksjer
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          Navaerende pris: {formatPercent(pos.market.yesPrice)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">
                        {formatNOK(Math.round(currentValue))}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                          pnl >= 0 ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {pnl >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {pnl >= 0 ? "+" : ""}
                        {formatNOK(Math.round(pnl))} (
                        {pnlPercent >= 0 ? "+" : ""}
                        {Math.round(pnlPercent)}%)
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
