import { useOutletContext } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/storeHook";
import { Loader } from "../../../UI/Loader/Loader";
import { IncConfirm } from "./IncCofirm/IncConfirm";
import { IncForm } from "./IncForm/IncForm";
import { IncTable } from "./IncTable/IncTable";

export const IncContent = () => {
  const isLoading = useAppSelector(state => state.Inc.isLoadingTable);
  const { viewMode } = useOutletContext<{ viewMode: string }>();

  return (
    <>
      <IncTable viewMode={viewMode} />
      <IncForm />
      <IncConfirm />
      <Loader isLoading={isLoading}/>
    </>
  );
};
