import {
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useAppSelector } from "../../../../hooks/storeHook";
import { type FinanceAnaliticResponse } from "../../../../stores/financeSlice/financeSlice";
import { monthsListGenitiveСase } from "../../../../utils/constants";
import { Loader } from "../../../UI/Loader/Loader";

type CombinedPoint = {
  day: number;
  exp: number;
  budget: number;
};


function parseNumberFromString(s: string): number {
  // Добавьте нужную вам логику парсинга (например, просто числовой parseFloat)
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}

function combineFinanceData(resp: FinanceAnaliticResponse): CombinedPoint[] {
  const exps = resp.exps.financeAnalitic;
  const bds = resp.budgets.financeAnalitic;

  // Предполагаем одинаковую длину массивов и соответствие по индексу дня
  const len = Math.min(exps.length, bds.length);

  const result: CombinedPoint[] = [];

  for (let i = 0; i < len; i++) {
    const e = exps[i];
    const b = bds[i];

    result.push({
      day: (e.day === b.day ? e.day : 0) as number,
      exp: parseNumberFromString(e.total),
      budget: parseNumberFromString(b.total),
    });
  }

  return result;
}

export const ExpFinance = () => {
  const { start } = useAppSelector((state) => state.global.periodDate);
  const { financeAnaliticResp, isLoadingFinanceRem } = useAppSelector(
    (state) => state.finance
  );

  const CheckExpAndBudgets = (budgetsCount: number, expCount: number) => {
    console.log(budgetsCount, expCount);
    if (budgetsCount - expCount < 0) {
      return `Вы превысили ваш бюджет на ${Math.abs(
        budgetsCount - expCount
      ).toLocaleString()} P`;
    } else if (budgetsCount - expCount === 0) {
      return `Вы уложились в бюджет`;
    } else {
      return `Вы уложились в бюджет и сэкономили ${(
        budgetsCount - expCount
      ).toLocaleString()} P`;
    }
  };

  return (
    <div className="relative">
      <ul className="grid grid-cols-2 gap-5">
        {financeAnaliticResp?.map((x) => {
          return (
            <li
              key={x.catalogName}
              className="rounded-2xl border border-primary-500 p-5"
            >
              <div className="mb-5 text-[18px] font-bold text-primary-500">
                {x.catalogName}
              </div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <div
                  className="h-[10px] w-[10px] rounded-full"
                  style={{ backgroundColor: x.catalogColor ?? "#000" }}
                />
                Фактический показатель, общий:{" "}
                <span
                  className="font-bold"
                  style={{ color: x.catalogColor ?? "#000" }}
                >
                  {Math.floor(Number(x.exps.totalPeriodExp)).toLocaleString()}{` ₽`}
                </span>
              </div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <div
                  className="h-[10px] w-[10px] rounded-full bg-[#82ca9d]"
                />
                Бюджетный показатель, общий:{" "}
                <span className="font-bold text-[#82ca9d]">
                  {Math.floor(
                    Number(x.budgets.totalPeriodBudgets)
                  ).toLocaleString()}{` ₽`}
                </span>
              </div>
              <p className="mb-5 text-sm font-bold text-primary-500">
                {CheckExpAndBudgets(
                  Math.floor(Number(x.budgets.totalPeriodBudgets)) ?? 0,
                  Math.floor(Number(x.exps.totalPeriodExp)) ?? 0
                )}{` ₽`}
              </p>

              <AreaChart
                width={"100%"}
                height={230}
                data={combineFinanceData(x)}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="day" color="#bdbdbd"/>
                <YAxis color="#bdbdbd"/>
                {/* <CartesianGrid strokeDasharray="2" /> */}
                <Tooltip
                  content={(data) => {
                    if (data.payload.length > 0) {
                      const obj = {
                        date:
                          data.payload[1].payload.day +
                          ` ${monthsListGenitiveСase[new Date(start).getMonth()]} ${new Date(
                            start
                          ).getFullYear()} года`,
                        budget: data.payload[1].payload.budget,
                        exp: data.payload[1].payload.exp,
                      };
                      return (
                        <div className="rounded-[10px] bg-primary-900 p-4 text-sm text-grey-0">
                          <p>
                            <b>{obj.date}</b>
                          </p>
                          <p>Фактический расход за сутки: {obj.exp.toLocaleString()}{` ₽`}</p>
                          <p>Бюджет на расход за сутки: {obj.budget.toLocaleString()}{` ₽`}</p>
                        </div>
                      );
                    }
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="budget"
                  stroke={"#1d4c9b"}
                  fillOpacity={0.8}
                  fill={"#1d4c9b"}
                />
                <Area
                  type="monotone"
                  dataKey="exp"
                  stroke={x.catalogColor != null ? x.catalogColor : "#000"}
                  fillOpacity={0.4}
                  fill={x.catalogColor != null ? x.catalogColor : "#000"}
                />
              </AreaChart>
            </li>
          );
        })}
      </ul>
      <Loader isLoading={isLoadingFinanceRem} />
    </div>
  );
};
