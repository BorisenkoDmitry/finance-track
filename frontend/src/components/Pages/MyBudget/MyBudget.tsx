import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import {
  setFilterType,
  setToggleForm,
} from "../../../stores/budgetSlice/myBudgetSlice";
import { TypeCatalog } from "../../../stores/catalogSlice/catalogsSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { Button } from "../../UI/Button/Button";
import { Loader } from "../../UI/Loader/Loader";
import { BudgetConfirm } from "./budgetConfirm/budgetConfirm";
import { BudgetFilter } from "./budgetFilter/BudgetFilter";
import { BudgetForm } from "./budgetForm/BudgetForm";
import { BudgetTable } from "./budgetTable/budgetTable";

export const MyBudget = () => {
  const {
    isOpenForm: isOpen,
    isLoading,
    filters: { type },
  } = useAppSelector((state) => state.budget);
  const dispatch = useAppDispatch();
  const addBudget = () => {
    dispatch(setToggleForm(true));
  };

  return (
    <>
      <ContentHeader
        dateOn={{
          isMonth: true,
          isYear: true,
        }}
        title="Мой бюджет"
        subtitle={
          <>
            <p>
              Ваш финансовый план по расходам и доходам в рамках каждой
              категории
            </p>
            <div className="exp-tabs mt-8">
              <button
                type="button"
                data-active={type === 5}
                aria-pressed={type === 5}
                onClick={() => dispatch(setFilterType(5))}
              >
                Все
              </button>
              <button
                type="button"
                data-active={type === TypeCatalog.exp}
                aria-pressed={type === TypeCatalog.exp}
                onClick={() => dispatch(setFilterType(TypeCatalog.exp))}
              >
                Расходы
              </button>
              <button
                type="button"
                data-active={type === TypeCatalog.inc}
                aria-pressed={type === TypeCatalog.inc}
                onClick={() => dispatch(setFilterType(TypeCatalog.inc))}
              >
                Доходы
              </button>
            </div>
          </>
        }
      >
        <Button onClick={() => addBudget()}>+</Button>
      </ContentHeader>
      <ContentMain>
        <BudgetFilter />
        <BudgetTable />
        <Loader isLoading={isLoading} />
        <BudgetForm
          isOpen={isOpen}
          onClose={() => dispatch(setToggleForm(false))}
        />
        <BudgetConfirm />
      </ContentMain>
    </>
  );
};
