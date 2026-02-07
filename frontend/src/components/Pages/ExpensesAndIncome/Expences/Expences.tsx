import { useAppSelector } from "../../../../hooks/storeHook";
import { Loader } from "../../../UI/Loader/Loader";
import { ExpConfirm } from "./ExpConfirm/ExpConfirm";
import { ExpForm } from "./ExpForm/ExpForm";
import { ExpFilters } from "./ExpTable/ExpFilters/ExpFilters";
import { ExpTable } from "./ExpTable/ExpTable";

export const ExpContent = () => {
  const { isLoadingTable } = useAppSelector(state => state.expInc)

  return (
    <>
      <ExpFilters />
      <ExpTable />
      <ExpForm />
      <ExpConfirm />
      <Loader isLoading={isLoadingTable}/>
    </>
  );
};
