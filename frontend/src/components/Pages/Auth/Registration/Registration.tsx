import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import InputMask from "react-input-mask";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../../../hooks/storeHook";
import { createUserApi } from "../../../../stores/userSlice";
import { Button } from "../../../UI/Button/Button";
import { InputField } from "../../../UI/Input/Input";

type RegFieldsForm = {
  name: string;
  surname: string;
  mail: string;
  phone: string;
  pass: string;
  repeatPass: string;
};

export const Registration = () => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<RegFieldsForm>({
    values: {
      mail: "dim-borisenk@yandex.ru",
      name: "Dsadas",
      surname: "Dasdasdas",
      pass: "Dd12345",
      repeatPass: "Dd12345",
      phone: "2312312312321312",
    },
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit: SubmitHandler<RegFieldsForm> = (data) => {
    dispatch(
      createUserApi({
        email: data.mail,
        name: data.name,
        password: data.pass,
        phone: data.phone,
        surname: data.surname,
      })
    );
  };
  const repeatPass = watch("repeatPass");
  return (
    <form
      className="grid w-full max-w-[400px] grid-cols-2 gap-x-5 gap-y-2.5 overflow-auto p-1.5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField
        classNameField="col-span-1"
        label="Имя"
        type="text"
        placeholder="..."
        errorText={errors.name?.type === "required" ? "Поле имя пустое" : null}
        {...register("name", { required: true })}
      />
      <InputField
        classNameField="col-span-1"
        label="Фамилия"
        type="text"
        placeholder="..."
        errorText={
          errors.surname?.type === "required" ? "Поле фамилия пустое" : null
        }
        {...register("surname", { required: true })}
      />
      <InputField
        classNameField="col-span-2"
        label="Почта"
        type="email"
        placeholder="user@yandex.ru"
        errorText={errors.mail?.message ? "Почта введена не корректно" : null}
        {...register("mail", {
          required: "Email is required",
          pattern: {
            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            message: "Invalid email address",
          },
        })}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <InputMask
            mask="+7 (999) 999-99-99"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          >
            {(inputProps) => (
              <InputField
                classNameField="col-span-2"
                label="Телефон"
                type="phone"
                placeholder="+7"
                {...inputProps}
                errorText={errors.phone?.message ? errors.phone.message : null}
              />
            )}
          </InputMask>
        )}
      />
      {/* <InputField
          classNameField="registration-auth__field registration-auth__field--col-2"
          label="Телефон"
          type="phone"
          placeholder="+7"
          errorText={errors.phone?.message ? errors.phone.message : null}
        />
      </InputMask> */}

      <InputField
        classNameField="col-span-1"
        label="Пароль"
        type="password"
        errorText={errors.pass?.message ? errors.pass.message : null}
        {...register("pass", {
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
      <InputField
        classNameField="col-span-1"
        label="Повторите пароль"
        type="password"
        errorText={errors.repeatPass?.message ? errors.repeatPass.message : null}
        {...register("repeatPass", {
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
          validate: (val) => val === repeatPass || "Пароли не совпадают",
        })}
      />
      {errors.repeatPass?.message && (
        <div className="col-span-2">
          <p className="text-xs text-red-500">{errors.repeatPass.message}</p>
        </div>
      )}
      <div className="col-span-2 flex flex-col gap-4 p-5 text-center">
        <Button>Зарегистрироваться</Button>
        <NavLink className="text-xs text-brand-primary underline" to="/auth/login">
          Войти
        </NavLink>
      </div>
    </form>
  );
};
