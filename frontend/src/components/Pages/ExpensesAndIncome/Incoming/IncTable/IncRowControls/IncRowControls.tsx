import type { FC } from "react";
import { RiDeleteBin3Line, RiEdit2Line } from "react-icons/ri";

interface IExpTableControls {
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const IncTableControls: FC<IExpTableControls> = ({
  onEdit,
  onDelete,
}) => {
  const btnBase =
    "flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-md p-0.5 text-[18px] transition-colors hover:bg-[#333333] hover:text-[#ecf8f2]";
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onEdit}
        className={btnBase}
      >
        <RiEdit2Line />
      </button>
      <button
        onClick={onDelete}
        className={btnBase}
      >
        <RiDeleteBin3Line />
      </button>
    </div>
  );
};
