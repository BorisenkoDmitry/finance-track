import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppSelector } from "../../../../hooks/storeHook";
import { monthsList } from "../../../../utils/constants";
import { consolidateByDay } from "../../../../utils/mergeAllExpGraphic";
import { EmptyState } from "../../../UI/EmptyState/EmptyState";
import { BarChart3 } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("ru-RU");

export const AllExpCatalog = () => {
  const { financeAnaliticResp } = useAppSelector((st) => st.finance);
  const { start } = useAppSelector((st) => st.global.periodDate);

  const [visibleCats, setVisibleCats] = useState<Set<string>>(
    () => new Set(financeAnaliticResp.map((x) => x.catalogName))
  );

  const toggle = (name: string) => {
    setVisibleCats((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const { lineData, pieData, totalExp } = useMemo(() => {
    const n = financeAnaliticResp.map((x) => {
      const arr: (Record<string, unknown> & { day: number })[] = [];
      x.exps.financeAnalitic.forEach((t) => {
        arr.push({
          [x.catalogName]: { total: t.total },
          day: typeof t.day === "number" ? t.day : new Date(t.day).getDate(),
        });
      });
      return arr;
    });

    const pie = financeAnaliticResp.map((x) => ({
      value: Number(x.exps.totalPeriodExp) || 0,
      name: x.catalogName,
      color: x.catalogColor || "#FF7582",
    }));

    const total = pie.reduce((s, p) => s + p.value, 0);

    return { lineData: consolidateByDay(n), pieData: pie.filter((p) => p.value > 0), totalExp: total };
  }, [financeAnaliticResp]);

  if (!financeAnaliticResp || financeAnaliticResp.length === 0) {
    return <EmptyState icon={<BarChart3 size={24} />} title="Нет данных" subtitle="Добавьте расходы для отображения аналитики" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Line chart ─── */}
      <div className="rounded-2xl border border-primary-700/15 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-grey-0">Расходы по дням</h3>
          <span className="text-xs text-grey-200/40">
            {monthsList[new Date(start).getMonth()]} {new Date(start).getFullYear()}
          </span>
        </div>

        {/* Category toggles */}
        <div className="mb-4 flex flex-wrap gap-2">
          {financeAnaliticResp.map((cat) => {
            const active = visibleCats.has(cat.catalogName);
            const color = cat.catalogColor || "#FF7582";
            return (
              <button
                key={cat.catalogName}
                onClick={() => toggle(cat.catalogName)}
                className={[
                  "flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200",
                  active
                    ? "bg-primary-500/15 text-grey-0"
                    : "bg-primary-900/30 text-grey-200/30",
                ].join(" ")}
              >
                <span
                  className={["h-2 w-2 rounded-full transition-opacity", active ? "" : "opacity-30"].join(" ")}
                  style={{ backgroundColor: color }}
                />
                {cat.catalogName}
              </button>
            );
          })}
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                {financeAnaliticResp.map((cat) => (
                  <linearGradient key={cat.catalogName} id={`grad-cat-${cat.catalogName}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cat.catalogColor || "#FF7582"} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={cat.catalogColor || "#FF7582"} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(90,58,74,0.08)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(168,155,167,0.3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(168,155,167,0.3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(12,19,30,0.95)",
                  border: "1px solid rgba(90,58,74,0.2)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "#f0e6ef",
                }}
                labelFormatter={(day) => `День ${day}`}
                formatter={(value: { total?: number }, name: string) => {
                  const v = typeof value === "object" ? Number(value.total) : Number(value);
                  return [`${fmt(v)} ₽`, name.replace(".total", "")];
                }}
              />
              {financeAnaliticResp.map((cat) => {
                if (!visibleCats.has(cat.catalogName)) return null;
                const color = cat.catalogColor || "#FF7582";
                return (
                  <Area
                    key={cat.catalogName}
                    type="monotone"
                    dataKey={`${cat.catalogName}.total`}
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#grad-cat-${cat.catalogName})`}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: color }}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Pie chart + category list ─── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Pie */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-primary-700/15 p-5">
          <h3 className="mb-2 text-sm font-semibold text-grey-0">Распределение расходов</h3>
          <div className="h-[280px] w-full max-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(12,19,30,0.95)",
                    border: "1px solid rgba(90,58,74,0.2)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#f0e6ef",
                  }}
                  formatter={(value: number) => [`${fmt(value)} ₽`]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "rgba(168,155,167,0.6)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-primary-700/15 p-5">
          <h3 className="mb-4 text-sm font-semibold text-grey-0">По категориям</h3>
          <div className="flex flex-col gap-2">
            {pieData
              .sort((a, b) => b.value - a.value)
              .map((cat) => {
                const pct = totalExp > 0 ? (cat.value / totalExp) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm text-grey-100">{cat.name}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold tabular-nums text-grey-0">{fmt(cat.value)} ₽</span>
                        <span className="text-[10px] tabular-nums text-grey-200/40">{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary-800/40">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
