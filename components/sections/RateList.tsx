import type { Rate } from "@/content/types";
import { formatRate } from "@/lib/format";

/** Rates written on paper with dotted leaders, grouped by kind of work. */
export function RateList({ rates, grouped = true }: { rates: Rate[]; grouped?: boolean }) {
  const groups = grouped ? [...new Set(rates.map((r) => r.group))] : [""];
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g || "all"}>
          {g && <h3 className="mb-1 font-hand text-2xl text-pink">{g}</h3>}
          <dl className="space-y-3">
            {rates
              .filter((r) => !g || r.group === g)
              .map((r) => {
                const price = formatRate(r);
                return (
                  <div key={r.id}>
                    <div className="flex items-end gap-2">
                      <dt className="font-type text-sm font-bold sm:text-base">{r.service}</dt>
                      <span aria-hidden className="leader mb-1 h-3 min-w-6 flex-1" />
                      <dd className={price ? "font-type text-base font-bold whitespace-nowrap" : "-rotate-2 font-note text-xl leading-none whitespace-nowrap text-pink"}>
                        {price ?? "quote on request"}
                      </dd>
                    </div>
                    <p className="font-type text-xs text-pencil">
                      {r.unit}
                      {r.note ? ` · ${r.note}` : ""}
                    </p>
                  </div>
                );
              })}
          </dl>
        </div>
      ))}
    </div>
  );
}
