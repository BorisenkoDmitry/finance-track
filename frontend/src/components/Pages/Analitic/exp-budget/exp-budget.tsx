import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppSelector } from "../../../../hooks/storeHook";
import { type FinanceAnaliticResponse } from "../../../../stores/financeSlice/financeSlice";
import { Loader } from "../../../UI/Loader/Loader";
import { EmptyState } from "../../../UI/EmptyState/EmptyState";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("ru-RU");

type CombinedPoint = { day: number; exp: number; budget: number };

function combineFinanceData(resp: FinanceAnaliticResponse): CombinedPoint[] {
  const exps = resp.exps.financeAnalitic;
  const bds = resp.budgets.financeAnalitic;
  const len = Math.min(exps.length, bds.length);
  const result: CombinedPoint[] = [];
  for (let i = 0; i < len; i++) {
    result.push({
      day: Number(exps[i].day) || i + 1,
      exp: parseFloat(String(exps[i].total)) || 0,
      budget: parseFloat(String(bds[i].total)) || 0,
    });
  }
  return result;
}

export const ExpFinance = () => {
  const { financeAnaliticResp, isLoadingFinanceRem } = useAppSelector((st) => st.finance);

  if (!financeAnaliticResp || financeAnaliticResp.length === 0) {
    return <EmptyState icon={<BarChart3 size={24} />} title="Нет данных" subtitle="Добавьте расходы и бюджеты для отображения аналитики" />;
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {financeAnaliticResp.map((item) => (
          <ExpBudgetCard key={item.catalogName} data={item} />
        ))}
      </div>
      <Loader isLoading={isLoadingFinanceRem} />
    </div>
  );
};

const ExpBudgetCard = ({ data }: { data: FinanceAnaliticResponse }) => {
  const expTotal = Math.floor(Number(data.exps.totalPeriodExp) || 0);
  const budgetTotal = Math.floor(Number(data.budgets.totalPeriodBudgets) || 0);
  const diff = budgetTotal - expTotal;
  const isOver = diff < 0;
  const color = data.catalogColor || "#FF7582";

  const chartData = useMemo(() => combineFinanceData(data), [data]);

  return (
    <div className="rounded-2xl border border-primary-700/15 p-5 transition-all duration-300 hover:border-primary-700/30">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <div className="absolute inset-0 rounded-xl opacity-20 blur-[2px]" style={{ backgroundColor: color }} />
            <div className="relative h-4 w-4 rounded-md" style={{ backgroundColor: color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-grey-0">{data.catalogName}</h3>
            <p className={`text-[11px] font-medium ${isOver ? "text-red-400" : "text-green-400"}`}>
              {isOver ? `Превышение на ${fmt(Math.abs(diff))} ₽` : diff === 0 ? "В рамках бюджета" : `Экономия ${fmt(diff)} ₽`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-2">
          <TrendingDown size={13} className="text-red-400/60" />
          <div>
            <p className="text-[10px] text-grey-200/40">Расходы</p>
            <p className="text-sm font-bold tabular-nums" style={{ color }}>{fmt(expTotal)} ₽</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={13} className="text-green-400/60" />
          <div>
            <p className="text-[10px] text-grey-200/40">Бюджет</p>
            <p className="text-sm font-bold tabular-nums text-green-400">{fmt(budgetTotal)} ₽</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-exp-${data.catalogName}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`grad-bud-${data.catalogName}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(90,58,74,0.1)" vertical={false} />
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
            />
            <Tooltip
              contentStyle={{
                background: "rgba(12,19,30,0.95)",
                border: "1px solid rgba(90,58,74,0.2)",
                borderRadius: 12,
                fontSize: 12,
                color: "#f0e6ef",
              }}
              formatter={(value: number, name: string) => [
                `${fmt(value)} ₽`,
                name === "exp" ? "Расход" : "Бюджет",
              ]}
              labelFormatter={(day) => `День ${day}`}
            />
            <Area
              type="monotone"
              dataKey="budget"
              stroke="#4ade80"
              strokeWidth={1.5}
              fill={`url(#grad-bud-${data.catalogName})`}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="exp"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-exp-${data.catalogName})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
