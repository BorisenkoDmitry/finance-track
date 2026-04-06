import { NavLink } from "react-router-dom";
import { Logo } from "../../UI/Logo/Logo";
import { UserView } from "./UserView/UserView";
import { useAppSelector } from "../../../hooks/storeHook";
import type { FC, ReactNode } from "react";
import {
  Home,
  LayoutGrid,
  Wallet,
  ArrowLeftRight,
  BarChart3,
  Target,
  StickyNote,
  Building2,
  Users,
} from "lucide-react";

type MenuLinkProps = {
  to: string;
  icon: ReactNode;
  label: string;
};

const MenuLink: FC<MenuLinkProps> = ({ to, icon, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all duration-250",
          isActive
            ? "bg-primary-500/15 font-semibold text-grey-0 shadow-glow-sm"
            : "text-grey-200/70 hover:bg-primary-700/20 hover:text-grey-0",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary-500" />
          )}
          <span className={`transition-colors ${isActive ? "text-primary-400" : "text-grey-200/50 group-hover:text-primary-400"}`}>
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  </li>
);

export const Menu = () => {
  const user = useAppSelector((st) => st.user.user);
  const isAdmin = user.user?.roles.map((x) => x.name).includes("SuperAdmin");

  return (
    <div className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-primary-700/25 bg-bg-menu/80 backdrop-blur-lg">
      <div className="px-6 pt-7 pb-2">
        <Logo href="/" />
      </div>

      <nav className="custom-scrollbar mt-4 flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-0.5">
          <MenuLink to="/" icon={<Home size={18} />} label="Главная" />
          <MenuLink to="/catalogs" icon={<LayoutGrid size={18} />} label="Каталог" />
          <MenuLink to="/my-budget" icon={<Wallet size={18} />} label="Мой бюджет" />
          <MenuLink to="/expenses-and-income" icon={<ArrowLeftRight size={18} />} label="Расходы и доходы" />
          <MenuLink to="/analitic" icon={<BarChart3 size={18} />} label="Аналитика" />
          <MenuLink to="/plan" icon={<Target size={18} />} label="Планы" />
          <MenuLink to="/notes" icon={<StickyNote size={18} />} label="Заметки" />
          <MenuLink to="/integrations" icon={<Building2 size={18} />} label="Интеграции" />
          {isAdmin && <MenuLink to="/users" icon={<Users size={18} />} label="Пользователи" />}
        </ul>
      </nav>

      <div className="border-t border-primary-700/25 px-3 py-3">
        <UserView />
      </div>
    </div>
  );
};
