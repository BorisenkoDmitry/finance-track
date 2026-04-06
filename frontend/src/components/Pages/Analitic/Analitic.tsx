import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import {
  getFinanceAnaliticExp,
  getFinanceAnaliticIncExp,
  getFinanceRemaining,
} from "../../../stores/financeSlice/financeSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { Loader } from "../../UI/Loader/Loader";
import { setTypeDate } from "../../../stores/globalSlice";

export const Analitic = () => {
  const { periodDate } = useAppSelector((state) => state.global);
  const list = useAppSelector((state) => state.catalogs.categoryExpList);
  const dispatch = useAppDispatch();
  const [type, setType] = useState(0);

  useEffect(() => {
    dispatch(getFinanceRemaining());
    if (type === 0 || type === 1) {
      dispatch(
        getFinanceAnaliticExp({
          catalogIds: list.map((x) => x.value),
          dateStart: periodDate.start,
          dateEnd: periodDate.end,
        })
      );
    } else {
      dispatch(
        getFinanceAnaliticIncExp({
          dateEnd: periodDate.end,
          dateStart: periodDate.start,
        })
      );
    }
  }, [list, dispatch, periodDate, type]);

  useEffect(() => {
    dispatch(setTypeDate(type === 0 || type === 1 ? "months" : "years"));
  }, [type, dispatch]);

  return (
    <>
      <ContentHeader
        title="Аналитика"
        dateOn={{ isMonth: true, isYear: true }}
        isHideDateControlls
        subtitle={<p className="text-grey-200/60">Финансовая статистика и графики</p>}
      />
      <ContentMain>
        {/* Tabs */}
        <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max items-center gap-1 rounded-2xl border border-primary-700/20 bg-primary-800/20 p-1 sm:w-auto">
            {[
              { to: "exp-budget", label: "Расходы vs Бюджет", t: 0 },
              { to: "all-exp-catalog", label: "Категории", t: 1 },
              { to: "all-inc", label: "Доходы vs Расходы", t: 2 },
            ].map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                onClick={() => setType(tab.t)}
                className={({ isActive }) =>
                  [
                    "whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2",
                    isActive
                      ? "bg-primary-500/15 text-grey-0 shadow-glow-sm"
                      : "text-grey-200/50 hover:text-grey-200/80",
                  ].join(" ")
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
        <Outlet />
      </ContentMain>
      <Loader isLoading={false} />
    </>
  );
};
