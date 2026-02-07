import { useEffect } from "react";
import { TbUsers } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { getFinanceRemaining } from "../../../../stores/financeSlice/financeSlice";
import { logoutApi } from "../../../../stores/userSlice";

export const UserView = () => {
  const financeCount = useAppSelector(
    (state) => state.finance.remainingFinance
  );

  const user = useAppSelector((st) => st.user.user);
  const nav = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFinanceRemaining());
  }, [dispatch]);

  return (
    <div className="mt-auto flex gap-4 text-grey-200">
      <div className="flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full bg-black/10">
        {user.user.imageUrl === null ? (
          <TbUsers className="text-[22px] text-[#383838]" />
        ) : (
          <img
            className="h-full w-full rounded-full object-cover object-center"
            src={`/api/static/${user.user.imageUrl}`}
            alt="user avatar"
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-primary-500">
          {user.user.name} {user.user.surname}
        </p>
        {/* <p className="text-xs">
          Статус:{" "}
          {user.user.roles.map((x) => x.name).includes("PaydUser") ? (
            <span className="text-green-500">оплачено</span>
          ) : (
            <span className="text-red-500">не оплачено</span>
          )}
        </p> */}
        <p className="text-xs">
          Баланс финансов: {financeCount?.toLocaleString()} P
        </p>
        <p className="text-xs">Почта: {user.user.email}</p>
        <button
          className="mt-1 inline-flex w-max rounded-lg bg-primary-500 px-2 py-2 text-grey-0 transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
          onClick={(e) => {
            e.preventDefault();
            dispatch(logoutApi()).finally(() => nav("/"));
          }}
        >
          Выйти
        </button>
      </div>
    </div>
  );
};
