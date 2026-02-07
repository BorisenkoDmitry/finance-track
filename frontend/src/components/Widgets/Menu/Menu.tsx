import { NavLink } from "react-router-dom";
import { Logo } from "../../UI/Logo/Logo";
import { UserView } from "./UserView/UserView";
import { LiaMoneyCheckSolid } from "react-icons/lia";
import { GrMoney } from "react-icons/gr";
import { GiCrosshair } from "react-icons/gi";
import { MdOutlineHomeWork } from "react-icons/md";
import { useAppSelector } from "../../../hooks/storeHook";
import { SlGraph } from "react-icons/sl";
import { CgNotes } from "react-icons/cg";
import { LuUsers } from "react-icons/lu";
import { GrCatalogOption } from "react-icons/gr";
import { CiSettings } from "react-icons/ci";

export const Menu = () => {
  const user = useAppSelector((st) => st.user.user);
  return (
    <>
      <div className="overflow-auto app-surface flex flex-col gap-[50px] rounded-r-[30px] p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.7)]">
        <Logo href="/" />
        <nav>
          <ul className="flex flex-col">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  [
                    "inline-flex w-full items-center gap-2.5 py-3 text-[color:var(--clr-menu-link)] transition-colors",
                    "hover:text-[color:var(--clr-menu-link-hover)]",
                    isActive
                      ? "-mx-2.5 rounded-2xl bg-primary-500 px-2.5 font-semibold text-grey-0 hover:text-grey-0"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <MdOutlineHomeWork /> Главная
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/catalogs"
                className={({ isActive }) =>
                  [
                    "inline-flex w-full items-center gap-2.5 py-3 text-[color:var(--clr-menu-link)] transition-colors",
                    "hover:text-[color:var(--clr-menu-link-hover)]",
                    isActive
                      ? "-mx-2.5 rounded-2xl bg-primary-500 px-2.5 font-semibold text-grey-0 hover:text-grey-0"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <GrCatalogOption /> Каталог{" "}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-budget"
                className={({ isActive }) =>
                  [
                    "inline-flex w-full items-center gap-2.5 py-3 text-[color:var(--clr-menu-link)] transition-colors",
                    "hover:text-[color:var(--clr-menu-link-hover)]",
                    isActive
                      ? "-mx-2.5 rounded-2xl bg-primary-500 px-2.5 font-semibold text-grey-0 hover:text-grey-0"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <GrMoney /> Мой бюджет
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/expenses-and-income"
                className={({ isActive }) =>
                  [
                    "inline-flex w-full items-center gap-2.5 py-3 text-[color:var(--clr-menu-link)] transition-colors",
                    "hover:text-[color:var(--clr-menu-link-hover)]",
                    isActive
                      ? "-mx-2.5 rounded-2xl bg-primary-500 px-2.5 font-semibold text-grey-0 hover:text-grey-0"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <LiaMoneyCheckSolid /> Расходы и доходы
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analitic"
                className={({ isActive }) =>
                  [
                    "inline-flex w-full items-center gap-2.5 py-3 text-[color:var(--clr-menu-link)] transition-colors",
                    "hover:text-[color:var(--clr-menu-link-hover)]",
                    isActive
                      ? "-mx-2.5 rounded-2xl bg-primary-500 px-2.5 font-semibold text-grey-0 hover:text-grey-0"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <SlGraph /> Аналитика
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/plan"
                className={({ isActive }) =>
                  [
                    "inline-flex w-full items-center gap-2.5 py-3 text-[color:var(--clr-menu-link)] transition-colors",
                    "hover:text-[color:var(--clr-menu-link-hover)]",
                    isActive
                      ? "-mx-2.5 rounded-2xl bg-primary-500 px-2.5 font-semibold text-grey-0 hover:text-grey-0"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <GiCrosshair /> Планы
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  [
                    "inline-flex w-full items-center gap-2.5 py-3 text-[color:var(--clr-menu-link)] transition-colors",
                    "hover:text-[color:var(--clr-menu-link-hover)]",
                    isActive
                      ? "-mx-2.5 rounded-2xl bg-primary-500 px-2.5 font-semibold text-grey-0 hover:text-grey-0"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <CgNotes /> Заметки
              </NavLink>
            </li>
            {user.user &&
              user.user.roles.map((x) => x.name).includes("SuperAdmin") && (
                <li>
                  <NavLink
                    to="/users"
                    className={({ isActive }) =>
                      [
                        "inline-flex w-full items-center gap-2.5 py-3 text-[color:var(--clr-menu-link)] transition-colors",
                        "hover:text-[color:var(--clr-menu-link-hover)]",
                        isActive
                          ? "-mx-2.5 rounded-2xl bg-primary-500 px-2.5 font-semibold text-grey-0 hover:text-grey-0"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")
                    }
                  >
                    <LuUsers /> Пользователи
                  </NavLink>
                </li>
              )}
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  [
                    "inline-flex w-full items-center gap-2.5 py-3 text-[color:var(--clr-menu-link)] transition-colors",
                    "hover:text-[color:var(--clr-menu-link-hover)]",
                    isActive
                      ? "-mx-2.5 rounded-2xl bg-primary-500 px-2.5 font-semibold text-grey-0 hover:text-grey-0"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <CiSettings /> Настройки
              </NavLink>
            </li>
          </ul>
        </nav>
        <UserView />
      </div>
    </>
  );
};
