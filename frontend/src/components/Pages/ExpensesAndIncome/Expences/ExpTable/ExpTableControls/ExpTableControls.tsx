import type { FC } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { RiDeleteBin3Line } from "react-icons/ri";
import { LiaCartArrowDownSolid } from "react-icons/lia";

interface IExpTableControls {
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenProducts: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActiveProduct: boolean;
  isVisibleProduct: boolean;
}

export const ExpTableControls: FC<IExpTableControls> = ({
  onEdit,
  onDelete,
  onOpenProducts,
  isActiveProduct,
  isVisibleProduct,
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
      {isVisibleProduct && (
        <button
          onClick={onOpenProducts}
          className={
            [
              btnBase,
              "w-[27px] text-[35px]",
              isActiveProduct ? "bg-[#333333] text-[#ecf8f2]" : "",
            ]
              .filter(Boolean)
              .join(" ")
          }
        >
          <LiaCartArrowDownSolid />
        </button>
      )}
    </div>
  );
};
