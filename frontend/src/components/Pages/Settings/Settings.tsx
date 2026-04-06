import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { deleteImage, logoutApi, uploadImage } from "../../../stores/userSlice";
import { getFinanceRemaining } from "../../../stores/financeSlice/financeSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { Loader } from "../../UI/Loader/Loader";
import { UploadImage } from "../../UI/UploadImage/UploadImage";
import { SettingsFormPassword } from "./SettingsFormPassword/SettingsFormPassword";
import {
  User,
  Mail,
  Shield,
  TrendingUp,
  TrendingDown,
  Wallet,
  Lock,
  LogOut,
} from "lucide-react";

const formatMoney = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n);

export const Settings = () => {
  const {
    user: { user },
    isLoadingImage,
    isLoading,
  } = useAppSelector((st) => st.user);
  const { remainingFinance } = useAppSelector((st) => st.finance);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFinanceRemaining());
  }, [dispatch]);

  const url = useMemo(() => {
    return user.imageUrl === null ? null : `/api/static/` + user.imageUrl;
  }, [user]);

  const balanceColor =
    remainingFinance > 0
      ? "text-green-400"
      : remainingFinance < 0
        ? "text-red-400"
        : "text-grey-0";

  const balanceIcon =
    remainingFinance >= 0 ? (
      <TrendingUp size={18} className="text-green-400" />
    ) : (
      <TrendingDown size={18} className="text-red-400" />
    );

  const roles = user.roles?.map((r) => r.name).join(", ") ?? "";

  return (
    <>
      <ContentHeader
        title="Мой профиль"
        subtitle={<p className="text-grey-200/60">Управление аккаунтом и безопасность</p>}
      />
      <Loader isLoading={isLoading} />
      <ContentMain>
        <div className="flex flex-col gap-6">

          {/* ─── Profile card ─── */}
          <div className="relative overflow-hidden rounded-3xl border border-primary-700/20">
            {/* Background blobs */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute -left-20 -top-20 h-[250px] w-[250px] rounded-full bg-primary-500/8 blur-[100px]" />
              <div className="absolute -right-10 bottom-0 h-[180px] w-[180px] rounded-full bg-secondary-500/6 blur-[80px]" />
            </div>

            <div className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Loader isLoading={isLoadingImage} />
                <UploadImage
                  onDeleteImage={() => dispatch(deleteImage())}
                  onSaveImage={(img) => dispatch(uploadImage({ avatar: img.file }))}
                  image={url}
                />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-4 text-center sm:text-left">
                <div>
                  <h2 className="text-2xl font-bold text-grey-0">
                    {user.name} {user.surname}
                  </h2>
                  <p className="mt-1 flex items-center justify-center gap-2 text-sm text-grey-200/50 sm:justify-start">
                    <Mail size={14} />
                    {user.email}
                  </p>
                </div>

                {/* Info grid */}
                <div className="flex flex-wrap gap-3">
                  {/* Role */}
                  <div className="flex items-center gap-2 rounded-xl border border-primary-700/15 bg-primary-900/30 px-4 py-2.5">
                    <Shield size={15} className="text-accent-400" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-grey-200/40">Роль</p>
                      <p className="text-sm font-medium text-grey-0">{roles || "Пользователь"}</p>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="flex items-center gap-2 rounded-xl border border-primary-700/15 bg-primary-900/30 px-4 py-2.5">
                    {balanceIcon}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-grey-200/40">Баланс</p>
                      <p className={`text-sm font-bold tabular-nums ${balanceColor}`}>
                        {formatMoney(remainingFinance)} ₽
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={() => dispatch(logoutApi())}
                  className="mt-2 flex w-max items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:border-red-500/30"
                >
                  <LogOut size={15} />
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          </div>

          {/* ─── Balance visual ─── */}
          <BalanceBar balance={remainingFinance} />

          {/* ─── Password section ─── */}
          <div className="rounded-3xl border border-primary-700/20 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-grey-0">Безопасность</h3>
                <p className="text-[11px] text-grey-200/50">Изменение пароля учётной записи</p>
              </div>
            </div>
            <SettingsFormPassword />
          </div>
        </div>
      </ContentMain>
    </>
  );
};

/* ─── Balance Bar ─── */
const BalanceBar = ({ balance }: { balance: number }) => {
  const isPositive = balance >= 0;
  const absBalance = Math.abs(balance);
  const maxDisplay = Math.max(absBalance, 1);
  const pct = Math.min((absBalance / maxDisplay) * 100, 100);

  return (
    <div className="rounded-3xl border border-primary-700/20 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-grey-200/40" />
          <span className="text-sm font-medium text-grey-200/60">Общий баланс</span>
        </div>
        <span className={`text-2xl font-bold tabular-nums ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}{formatMoney(balance)} ₽
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-primary-800/50">
        <div
          className={[
            "h-full rounded-full transition-all duration-700 ease-out",
            isPositive
              ? "bg-gradient-to-r from-green-500/60 to-green-400"
              : "bg-gradient-to-r from-red-500/60 to-red-400",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-grey-200/30">
        <span>{isPositive ? "Доходы превышают расходы" : "Расходы превышают доходы"}</span>
        <span className={isPositive ? "text-green-400/50" : "text-red-400/50"}>
          {formatMoney(absBalance)} ₽
        </span>
      </div>
    </div>
  );
};
