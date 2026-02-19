"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { value: "", label: "Alle" },
  { value: "politics", label: "Politikk" },
  { value: "energy", label: "Energi" },
  { value: "sports", label: "Sport" },
  { value: "weather", label: "Vaer" },
  { value: "culture", label: "Kultur" },
  { value: "economy", label: "Okonomi" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") || "";

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            if (value) {
              params.set("category", value);
            } else {
              params.delete("category");
            }
            router.push(`/markets?${params.toString()}`);
          }}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            current === value
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
