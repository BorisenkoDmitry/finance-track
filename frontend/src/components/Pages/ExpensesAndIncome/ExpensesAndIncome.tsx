import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/storeHook";
import { setIsNewExp, toggleExpForm } from "../../../stores/expSlice/expSlice";
import { toggleIncForm } from "../../../stores/incSlice/incSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { Button } from "../../UI/Button/Button";

export const Expenses = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [pathname, setPathName] = useState<"spend" | "income">("spend");

  useEffect(() => {
    setPathName(
      location.pathname
        .trim()
        .split("/")
        .filter((x) => x.length > 0)[1] as "spend" | "income"
    );
  }, [location]);

  const addExp = () => {
    dispatch(setIsNewExp(true));

    dispatch(toggleExpForm(true));
  };

  const addInc = () => {
    dispatch(toggleIncForm(true));
  };

  const onClickAdd = () => {
    if (pathname === "spend") {
      addExp();
    } else {
      addInc();
    }
  };

  return (
    <>
      <ContentHeader
        title="Траты и доходы"
        dateOn={{
          isMonth: true,
          isYear: true,
        }}
        subtitle={
          <div className="exp-tabs">
            <NavLink
              to="./spend"
              className={({ isActive }) =>
                [
                  "px-5",
                  isActive ? "" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              Расходы
            </NavLink>
            <NavLink
              to="./income"
              className={({ isActive }) =>
                [
                  "px-5",
                  isActive ? "" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              Доходы
            </NavLink>
          </div>
        }
      >
        <Button onClick={() => onClickAdd()}>+</Button>
      </ContentHeader>

      <ContentMain>
        <Outlet />
      </ContentMain>
    </>
  );
};
