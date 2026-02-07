import src from "../../../../assets/images/card-1.jpg";
import src2 from "../../../../assets/images/card-2.jpg";
import { Button } from "../../../UI/Button/Button";

export const CardsPay = () => {
  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-4">
        <img src={src} width={300} height={300} />
        <Button theme="light-green">
          Подписаться
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <img src={src2} width={300} height={300} />
        <Button theme="light-green">
          Подписаться
        </Button>
      </div>
    </div>
  );
};
