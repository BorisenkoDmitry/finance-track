import type { FC } from "react";
import { Popup } from "../../Layouts/Popup/Popup";
import { Button } from "../Button/Button";
import { createPortal } from "react-dom";

interface IConfirm {
  onClose: () => void;
  onSuccess: () => void;
  onCancel: () => void;
  text: string;
}

export const Confirm: FC<IConfirm> = ({
  onClose,
  onSuccess,
  onCancel,
  text,
}) => {
  return createPortal(
    <Popup onClose={onClose} wide={400}>
      <div className="flex flex-col items-center gap-10">
        <h3 className="text-center text-[25px] leading-[1.3]">{text}</h3>
        <div className="flex w-full gap-2.5">
          <Button
            className="flex-1"
            theme="light-green"
            onClick={() => onSuccess()}
          >
            Да
          </Button>
          <Button className="flex-1" onClick={() => onCancel()}>
            Нет
          </Button>
        </div>
      </div>
    </Popup>,
    document.body
  );
};
