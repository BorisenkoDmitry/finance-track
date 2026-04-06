import { useForm, type SubmitHandler } from "react-hook-form";
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
      className="flex max-w-[400px] flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField
        label="Текущий пароль"
        type="password"
        {...register("oldPassword", {
          required: "Пароль обязателен",
        })}
        errorText={errors.oldPassword?.message ?? null}
      />
      <InputField
        label="Новый пароль"
        type="password"
        {...register("newPassword", {
          required: "Пароль обязателен",
          minLength: {
            value: 6,
            message: "Минимум 6 символов",
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            message: "Заглавная, строчная буква и цифра",
          },
        })}
        errorText={errors.newPassword?.message ?? null}
      />
      <InputField
        label="Подтвердите новый пароль"
        type="password"
        {...register("newPasswordRepeat", {
          required: "Пароль обязателен",
          minLength: {
            value: 6,
            message: "Минимум 6 символов",
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            message: "Заглавная, строчная буква и цифра",
          },
        })}
        errorText={errors.newPasswordRepeat?.message ?? null}
      />
      <button
        type="submit"
        className="group relative mt-1 w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-grey-0 transition-all duration-300 hover:shadow-glow-md"
        style={{ background: "linear-gradient(135deg, #FF7582 0%, #C56C86 50%, #725A7A 100%)" }}
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="relative z-10">Изменить пароль</span>
      </button>
    </form>
  );
};
