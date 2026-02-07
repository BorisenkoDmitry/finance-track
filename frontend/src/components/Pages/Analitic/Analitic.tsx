import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import {
  getFinanceAnaliticExp,
  getFinanceAnaliticIncExp,
} from "../../../stores/financeSlice/financeSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { Loader } from "../../UI/Loader/Loader";
import { setTypeDate } from "../../../stores/globalSlice";

export const Analitic = () => {
  const { periodDate } = useAppSelector((state) => state.global);
  const list = useAppSelector((state) => state.catalogs.categoryExpList);
  const dispatch = useAppDispatch();
  const dateOptions = {
    isMonth: true,
    isYear: true,
  };
  const [type, setType] = useState(0);

  useEffect(() => {
    if (type === 0 || type === 1) {
      dispatch(
        getFinanceAnaliticExp({
          catalogIds: list.map((x) => x.value),
          dateStart: periodDate.start,
          dateEnd: periodDate.end,
        })
      );
    } else {
      dispatch(
        getFinanceAnaliticIncExp({
          dateEnd: periodDate.end,
          dateStart: periodDate.start,
        })
      );
    }
  }, [list, dispatch, periodDate, type]);

  useEffect(() => {
    if (type === 0 || type === 1) {
      dispatch(setTypeDate("months"));
    } else {
      dispatch(setTypeDate("years"));
    }
  }, [type, dispatch]);

  return (
    <>
      <ContentHeader
        title="Аналитика"
        dateOn={dateOptions}
        isHideDateControlls
        subtitle={
          <>
            <div className="exp-tabs">
              <NavLink
                to="exp-budget"
                onClick={() => {
                  setType(0);
                }}
              >
                Расходы и бюджет, сравнение
              </NavLink>
              <NavLink
                to="all-exp-catalog"
                onClick={() => {
                  setType(1);
                }}
              >
                Расходы по всем категориям
              </NavLink>
              <NavLink
                to="all-inc"
                onClick={() => {
                  setType(2);
                }}
              >
                Доходы и расходы, сравнение
              </NavLink>
            </div>
          </>
        }
      />
      <ContentMain>
        <Outlet />
      </ContentMain>
      <Loader isLoading={false} />
    </>
  );
};
