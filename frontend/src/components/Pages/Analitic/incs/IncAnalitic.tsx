import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useAppSelector } from "../../../../hooks/storeHook";
import type { FinanceAnaliticIncExpResponse } from "../../../../stores/financeSlice/financeSlice";
import { Loader } from "../../../UI/Loader/Loader";
import { EmptyState } from "../../../UI/EmptyState/EmptyState";
import { BarChart3, TrendingDown, TrendingUp, Wallet } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("ru-RU");

const COLORS = {
  income: "#2dd4bf",
  expense: "#FF7582",
  budget: "#a78bfa",
};

function combineData(resp: FinanceAnaliticIncExpResponse) {
  const exps = resp.expsMonthly;
  const bds = resp.budgetsMonthly;
  const incs = resp.incsMonthly;
  const len = Math.min(exps.length, bds.length, incs.length);
  const result: { month: string; inc: number; exp: number; budget: number }[] = [];
  for (let i = 0; i < len; i++) {
    result.push({
      month: exps[i].month,
      exp: parseFloat(exps[i].total) || 0,
      budget: parseFloat(bds[i].total) || 0,
      inc: parseFloat(incs[i].total) || 0,
    });
  }
  return result;
}

export const IncAnalitic = () => {
  const { financeExpIncResp: data, isLoadingfinanceExpIncResp: isLoading } =
    useAppSelector((st) => st.finance);
  const { remainingFinance } = useAppSelector((st) => st.finance);

  const chartData = useMemo(() => (data ? combineData(data) : []), [data]);

  if (!data) return <EmptyState icon={<BarChart3 size={24} />} title="Нет данных" subtitle="Выберите период для отображения аналитики" />;

  const incTotal = data.incsTotal || 0;
  const expTotal = data.expsTotal || 0;
  const budTotal = data.budgetsTotal || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Доходы"
          value={incTotal}
          color={COLORS.income}
          prefix="+"
        />
        <StatCard
          icon={<TrendingDown size={18} />}
          label="Расходы"
          value={expTotal}
          color={COLORS.expense}
          prefix="-"
        />
        <StatCard
          icon={<Wallet size={18} />}
          label="Баланс"
          value={remainingFinance}
          color={remainingFinance >= 0 ? COLORS.income : COLORS.expense}
          prefix={remainingFinance >= 0 ? "+" : ""}
        />
      </div>

      {/* Main chart */}
      <div className="rounded-2xl border border-primary-700/15 p-5">
        <h3 className="mb-4 text-sm font-semibold text-grey-0">Динамика по месяцам</h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.income} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={COLORS.income} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.expense} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={COLORS.expense} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradBud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.budget} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={COLORS.budget} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(90,58,74,0.08)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "rgba(168,155,167,0.4)", fontSize: 11 }}
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
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = { inc: "Доходы", exp: "Расходы", budget: "Бюджет" };
                  return [`${fmt(value)} ₽`, labels[name] || name];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "rgba(168,155,167,0.6)" }}
                formatter={(name: string) => {
                  const labels: Record<string, string> = { inc: "Доходы", exp: "Расходы", budget: "Бюджет" };
                  return labels[name] || name;
                }}
              />
              <Area type="monotone" dataKey="inc" stroke={COLORS.income} strokeWidth={2} fill="url(#gradInc)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: COLORS.income }} />
              <Area type="monotone" dataKey="exp" stroke={COLORS.expense} strokeWidth={2} fill="url(#gradExp)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: COLORS.expense }} />
              <Area type="monotone" dataKey="budget" stroke={COLORS.budget} strokeWidth={1.5} fill="url(#gradBud)" dot={false} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Loader isLoading={isLoading} />
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
  prefix = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  prefix?: string;
}) => (
  <div className="rounded-2xl border border-primary-700/15 p-4 transition-all duration-300 hover:border-primary-700/30">
    <div className="flex items-center gap-2 text-grey-200/50">
      <span style={{ color }}>{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
    <p className="mt-2 text-2xl font-bold tabular-nums" style={{ color }}>
      {prefix}{fmt(Math.abs(value))}
      <span className="ml-1 text-sm font-normal text-grey-200/40">₽</span>
    </p>
  </div>
);
