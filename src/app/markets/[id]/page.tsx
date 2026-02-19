import { notFound } from "next/navigation";
import Link from "next/link";
import { getMarket } from "@/lib/actions";
import { formatPercent, formatNOK } from "@/lib/amm";
import TradePanel from "@/components/TradePanel";
import { ArrowLeft, Clock, BarChart3, Users } from "lucide-react";

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  politics: "Politikk",
  energy: "Energi",
  sports: "Sport",
  weather: "Vaer",
  culture: "Kultur",
  economy: "Okonomi",
};

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const market = await getMarket(id);

  if (!market) {
    notFound();
  }

  const yesPercent = Math.round(market.yesPrice * 100);
  const noPercent = 100 - yesPercent;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(market.closeDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div>
      <Link
        href="/markets"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Tilbake til markeder
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Market info - left column */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {categoryLabels[market.category] || market.category}
              </span>
              {market.status === "open" ? (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {daysLeft} dager igjen
                </span>
              ) : (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {market.status === "resolved" ? "Avgjort" : "Stengt"}
                </span>
              )}
            </div>

            <h1 className="mb-3 text-2xl font-bold text-slate-900">
              {market.title}
            </h1>

            <p className="mb-6 text-slate-600">{market.description}</p>

            {/* Large probability display */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1 rounded-xl bg-emerald-50 p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600">
                  {yesPercent}%
                </div>
                <div className="mt-1 text-sm font-medium text-emerald-600/70">
                  Ja
                </div>
              </div>
              <div className="flex-1 rounded-xl bg-rose-50 p-6 text-center">
                <div className="text-4xl font-bold text-rose-500">
                  {noPercent}%
                </div>
                <div className="mt-1 text-sm font-medium text-rose-500/70">
                  Nei
                </div>
              </div>
            </div>

            {/* Probability bar */}
            <div className="mb-6 h-3 overflow-hidden rounded-full bg-rose-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${yesPercent}%` }}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <BarChart3 className="mx-auto mb-1 h-5 w-5 text-slate-400" />
                <div className="text-sm font-semibold text-slate-900">
                  {formatNOK(market.volume)}
                </div>
                <div className="text-xs text-slate-500">Volum</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <Users className="mx-auto mb-1 h-5 w-5 text-slate-400" />
                <div className="text-sm font-semibold text-slate-900">
                  {market.trades.length}
                </div>
                <div className="text-xs text-slate-500">Handler</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-center">
                <Clock className="mx-auto mb-1 h-5 w-5 text-slate-400" />
                <div className="text-sm font-semibold text-slate-900">
                  {new Date(market.closeDate).toLocaleDateString("nb-NO")}
                </div>
                <div className="text-xs text-slate-500">Sluttdato</div>
              </div>
            </div>
          </div>

          {/* Trade history */}
          {market.trades.length > 0 && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Siste handler
              </h2>
              <div className="space-y-2">
                {market.trades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          trade.side === "yes"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        {trade.side === "yes" ? "JA" : "NEI"}
                      </span>
                      <span className="text-sm text-slate-600">
                        {trade.direction === "buy" ? "Kjopte" : "Solgte"}{" "}
                        {trade.shares} aksjer
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {formatNOK(trade.cost)}
                      </div>
                      <div className="text-xs text-slate-500">
                        @ {formatPercent(trade.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Trade panel - right column */}
        <div>
          <div className="sticky top-20">
            <TradePanel
              marketId={market.id}
              yesPrice={market.yesPrice}
              liquidity={market.liquidity}
              status={market.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
