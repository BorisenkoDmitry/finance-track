import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { getFinanceRemaining } from "../../../../stores/financeSlice/financeSlice";

function formatUserName(name?: string, surname?: string): string {
  if (!surname && !name) return "Пользователь";
  if (surname && name) return `${surname} ${name[0]}.`;
  return surname || name || "Пользователь";
}

function getInitials(name?: string, surname?: string): string {
  const first = surname?.[0] ?? name?.[0] ?? "?";
  return first.toUpperCase();
}

export const UserView = () => {
  const user = useAppSelector((st) => st.user.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFinanceRemaining());
  }, [dispatch]);

  const displayName = formatUserName(user.user?.name, user.user?.surname);
  const initials = getInitials(user.user?.name, user.user?.surname);

  return (
    <NavLink
      to="/settings"
      className="flex items-center gap-3 rounded-xl px-2 py-2 transition-all duration-200 hover:bg-primary-700/20"
    >
      {user.user?.imageUrl ? (
        <img
          className="h-9 w-9 shrink-0 rounded-full object-cover"
          src={`/api/static/${user.user.imageUrl}`}
          alt="avatar"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-sm font-bold text-accent-500">
          {initials}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-grey-0">{displayName}</p>
      </div>
    </NavLink>
  );
};
