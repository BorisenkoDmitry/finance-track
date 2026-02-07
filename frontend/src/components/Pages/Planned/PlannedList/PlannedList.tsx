import { NavLink } from "react-router-dom";
import { ContentHeader } from "../../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../../Layouts/ContentMain/ContentMain";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { useEffect } from "react";
import {
  getPlansApi,
  toggleOpenAddForm,
} from "../../../../stores/planSlice/planSlice";
import { Loader } from "../../../UI/Loader/Loader";
import { PlannedListTable } from "./PlannedListTable/PlannedListTable";
import { AddPlanForm } from "../AddPlanForm/AddPlanForm";
import { Button } from "../../../UI/Button/Button";
import { PlannedListCheck } from "./PlannedListCheck/PlannedListCheck";
import { PlannedShutDownPopup } from "./PlannedShutDownForm/PlannedShutDownForm";
import { ExpForm } from "../../ExpensesAndIncome/Expences/ExpForm/ExpForm";

export const PlannedList = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((st) => st.plans);
  useEffect(() => {
    dispatch(getPlansApi());
  }, [dispatch]);
  return (
    <>
      <ContentHeader
        className="planned"
        title="Планы и цели"
        subtitle={
          <>
            <div className="exp-tabs">
              <NavLink to="/planned-list">Список</NavLink>
              <NavLink to="/planned-calendar">Календарь</NavLink>
            </div>
          </>
        }
      >
        {" "}
        <Button onClick={() => dispatch(toggleOpenAddForm(true))}>+</Button>
      </ContentHeader>
      <ContentMain>
        <PlannedListTable />
      </ContentMain>
      <AddPlanForm />
      <ExpForm />
      <PlannedListCheck />
      <PlannedShutDownPopup />
      <Loader isLoading={isLoading} />
    </>
  );
};
