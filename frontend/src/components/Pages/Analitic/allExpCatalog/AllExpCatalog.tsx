import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  Sector,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { useAppSelector } from "../../../../hooks/storeHook";
import {
  monthsList,
  monthsListGenitiveСase,
} from "../../../../utils/constants";
import { consolidateByDay } from "../../../../utils/mergeAllExpGraphic";
import { CheckboxField } from "../../../UI/CheckboxField/CheckboxField";

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        style={{
          zIndex: 3,
        }}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        style={{
          fontSize: "12px",
        }}
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value.toLocaleString()} ₽`}</text>
      <text
        style={{
          fontSize: "12px",
        }}
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${Number(((percent ?? 1) * 100).toFixed(2)).toLocaleString()}%)`}
      </text>
    </g>
  );
};

export const AllExpCatalog = () => {
  const { financeAnaliticResp } = useAppSelector((state) => state.finance);

  const [checkedVisible, setVisible] = useState(
    financeAnaliticResp.map((x) => x.catalogName)
  );
  const { start } = useAppSelector((state) => state.global.periodDate);

  const dataPraphic = useMemo(() => {
    const n = financeAnaliticResp.map((x) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arr: any[] = [];
      x.exps.financeAnalitic.forEach((t) => {
        arr.push({
          [x.catalogName]: {
            total: t.total,
          },
          day: t.day,
        });
      });
      return arr;
    });
    const pie = financeAnaliticResp.map((x) => {
      return {
        value: Number(x.exps.totalPeriodExp),
        name: x.catalogName,
        color: x.catalogColor,
      };
    });
    console.log(pie);
    return {
      line: consolidateByDay(n),
      pie,
    };
  }, [financeAnaliticResp]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-8">
        <div className="mb-8 flex flex-col justify-between gap-2">
          {financeAnaliticResp.map((x, i) => {
            return (
              <CheckboxField
                key={i}
                checked={checkedVisible.includes(x.catalogName)}
                onChange={() => {
                  if (checkedVisible.includes(x.catalogName)) {
                    setVisible(
                      checkedVisible.filter((item) => item != x.catalogName)
                    );
                  } else {
                    setVisible([...checkedVisible, x.catalogName]);
                  }
                }}
                label={x.catalogName}
                color={x.catalogColor}
              />
            );
          })}
        </div>
        <AreaChart
          width={"100%"}
          height={430}
          data={dataPraphic.line}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" />
          <YAxis />

          <Tooltip
            content={(x) => {
              return (
                <div className="app-surface p-5">
                  {x.payload[0]?.payload &&
                    Object.entries(x.payload[0]?.payload).map(([k, v], i) => {
                      if (k === "day") {
                        return (
                          <div
                            className="mb-1 font-bold"
                            key={i}
                          >
                            {JSON.stringify(v)}{" "}
                            {monthsListGenitiveСase[new Date(start).getMonth()]}{" "}
                            {new Date(start).getFullYear()} года:
                          </div>
                        );
                      }
                      return (
                        <div
                          style={{
                            color: financeAnaliticResp.filter(
                              (x) => x.catalogName === k
                            )[0]?.catalogColor,
                          }}
                          key={i}
                        >
                          {k}:{" "}
                          {Number(
                            (v as { total?: number }).total
                          ).toLocaleString()}
                          {` ₽`}
                        </div>
                      );
                    })}
                </div>
              );
            }}
          />
          {financeAnaliticResp.map((x, i) => {
            if (checkedVisible.includes(x.catalogName)) {
              return (
                <Area
                  key={i}
                  type="monotone"
                  dataKey={`${x.catalogName}.total`}
                  stroke={x.catalogColor != null ? x.catalogColor : "#8884d8"}
                  strokeWidth={2}
                  fillOpacity={0.3}
                  fill={"transparent"}
                />
              );
            }
          })}
        </AreaChart>
      </div>
      <div className="mx-auto mt-8 flex max-w-[800px] flex-col items-center justify-center text-center">
        <p className="text-xl">
          Сумма расходов за {monthsList[new Date(start).getMonth()]} по
          категориям
        </p>
        <PieChart
          style={{
            width: "100%",
            maxWidth: "600px",
            maxHeight: "80vh",
            aspectRatio: 1,
          }}
          responsive
        >
          <Pie
            data={dataPraphic.pie}
            activeShape={renderActiveShape}
            fill="#8884d8"
            dataKey="value"
            // isAnimationActive={isAnimationActive}
          >
            {dataPraphic.pie.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
            <Tooltip
              content={(v) => {
                return (
                  <div className="app-surface p-2">
                    {v.payload[0]?.name}
                  </div>
                );
              }}
              defaultIndex={0}
            />
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};
