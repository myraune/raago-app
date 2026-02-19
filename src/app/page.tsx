import Link from "next/link";
import { getMarkets } from "@/lib/actions";
import MarketCard from "@/components/MarketCard";
import { TrendingUp, Zap, Shield, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const markets = await getMarkets();
  const featuredMarkets = markets.slice(0, 6);

  return (
    <div>
      {/* Hero section */}
      <section className="mb-12 mt-4 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-red-900 p-8 text-white sm:p-12">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-white/70">
              Norges Prediksjonsmarked
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">
            Handel pa fremtiden til Norge
          </h1>
          <p className="mb-6 text-lg text-white/80">
            Kjop og selg aksjer basert pa hva du tror kommer til a skje.
            Politikk, energi, sport, vaer og mer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/markets"
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              Utforsk markeder
            </Link>
            <Link
              href="/portfolio"
              className="rounded-lg border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Min portefolje
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Zap className="mb-3 h-8 w-8 text-amber-500" />
          <h3 className="mb-1 font-semibold text-slate-900">Sanntids priser</h3>
          <p className="text-sm text-slate-600">
            Prisene oppdateres i sanntid basert pa tilbud og ettersporsel.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Shield className="mb-3 h-8 w-8 text-blue-500" />
          <h3 className="mb-1 font-semibold text-slate-900">Norsk fokus</h3>
          <p className="text-sm text-slate-600">
            Markeder utelukkende om norske hendelser og temaer.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <BarChart3 className="mb-3 h-8 w-8 text-emerald-500" />
          <h3 className="mb-1 font-semibold text-slate-900">Enkel handel</h3>
          <p className="text-sm text-slate-600">
            Kjop JA eller NEI aksjer med et klikk. Ingen komplisert oppsett.
          </p>
        </div>
      </section>

      {/* Featured markets */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Populaere markeder
          </h2>
          <Link
            href="/markets"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Se alle &rarr;
          </Link>
        </div>

        {featuredMarkets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="mb-2 text-slate-500">Ingen markeder enna.</p>
            <p className="text-sm text-slate-400">
              Kjor seed-endepunktet for a legge til eksempel-markeder:{" "}
              <code className="rounded bg-slate-100 px-2 py-0.5 text-xs">
                /api/seed
              </code>
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredMarkets.map((market) => (
              <MarketCard
                key={market.id}
                id={market.id}
                title={market.title}
                category={market.category}
                yesPrice={market.yesPrice}
                volume={market.volume}
                closeDate={market.closeDate}
                status={market.status}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
