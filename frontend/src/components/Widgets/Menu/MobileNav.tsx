import { useState, type FC, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { logoutApi } from "../../../stores/userSlice";
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
  Menu as MenuIcon,
  X,
  LogOut,
} from "lucide-react";

type TabItem = { to: string; icon: ReactNode; label: string };

const mainTabs: TabItem[] = [
  { to: "/", icon: <Home size={20} />, label: "Главная" },
  { to: "/expenses-and-income", icon: <ArrowLeftRight size={20} />, label: "Траты" },
  { to: "/my-budget", icon: <Wallet size={20} />, label: "Бюджет" },
  { to: "/analitic", icon: <BarChart3 size={20} />, label: "Графики" },
];

const allLinks: TabItem[] = [
  { to: "/", icon: <Home size={18} />, label: "Главная" },
  { to: "/catalogs", icon: <LayoutGrid size={18} />, label: "Каталог" },
  { to: "/my-budget", icon: <Wallet size={18} />, label: "Мой бюджет" },
  { to: "/expenses-and-income", icon: <ArrowLeftRight size={18} />, label: "Расходы и доходы" },
  { to: "/analitic", icon: <BarChart3 size={18} />, label: "Аналитика" },
  { to: "/plan", icon: <Target size={18} />, label: "Планы" },
  { to: "/notes", icon: <StickyNote size={18} />, label: "Заметки" },
  { to: "/integrations", icon: <Building2 size={18} />, label: "Интеграции" },
];

const TabButton: FC<TabItem & { end?: boolean }> = ({ to, icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      [
        "flex flex-col items-center gap-0.5 py-2 px-2 text-[10px] font-medium transition-colors",
        isActive ? "text-primary-400" : "text-grey-200/50",
      ].join(" ")
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector((st) => st.user.user);
  const isAdmin = user.user?.roles.map((x) => x.name).includes("SuperAdmin");
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const displayName = user.user?.surname && user.user?.name
    ? `${user.user.surname} ${user.user.name[0]}.`
    : user.user?.name ?? "";

  return (
    <>
      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-primary-700/30 bg-bg-menu/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden">
        {mainTabs.map((tab) => (
          <TabButton key={tab.to} {...tab} end={tab.to === "/"} />
        ))}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-0.5 py-2 px-2 text-[10px] font-medium text-grey-200/50"
        >
          <MenuIcon size={20} />
          <span>Ещё</span>
        </button>
      </nav>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-primary-800/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[280px] animate-slide-in-right border-l border-primary-700/30 bg-bg-menu/98 backdrop-blur-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-primary-700/25">
              <span className="text-sm font-bold text-grey-0">Меню</span>
              <button onClick={() => setIsOpen(false)} className="app-icon-btn h-8 w-8">
                <X size={16} />
              </button>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
              <div className="flex flex-col gap-0.5">
                {allLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                        isActive
                          ? "bg-primary-500/15 font-semibold text-grey-0 shadow-glow-sm"
                          : "text-grey-200/70 hover:bg-primary-700/20 hover:text-grey-0",
                      ].join(" ")
                    }
                  >
                    <span className="text-grey-200/50">{link.icon}</span>
                    {link.label}
                  </NavLink>
                ))}
                {isAdmin && (
                  <NavLink
                    to="/users"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-grey-200/70 hover:bg-primary-700/20 hover:text-grey-0"
                  >
                    <span className="text-grey-200/50"><Users size={18} /></span>
                    Пользователи
                  </NavLink>
                )}
              </div>
            </div>

            <div className="border-t border-primary-700/25 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-sm font-bold text-accent-500">
                  {user.user?.surname?.[0] ?? user.user?.name?.[0] ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-grey-0">{displayName}</p>
                  <p className="truncate text-xs text-grey-200/50">{user.user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  dispatch(logoutApi()).finally(() => nav("/"));
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500/10 py-2.5 text-xs font-medium text-primary-400 transition-colors hover:bg-primary-500/20"
              >
                <LogOut size={14} />
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
