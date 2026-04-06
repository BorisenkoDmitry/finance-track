import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { setChoosed } from "../../../../stores/budgetSlice/myBudgetSlice";
import { createBudgetsApi } from "../../../../stores/budgetSlice/myBudgetThunks";
import { Button } from "../../../UI/Button/Button";
import { DateField } from "../../../UI/DateField/DateField";
import { ArrowRightLeft, X } from "lucide-react";

export const BudgetFilter = () => {
  const { chooseList } = useAppSelector((state) => state.budget);
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const selectedCount = chooseList.length;
  const isDisabled = selectedCount === 0;

  const monthName = useMemo(() => {
    const arr = ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"];
    return arr[date.getMonth()];
  }, [date]);

  const saveBudgets = () => {
    Promise.all(
      chooseList.map((choose) =>
        dispatch(createBudgetsApi({ ...choose, dateCreated: date.toISOString() }))
      )
    ).finally(() => {
      dispatch(setChoosed(null));
      toast.success("Бюджет успешно перенесён");
      setIsOpen(false);
    });
  };

  return (
    <>
      {/* Trigger icon — top right area, rendered by parent via CSS position */}
      <div className="group relative inline-flex">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-grey-200/40 transition-all duration-200 hover:bg-accent-500/15 hover:text-accent-400"
        >
          <ArrowRightLeft size={15} />
        </button>
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary-800 px-2.5 py-1 text-[10px] text-grey-200/70 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Перенос бюджета
        </span>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-primary-800/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl border border-primary-700/25 bg-bg-menu/98 p-6 shadow-xl animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400">
                  <ArrowRightLeft size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-grey-0">Перенос бюджета</h3>
                  <p className="text-[10px] text-grey-200/50">Копирование записей в другой месяц</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="app-icon-btn h-8 w-8">
                <X size={15} />
              </button>
            </div>

            {/* Status */}
            <div className="mb-4 rounded-xl border border-primary-700/15 bg-primary-800/30 p-3">
              {isDisabled ? (
                <p className="text-xs text-grey-200/50">
                  Выберите строки в таблице (чекбоксы), затем откройте это окно для переноса.
                </p>
              ) : (
                <p className="text-xs text-grey-200/70">
                  Выбрано: <span className="font-semibold text-accent-400">{selectedCount}</span> {selectedCount === 1 ? "запись" : selectedCount < 5 ? "записи" : "записей"}
                </p>
              )}
            </div>

            {/* Date picker */}
            <div className="mb-5">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-grey-200/40">
                Целевой месяц
              </label>
              <div className="w-full">
                <DateField
                  selected={date}
                  onChange={(next) => setDate(next)}
                  isMonth
                  disabled={isDisabled}
                />
              </div>
            </div>

            {/* Action */}
            <Button
              onClick={saveBudgets}
              disabled={isDisabled}
              theme="light-green"
              className="w-full justify-center"
            >
              Перенести в {monthName} {date.getFullYear()}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
