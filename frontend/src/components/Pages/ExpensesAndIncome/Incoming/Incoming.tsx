// import { IncConfirm } from "./IncCofirm/IncConfirm";
import { useAppSelector } from "../../../../hooks/storeHook";
import { Loader } from "../../../UI/Loader/Loader";
import { IncConfirm } from "./IncCofirm/IncConfirm";
import { IncForm } from "./IncForm/IncForm";
import { IncFilters } from "./IncTable/IncFilter/IncFilter";
import { IncTable } from "./IncTable/IncTable";
// import { IncTable } from "./IncTable/IncTable";

export const IncContent = () => {
  const isLoading = useAppSelector(state => state.Inc.isLoadingTable)
  return (
    <>
      <IncFilters />
      <IncTable />
      <IncForm />
      <IncConfirm />
      <Loader isLoading={isLoading}/>
    </>
  );
};
