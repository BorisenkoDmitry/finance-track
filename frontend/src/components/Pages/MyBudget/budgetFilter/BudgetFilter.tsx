import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { setChoosed } from "../../../../stores/budgetSlice/myBudgetSlice";
import { createBudgetsApi } from "../../../../stores/budgetSlice/myBudgetThunks";
import { Button } from "../../../UI/Button/Button";
import { DateField } from "../../../UI/DateField/DateField";

export const BudgetFilter = () => {
  const { chooseList } = useAppSelector((state) => state.budget);
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date>(new Date());
  const selectedCount = chooseList.length;
  const isDisabled = selectedCount === 0;
  const year = date.getFullYear();

  const monthName = useMemo(() => {
    const arr = [
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
    return arr[date.getMonth()];
  }, [date]);

  const saveBudgets = () => {
    Promise.all(
      chooseList.map((choose) => {
        return dispatch(
          createBudgetsApi({ ...choose, dateCreated: date.toISOString() })
        );
      })
    ).finally(() => {
      dispatch(setChoosed(null));
      toast.success("Бюджет успешно перенесён");
    });
  };
  return (
    <div className="sticky top-0 z-30 mb-3">
      <div className="app-surface-strong flex flex-wrap items-center gap-4 p-4">
        <div className="min-w-[240px]">
          <div className="text-sm font-semibold text-grey-0">Перенос бюджета</div>
          <div className="mt-1 text-xs text-grey-200/75">
            {isDisabled ? (
              <span>Выберите строки в таблице, чтобы перенести их в другой месяц.</span>
            ) : (
              <span>
                Выбрано: <span className="text-secondary-500 font-semibold">{selectedCount}</span>
              </span>
            )}
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-primary-700/40 bg-primary-900/25 p-2 backdrop-blur">
            <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-grey-200/70">
              Месяц
            </div>
            <div className="w-[132px]">
              <DateField
                selected={date}
                onChange={(next) => setDate(next)}
                isMonth
                disabled={isDisabled}
              />
            </div>
          </div>

          <Button onClick={saveBudgets} disabled={isDisabled} theme="light-green">
            Перенести в {monthName} {year}
          </Button>
        </div>
      </div>
    </div>
  );
};
