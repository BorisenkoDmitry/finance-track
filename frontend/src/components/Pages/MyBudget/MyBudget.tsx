import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import {
  setFilterType,
  setToggleForm,
} from "../../../stores/budgetSlice/myBudgetSlice";
import { TypeCatalog } from "../../../stores/catalogSlice/catalogsSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { FloatingAction } from "../../UI/FloatingAction/FloatingAction";
import { Loader } from "../../UI/Loader/Loader";
import { BudgetConfirm } from "./budgetConfirm/budgetConfirm";
import { BudgetFilter } from "./budgetFilter/BudgetFilter";
import { BudgetForm } from "./budgetForm/BudgetForm";
import { BudgetTable } from "./budgetTable/budgetTable";
import { editBudget } from "../../../stores/budgetSlice/myBudgetSlice";
import { LayoutList, Table2, Sparkles } from "lucide-react";

type ViewMode = "table" | "cards";

export const MyBudget = () => {
  const {
    isOpenForm: isOpen,
    isLoading,
    filters: { type },
  } = useAppSelector((state) => state.budget);
  const dispatch = useAppDispatch();
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const tabs = [
    { id: 5, label: "Все" },
    { id: TypeCatalog.exp, label: "Расходы" },
    { id: TypeCatalog.inc, label: "Доходы" },
  ];

  const onAdd = () => {
    if (type !== 5) dispatch(editBudget({ key: "type", value: type }));
    dispatch(setToggleForm(true));
  };

  return (
    <>
      <ContentHeader
        dateOn={{ isMonth: true, isYear: true }}
        title="Мой бюджет"
        subtitle={
          <p className="text-grey-200/60 hidden sm:block">Финансовый план по категориям</p>
        }
      >
        {/* Toolbar */}
        <div className="flex items-center gap-1 rounded-xl border border-primary-700/20 bg-primary-800/30 p-0.5">
          <BudgetFilter />
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch(setFilterType(tab.id))}
                className={[
                  "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2",
                  type === tab.id
                    ? "bg-primary-500/15 text-grey-0 shadow-glow-sm"
                    : "text-grey-200/50 hover:text-grey-200/80",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Desktop add button */}
          <button
            onClick={onAdd}
            className="group relative ml-auto hidden items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-grey-0 transition-all duration-300 hover:shadow-glow-md lg:flex"
            style={{ background: "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)" }}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Sparkles size={15} className="relative z-10" />
            <span className="relative z-10">Добавить бюджет</span>
          </button>
        </div>

        <BudgetTable viewMode={viewMode} />
        <Loader isLoading={isLoading} />
        <BudgetForm isOpen={isOpen} onClose={() => dispatch(setToggleForm(false))} />
        <BudgetConfirm />
      </ContentMain>

      {/* Mobile FAB */}
      <FloatingAction onClick={onAdd} icon={<Sparkles size={16} />} label="Бюджет" />
    </>
  );
};
