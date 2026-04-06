import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/storeHook";
import { setIsNewExp, toggleExpForm } from "../../../stores/expSlice/expSlice";
import { toggleIncForm } from "../../../stores/incSlice/incSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { FloatingAction } from "../../UI/FloatingAction/FloatingAction";
import { Sparkles, Table2, LayoutList } from "lucide-react";
import { ExpIncFilters } from "./ExpIncFilters";

type ViewMode = "table" | "cards";

export const Expenses = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [pathname, setPathName] = useState<"spend" | "income">("spend");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  useEffect(() => {
    setPathName(
      location.pathname
        .trim()
        .split("/")
        .filter((x) => x.length > 0)[1] as "spend" | "income"
    );
  }, [location]);

  const onClickAdd = () => {
    if (pathname === "spend") {
      dispatch(setIsNewExp(true));
      dispatch(toggleExpForm(true));
    } else {
      dispatch(toggleIncForm(true));
    }
  };

  return (
    <>
      <ContentHeader
        title="Траты и доходы"
        dateOn={{ isMonth: true, isYear: true }}
        subtitle={
          <p className="text-grey-200/60 hidden sm:block">Учёт расходов и доходов по категориям</p>
        }
      >
        {/* Toolbar */}
        <div className="flex items-center gap-1 rounded-xl border border-primary-700/20 bg-primary-800/30 p-0.5">
          <ExpIncFilters mode={pathname} />
          <button
            onClick={() => setViewMode("table")}
            className={["flex h-7 w-7 items-center justify-center rounded-lg transition-all", viewMode === "table" ? "bg-primary-500/20 text-primary-400" : "text-grey-200/40 hover:text-grey-200/70"].join(" ")}
          ><Table2 size={15} /></button>
          <button
            onClick={() => setViewMode("cards")}
            className={["flex h-7 w-7 items-center justify-center rounded-lg transition-all", viewMode === "cards" ? "bg-primary-500/20 text-primary-400" : "text-grey-200/40 hover:text-grey-200/70"].join(" ")}
          ><LayoutList size={15} /></button>
        </div>
      </ContentHeader>

      <ContentMain>
        {/* Tabs + Add button */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-2xl border border-primary-700/20 bg-primary-800/20 p-1">
            <NavLink
              to="./spend"
              className={({ isActive }) =>
                ["rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2",
                  isActive ? "bg-primary-500/15 text-grey-0 shadow-glow-sm" : "text-grey-200/50 hover:text-grey-200/80",
                ].join(" ")
              }
            >
              Расходы
            </NavLink>
            <NavLink
              to="./income"
              className={({ isActive }) =>
                ["rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2",
                  isActive ? "bg-primary-500/15 text-grey-0 shadow-glow-sm" : "text-grey-200/50 hover:text-grey-200/80",
                ].join(" ")
              }
            >
              Доходы
            </NavLink>
          </div>

          {/* Desktop add button */}
          <button
            onClick={onClickAdd}
            className="group relative ml-auto hidden items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-grey-0 transition-all duration-300 hover:shadow-glow-md lg:flex"
            style={{
              background: pathname === "spend"
                ? "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)"
                : "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #355C7D 100%)",
            }}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Sparkles size={15} className="relative z-10" />
            <span className="relative z-10">
              {pathname === "spend" ? "Добавить расход" : "Добавить доход"}
            </span>
          </button>
        </div>

        <Outlet context={{ viewMode }} />
      </ContentMain>

      {/* Mobile FAB */}
      <FloatingAction
        onClick={onClickAdd}
        icon={<Sparkles size={16} />}
        label={pathname === "spend" ? "Расход" : "Доход"}
        gradient={
          pathname === "spend"
            ? "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)"
            : "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #355C7D 100%)"
        }
      />
    </>
  );
};
