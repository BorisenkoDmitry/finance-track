import { NavLink } from "react-router-dom";
import { InputField } from "../../../UI/Input/Input";
import { Button } from "../../../UI/Button/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "../../../../hooks/storeHook";
import { loginApi } from "../../../../stores/userSlice";

interface LoginFieldsForm {
  email: string;
  password: string;
}

export const Login = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFieldsForm>();

  const onSubmit: SubmitHandler<LoginFieldsForm> = (data) => {
    dispatch(loginApi(data)).finally(() => {
      reset();
    });
  };

  return (
    <form
      className="grid w-full max-w-[400px] grid-cols-2 gap-x-5 gap-y-2.5 overflow-auto p-1.5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField
        classNameField="col-span-2"
        label="Почта"
        type="email"
        placeholder="..."
        errorText={errors.email?.message ? "Почта введена не корректно" : null}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            message: "Invalid email address",
          },
        })}
      />
      <InputField
        classNameField="col-span-2"
        label="Пароль"
        type="password"
        placeholder="..."
        errorText={errors.password?.message ? errors.password.message : null}
        {...register("password", {
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
      />
      <div className="col-span-2 flex flex-col items-center gap-4 p-5">
        <Button className="w-full max-w-[200px]">Войти</Button>
        <NavLink
          className="text-xs text-brand-primary underline"
          to="/auth/registration"
        >
          Зарегистироваться
        </NavLink>
      </div>
    </form>
  );
};
