import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppSelector } from "../../../../hooks/storeHook";
import type { FinanceAnaliticIncExpResponse } from "../../../../stores/financeSlice/financeSlice";
import { Loader } from "../../../UI/Loader/Loader";

export const IncAnalitic = () => {
  const { financeExpIncResp: data, isLoadingfinanceExpIncResp: isLoading } =
    useAppSelector((st) => st.finance);
  function combineFinanceData(resp: FinanceAnaliticIncExpResponse): {
    month: string;
    exp: string;
    budget: string;
    inc: string;
  }[] {
    const exps = resp.expsMonthly;
    const bds = resp.budgetsMonthly;
    const incs = resp.incsMonthly;

    // Предполагаем одинаковую длину массивов и соответствие по индексу дня
    const len = Math.min(exps.length, bds.length);

    const result: {
      month: string;
      exp: string;
      budget: string;
      inc: string;
    }[] = [];

    for (let i = 0; i < len; i++) {
      const e = exps[i];
      const b = bds[i];
      const c = incs[i];

      result.push({
        month: (e.month === b.month ? e.month : "") as string,
        exp: e.total,
        budget: b.total,
        inc: c.total,
      });
    }

    return result;
  }
  if (data === null) return <div>Данных нету</div>;

  return (
    <>
      <AreaChart
        width={"100%"}
        height={230}
        data={combineFinanceData(data)}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid strokeDasharray="2" />
        <Tooltip
          content={(c) => {
            if (c.payload.length > 0) {
              return (
                <div className="app-surface p-3 text-sm">
                  <p>
                    <span style={{ color: "#ebb70dff" }}>Бюджет доходов:</span>{" "}
                    {c.payload[1].payload.budget}
                  </p>
                  <p>
                    <span style={{ color: "#95f1fdff" }}>
                      Фактические доходы:
                    </span>{" "}
                    {c.payload[1].payload.inc}
                  </p>
                  <p>
                    <span style={{ color: "#f87eeeff" }}>
                      Фактические расходы:
                    </span>{" "}
                    {c.payload[1].payload.exp}
                  </p>
                </div>
              );
            }
          }}
        />

        <Area
          type="monotone"
          dataKey="budget"
          stroke={"#ebb70dff"}
          fillOpacity={0.5}
          fill={"#ebb70dff"}
        />

        <Area
          type="monotone"
          dataKey="inc"
          stroke={"#95f1fdff"}
          fillOpacity={0.4}
          fill={"#95f1fdff"}
        />
        <Area
          type="monotone"
          dataKey="exp"
          stroke={"#f87eeeff"}
          fillOpacity={0.67}
          fill={"#f87eeeff"}
        />
      </AreaChart>
      <Loader isLoading={isLoading} />
    </>
  );
};
