import { NavLink } from "react-router-dom";
import { ContentHeader } from "../../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../../Layouts/ContentMain/ContentMain";
import { FloatingAction } from "../../../UI/FloatingAction/FloatingAction";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { useEffect } from "react";
import {
  getPlansApi,
  toggleOpenAddForm,
} from "../../../../stores/planSlice/planSlice";
import { Loader } from "../../../UI/Loader/Loader";
import { PlannedListTable } from "./PlannedListTable/PlannedListTable";
import { AddPlanForm } from "../AddPlanForm/AddPlanForm";
import { PlannedListCheck } from "./PlannedListCheck/PlannedListCheck";
import { PlannedShutDownPopup } from "./PlannedShutDownForm/PlannedShutDownForm";
import { ExpForm } from "../../ExpensesAndIncome/Expences/ExpForm/ExpForm";
import { Sparkles } from "lucide-react";

export const PlannedList = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((st) => st.plans);
  useEffect(() => {
    dispatch(getPlansApi());
  }, [dispatch]);

  return (
    <>
      <ContentHeader
        title="Планы и цели"
        subtitle={
          <p className="text-grey-200/60 hidden sm:block">Управление финансовыми целями</p>
        }
      />
      <ContentMain>
        {/* Tabs */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-2xl border border-primary-700/20 bg-primary-800/20 p-1">
            <NavLink
              to="/planned-list"
              className={({ isActive }) =>
                ["rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2",
                  isActive ? "bg-primary-500/15 text-grey-0 shadow-glow-sm" : "text-grey-200/50 hover:text-grey-200/80",
                ].join(" ")
              }
            >
              Список
            </NavLink>
            <NavLink
              to="/planned-calendar"
              className={({ isActive }) =>
                ["rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2",
                  isActive ? "bg-primary-500/15 text-grey-0 shadow-glow-sm" : "text-grey-200/50 hover:text-grey-200/80",
                ].join(" ")
              }
            >
              Календарь
            </NavLink>
          </div>

          {/* Desktop add */}
          <button
            onClick={() => dispatch(toggleOpenAddForm(true))}
            className="group relative ml-auto hidden items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-grey-0 transition-all duration-300 hover:shadow-glow-md lg:flex"
            style={{ background: "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)" }}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Sparkles size={15} className="relative z-10" />
            <span className="relative z-10">Добавить план</span>
          </button>
        </div>

        <PlannedListTable />
      </ContentMain>
      <AddPlanForm />
      <ExpForm />
      <PlannedListCheck />
      <PlannedShutDownPopup />
      <Loader isLoading={isLoading} />

      {/* Mobile FAB */}
      <FloatingAction
        onClick={() => dispatch(toggleOpenAddForm(true))}
        icon={<Sparkles size={16} />}
        label="План"
      />
    </>
  );
};
