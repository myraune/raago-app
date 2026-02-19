import { Suspense } from "react";
import { getMarkets } from "@/lib/actions";
import MarketCard from "@/components/MarketCard";
import CategoryFilter from "@/components/CategoryFilter";

export const metadata = {
  title: "Markeder - Raago",
};

export default async function MarketsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const markets = await getMarkets(category);

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Alle markeder
        </h1>
        <p className="text-sm text-slate-600">
          Utforsk og handel pa prediksjonsmarkeder om norske hendelser.
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <CategoryFilter />
        </Suspense>
      </div>

      {markets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="mb-2 text-slate-500">
            Ingen markeder funnet{category ? ` i kategorien "${category}"` : ""}.
          </p>
          <p className="text-sm text-slate-400">
            Besok <code className="rounded bg-slate-100 px-2 py-0.5 text-xs">/api/seed</code> for a legge til eksempel-markeder.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
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
    </div>
  );
}
