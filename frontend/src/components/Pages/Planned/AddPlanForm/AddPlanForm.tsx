import { HexColorPicker } from "react-colorful";
import { createPortal } from "react-dom";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import {
  createPlansApi,
  getPlansApi,
  toggleOpenAddForm,
} from "../../../../stores/planSlice/planSlice";
import { Popup } from "../../../Layouts/Popup/Popup";
import { Button } from "../../../UI/Button/Button";
import { DateField } from "../../../UI/DateField/DateField";
import { InputField } from "../../../UI/Input/Input";
import { TextAreaField } from "../../../UI/TextArea/TextArea";
import { FieldWrapper } from "../../../Wrappers/FieldWrapper/FieldWrapper";

type DataFormPlanAdd = {
  price: string;
  date: Date;
  descr: string;
  color: string;
};

export const AddPlanForm = () => {
  const { isOpenAddForm } = useAppSelector((st) => st.plans);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DataFormPlanAdd>({
    defaultValues: {
      price: "0",
      date: new Date(),
      descr: "",
      color: "#000",
    },
  });
  const onSubmit: SubmitHandler<DataFormPlanAdd> = (data) => {
    dispatch(
      createPlansApi({
        planDate: data.date,
        planName: data.descr,
        planPrice: data.price,
        planColor: data.color,
      })
    ).finally(() => {
      reset();
      dispatch(getPlansApi());
      dispatch(toggleOpenAddForm(false));
    });
  };
  const validatePrice = () => {
    if (errors.price?.type === "required") {
      return "Поле имя пустое";
    }
    console.log(errors.price);
    if (errors.price?.type === "validate") {
      return errors.price?.message;
    }
  };
  if (!isOpenAddForm) return null;
  return createPortal(
    <Popup
      onClose={() => {
        reset();
        dispatch(toggleOpenAddForm(false));
      }}
      wide={600}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Введите стоимость покупки"
          type="text"
          placeholder="..."
          errorText={validatePrice()}
          {...register("price", {
            required: true,
            validate: (v) => {
              const num = parseFloat(v);
              // Проверяем, является ли значение числом и отрицательным
              if (!isNaN(num) && num < 0) {
                return "Значение не может быть отрицательным";
              }
            },
          })}
        />
        <TextAreaField
          label="Описание покупки"
          errorText={errors.descr?.type === "required" ? "Поле пустое" : null}
          placeholder="На что будете откладывать?"
          {...register("descr", {
            required: true,
          })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DateField
                isTimeOn
                direction="column"
                label="Запланированная дата покупки"
                selected={field.value}
                onChange={(date) => {
                  field.onChange(date);
                }}
              />
            )}
          />
          <FieldWrapper tagWrapp="div" label="Цвет запланированной покупки">
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <HexColorPicker
                  color={field.value}
                  onChange={(x) => {
                    field.onChange(x);
                  }}
                />
              )}
            />
          </FieldWrapper>
        </div>
        {/* <div className="group group--row">
          <RadioField
            label="Откладывать с текущего месяца"
            checked={!isNextMonth}
            onChange={() => setIsNextMonth(false)}
          />
          <RadioField
            label="Откладывать со следующего месяца"
            checked={isNextMonth}
            onChange={() => setIsNextMonth(true)}
          />
        </div> */}
        <Button type="submit">Добавить запланированную покупку</Button>
      </form>
    </Popup>,
    document.body
  );
};
