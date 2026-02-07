import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../UI/Button/Button";
import { InputField } from "../../../UI/Input/Input";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { changePassword, resetIsChanged } from "../../../../stores/userSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface ISetFormFields {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

export const SettingsFormPassword = () => {
  const dispatch = useAppDispatch();
  const { isChangedPassword } = useAppSelector((st) => st.user);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ISetFormFields>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
    },
  });

  useEffect(() => {
    if (isChangedPassword) {
      toast.success("Пароль успешно изменён!");
      reset();
      setTimeout(() => {
        dispatch(resetIsChanged());
      }, 500);
    }
  }, [isChangedPassword, reset, dispatch]);

  const onSubmit: SubmitHandler<ISetFormFields> = (data) => {
    dispatch(changePassword(data));
  };
  return (
    <form
      className="mt-8 flex max-w-[300px] flex-col gap-4 p-1.5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField
        label="Текущий пароль"
        type="password"
        {...register("oldPassword", {
          required: "Пароль обязателен",
        })}
        errorText={
          errors.oldPassword?.message ? errors.oldPassword.message : null
        }
      />
      <InputField
        label="Новый пароль"
        type="password"
        {...register("newPassword", {
          required: "Пароль обязателен",
          minLength: {
            value: 6,
            message: "Пароль должен содержать не менее 6 символов",
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            message:
              "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру",
          },
        })}
        errorText={
          errors.newPassword?.message ? errors.newPassword.message : null
        }
      />
      <InputField
        label="Подтвердите новый пароль"
        type="password"
        {...register("newPasswordRepeat", {
          required: "Пароль обязателен",
          minLength: {
            value: 6,
            message: "Пароль должен содержать не менее 6 символов",
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            message:
              "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру",
          },
        })}
        errorText={
          errors.newPasswordRepeat?.message
            ? errors.newPasswordRepeat.message
            : null
        }
      />
      <Button>Сохранить</Button>
    </form>
  );
};
