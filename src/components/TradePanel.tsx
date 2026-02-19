"use client";

import { useState, useTransition } from "react";
import { executeTrade } from "@/lib/actions";
import { calculateBuyCost, formatNOK } from "@/lib/amm";

interface TradePanelProps {
  marketId: string;
  yesPrice: number;
  liquidity: number;
  status: string;
}

export default function TradePanel({
  marketId,
  yesPrice,
  liquidity,
  status,
}: TradePanelProps) {
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [shares, setShares] = useState(10);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const preview = calculateBuyCost(yesPrice, side, shares, liquidity);

  const handleTrade = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        const result = await executeTrade(marketId, side, "buy", shares);
        setSuccess(
          `Kjopt ${result.shares} ${side === "yes" ? "JA" : "NEI"}-aksjer for ${formatNOK(result.cost)}`
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Trade failed");
      }
    });
  };

  if (status !== "open") {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-500">
          Dette markedet er {status === "resolved" ? "avgjort" : "stengt"} for handel.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Handel</h3>

      {/* Side selector */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSide("yes")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            side === "yes"
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Kjop JA
        </button>
        <button
          onClick={() => setSide("no")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            side === "no"
              ? "bg-rose-500 text-white shadow-md shadow-rose-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Kjop NEI
        </button>
      </div>

      {/* Shares input */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Antall aksjer
        </label>
        <input
          type="number"
          min={1}
          max={1000}
          value={shares}
          onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <div className="mt-2 flex gap-2">
          {[5, 10, 25, 50, 100].map((n) => (
            <button
              key={n}
              onClick={() => setShares(n)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                shares === n
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4 rounded-lg bg-slate-50 p-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Gjennomsnittspris</span>
          <span className="font-medium text-slate-900">
            {Math.round(preview.avgPrice * 100)} ore
          </span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-slate-600">Total kostnad</span>
          <span className="font-semibold text-slate-900">
            {formatNOK(preview.cost)}
          </span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-slate-600">Potensiell gevinst</span>
          <span className="font-semibold text-emerald-600">
            {formatNOK(shares - preview.cost)}
          </span>
        </div>
      </div>

      {/* Execute button */}
      <button
        onClick={handleTrade}
        disabled={isPending}
        className={`w-full rounded-lg py-3 text-sm font-semibold text-white transition-all ${
          side === "yes"
            ? "bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300"
            : "bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300"
        }`}
      >
        {isPending
          ? "Behandler..."
          : `Kjop ${shares} ${side === "yes" ? "JA" : "NEI"}-aksjer for ${formatNOK(preview.cost)}`}
      </button>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
          {success}
        </div>
      )}
    </div>
  );
}
