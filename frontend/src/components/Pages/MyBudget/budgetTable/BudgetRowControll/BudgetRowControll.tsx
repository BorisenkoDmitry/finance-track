import type { FC } from "react";
import { RiDeleteBin3Line, RiEdit2Line } from "react-icons/ri";

interface IBudgetTableControls {
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChecked: (v: boolean) => void;
  isChecked: boolean;
}

export const BudgetTableControls: FC<IBudgetTableControls> = ({
  onEdit,
  onDelete,
  onChecked,
  isChecked,
}) => {
  const iconBtnBase = "app-icon-btn h-9 w-9";
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className={iconBtnBase}
        aria-label="Редактировать"
      >
        <RiEdit2Line />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={[iconBtnBase, "hover:text-red-300"].join(" ")}
        aria-label="Удалить"
      >
        <RiDeleteBin3Line />
      </button>
      <input
        checked={isChecked}
        type="checkbox"
        className="h-4 w-4 cursor-pointer accent-secondary-500"
        onChange={(e) => onChecked(e.target.checked)}
        aria-label="Выбрать строку"
      />
    </div>
  );
};
