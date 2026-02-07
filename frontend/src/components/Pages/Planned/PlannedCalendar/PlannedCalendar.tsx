import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { ContentHeader } from "../../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../../Layouts/ContentMain/ContentMain";

import Tippy from "@tippyjs/react";
import { addYears, eachMonthOfInterval, getDaysInMonth } from "date-fns";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import {
  getPlansApi,
  toggleOpenAddForm,
  type PlanDetailItem,
  type PlanItem,
} from "../../../../stores/planSlice/planSlice";
import { Button } from "../../../UI/Button/Button";
import { Loader } from "../../../UI/Loader/Loader";
import { SelectField } from "../../../UI/SelectField/SelectField";
import { AddPlanForm } from "../AddPlanForm/AddPlanForm";

interface ICalendarCard {
  day: number;
  date: Date;
  plansList: PlanItem[];
}

const CalendarCard: FC<ICalendarCard> = ({ day, date, plansList }) => {
  const currentDate = useMemo(() => {
    const d = new Date(date);
    d.setDate(day);
    return d;
  }, [day, date]);

  const findPlanDetail = useCallback(
    (plansDetails: PlanDetailItem[]) => {
      return plansDetails.find(
        (x) =>
          new Date(x.planDetailDatePay).getMonth() === currentDate.getMonth() &&
          new Date(x.planDetailDatePay).getFullYear() ===
            currentDate.getFullYear()
      );
    },
    [currentDate]
  );

  const findPayedDay = useCallback(
    (plansDetails: PlanDetailItem[]) => {
      return !plansDetails.find(
        (x) =>
          new Date(x.planDetailDatePay).getMonth() === currentDate.getMonth() &&
          new Date(x.planDetailDatePay).getFullYear() ===
            currentDate.getFullYear() &&
          new Date(x.planDetailDatePay).getDate() === currentDate.getDate()
      );
    },
    [currentDate]
  );

  // const countDayPrice = useCallback(
  //   (price: string, dateStart: string, dateEnd: string) => {
  //     const countDays =
  //       differenceInDays(new Date(dateEnd), new Date(dateStart)) + 1;

  //     return {
  //       price: Math.abs(
  //         Number(normalizeNumberInput(price)) / countDays
  //       ).toFixed(2),
  //       days: countDays,
  //     };
  //   },
  //   []
  // );

  const isShowMark = (PlanItem: PlanItem, currentDate: Date) => {
    const n = new Date();
    n.setDate(n.getDate() - 1);
    if (n < currentDate && currentDate <= new Date(PlanItem.planDate)) {
      return false;
    } else {
      return true;
    }
  };

  const isShowTippyItem = useCallback(
    (x: PlanItem) => {
      const n = new Date();
      n.setDate(n.getDate() - 1);
      if (n < currentDate && currentDate <= new Date(x.planDate)) {
        return true;
      } else {
        return false;
      }
    },
    [currentDate]
  );

  const isShowTippy = useMemo(() => {
    return !plansList.every((x) => isShowMark(x, currentDate));
  }, [plansList, currentDate]);

  return (
    <Tippy
      content={
        <div className="max-h-[100px] overflow-y-auto">
          {plansList.map((x) => {
            const currentDetailPlan = findPlanDetail(x.detailPlans);
            return (
              <div
                key={x.id}
                className="flex flex-col gap-1.5 text-left text-xs"
                style={{
                  display: isShowTippyItem(x) ? "block" : "none",
                }}
              >
                План:
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-[5px] w-[5px] rounded-full"
                    style={{
                      backgroundColor:
                        x.planColor != null ? x.planColor : "#6359e9",
                    }}
                  ></div>
                  <p>{x.planName}</p>
                </div>
                <p>Общая стоимость: {x.planPrice}</p>
                {currentDetailPlan && (
                  <p> Сумма на месяц: {currentDetailPlan?.planDetailPrice}</p>
                )}
                {currentDetailPlan && (
                  <p>
                    Статус:{" "}
                    {currentDetailPlan?.isComplete && currentDetailPlan ? (
                      <span className="font-bold text-green-500">
                        Отложено
                      </span>
                    ) : (
                      <span className="font-bold text-red-500">
                        Не отложено
                      </span>
                    )}
                  </p>
                )}
                {!findPayedDay(x.detailPlans) && (
                  <p className="font-bold text-green-500">День оплаты!</p>
                )}
                {/* <p>Сумма на день, округленная: {pr != null && pr.price}</p> */}
              </div>
            );
          })}
        </div>
      }
      className={[
        "app-surface",
        !isShowTippy ? "hidden" : "",
        "[&_.tippy-content]:w-[200px] [&_.tippy-content]:min-w-[200px] [&_.tippy-content]:max-w-[200px]",
        "[&_.tippy-content]:rounded-[10px] [&_.tippy-content]:bg-[#334949] [&_.tippy-content]:text-center",
        "[&_.tippy-arrow]:text-[#334949]",
      ]
        .filter(Boolean)
        .join(" ")}
      hideOnClick
    >
      <div
        className="relative flex min-h-[50px] cursor-pointer items-center justify-center bg-primary-900/25 p-2.5 text-grey-0 transition-colors hover:bg-primary-900/45"
        onClick={() => {
          console.log(plansList);
        }}
      >
        <span>{day}</span>
        <div className="absolute bottom-0 left-0 flex h-[7px] w-full items-center gap-0.5 bg-secondary-500/10">
          {plansList.map((x) => {
            return (
              <div
                key={x.id}
                className="h-[5px] w-[5px] rounded-full"
                style={{
                  backgroundColor: x.planColor != null ? x.planColor : "#6359e9",
                  display: isShowMark(x, currentDate) ? "none" : "block",
                  opacity: findPayedDay(x.detailPlans) ? 0.5 : 1,
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </Tippy>
  );
};

const months = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const getListYears = (): number[] => {
  const arr: number[] = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i <= currentYear + 50; i++) {
    arr.push(i);
  }
  return arr;
};

const isActiveDate = (date: string, currentDate: string) => {
  const nD = new Date(date);
  const cD = new Date(currentDate);
  if (
    nD.getFullYear() === cD.getFullYear() &&
    nD.getMonth() === cD.getMonth()
  ) {
    return true;
  }
  return false;
};

export const PlannedCalendar = () => {
  const [date, setDate] = useState(new Date().toISOString());
  const currentDate = new Date().toISOString();

  const yearsList = getListYears();
  const oldYear = new Date().setFullYear(new Date().getFullYear() - 1);
  const dispatch = useAppDispatch();
  const { plansList } = useAppSelector((st) => st.plans);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getPlansApi());
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [date, dispatch]);

  const daysMonths = useMemo(() => {
    const today = new Date(date);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const monthsArray = eachMonthOfInterval({
      start: startOfYear,
      end: endOfYear,
    }).map((x) => {
      return {
        days: getDaysInMonth(x),
        monthName: months[x.getMonth()],
        date: x,
      };
    });

    const daysCurrent = getDaysInMonth(today);

    return {
      current: {
        days: daysCurrent,
        monthName: months[today.getMonth()],
        date: today,
      },
      array: monthsArray,
    };
  }, [date]);

  const getDisabledPrev = useCallback(() => {
    const d = new Date(date).getFullYear();
    return d === new Date(oldYear).getFullYear();
  }, [date, oldYear]);

  return (
    <>
      <ContentHeader
        title="Планы и цели"
        subtitle={
          <>
            <div className="exp-tabs">
              <NavLink to="/planned-list">
                Список
              </NavLink>
              <NavLink to="/planned-calendar">
                Календарь
              </NavLink>
            </div>
          </>
        }
      >
        <div className="flex items-center gap-2">
          <div className="mx-auto flex max-w-max gap-2.5">
            <button
              onClick={() => {
                const newDate = addYears(new Date(date), -1);
                setDate(newDate.toISOString());
              }}
              className="cursor-pointer bg-primary-900/25 p-2.5 text-grey-0 transition-colors hover:bg-primary-900/45 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={getDisabledPrev()}
            >
              <GrFormPrevious />
            </button>

            <SelectField
              list={yearsList.map((x) => {
                return { label: String(x), value: String(x) };
              })}
              selected={{
                value: String(new Date(date).getFullYear()),
                label: String(new Date(date).getFullYear()),
              }}
              onChange={(x) => {
                console.log(x);
                const d = new Date(date);
                d.setFullYear(Number(x.value));
                setDate(d.toISOString());
              }}
            />
            <button
              onClick={() => {
                const newDate = addYears(new Date(date), 1);
                setDate(newDate.toISOString());
              }}
              className="cursor-pointer bg-primary-900/25 p-2.5 text-grey-0 transition-colors hover:bg-primary-900/45"
            >
              <GrFormNext />
            </button>
          </div>
          <Button onClick={() => dispatch(toggleOpenAddForm(true))}>+</Button>
        </div>
      </ContentHeader>

      <ContentMain>
        <div className="grid grid-cols-4 gap-10">
          {daysMonths.array.map((x, i) => {
            return (
              <div
                className={
                  isActiveDate(x.date.toISOString(), currentDate)
                    ? "[&_div:first-child]:font-bold [&_div:first-child]:text-brand-primary"
                    : ""
                }
                key={i}
              >
                <div className="mb-5 flex items-center justify-center uppercase">
                  {x.monthName}
                </div>
                <div className="mb-1 grid grid-cols-7 gap-1">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((dName) => {
                    return (
                      <div
                        key={dName}
                        className="flex min-h-5 items-center justify-end bg-primary-700/40 p-2.5 text-grey-0"
                      >
                        {dName}
                      </div>
                    );
                  })}
                </div>
                <div className="mb-1 grid grid-cols-7 gap-1">
                  {Array(x.days)
                    .fill(0)
                    .map((_, i) => i + 1)
                    .map((day) => {
                      return (
                        <CalendarCard
                          day={day}
                          key={day}
                          date={x.date}
                          plansList={plansList}
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </ContentMain>
      <AddPlanForm />
      <Loader isLoading={isLoading} />
    </>
  );
};
