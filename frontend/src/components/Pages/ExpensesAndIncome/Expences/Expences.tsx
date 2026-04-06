import { useOutletContext } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/storeHook";
import { Loader } from "../../../UI/Loader/Loader";
import { ExpConfirm } from "./ExpConfirm/ExpConfirm";
import { ExpForm } from "./ExpForm/ExpForm";
import { ExpTable } from "./ExpTable/ExpTable";

export const ExpContent = () => {
  const { isLoadingTable } = useAppSelector(state => state.expInc);
  const { viewMode } = useOutletContext<{ viewMode: string }>();

  return (
    <>
      <ExpTable viewMode={viewMode} />
      <ExpForm />
      <ExpConfirm />
      <Loader isLoading={isLoadingTable}/>
    </>
  );
};
