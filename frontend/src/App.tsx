import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AllExpCatalog } from "./components/Pages/Analitic/allExpCatalog/AllExpCatalog";
import { Analitic } from "./components/Pages/Analitic/Analitic";
import { ExpFinance } from "./components/Pages/Analitic/exp-budget/exp-budget";
import { IncAnalitic } from "./components/Pages/Analitic/incs/IncAnalitic";
import { Auth } from "./components/Pages/Auth/Auth";
import { Login } from "./components/Pages/Auth/Login/Login";
import { Registration } from "./components/Pages/Auth/Registration/Registration";
import { Catalog } from "./components/Pages/Catalog/Catalog";
import { ExpContent } from "./components/Pages/ExpensesAndIncome/Expences/Expences";
import { Expenses } from "./components/Pages/ExpensesAndIncome/ExpensesAndIncome";
import { IncContent } from "./components/Pages/ExpensesAndIncome/Incoming/Incoming";
import { Home } from "./components/Pages/Home/Home";
import { Main } from "./components/Pages/Main/Main";
import { MyBudget } from "./components/Pages/MyBudget/MyBudget";
import { Notes } from "./components/Pages/Notes/Notes";
import { PlannedCalendar } from "./components/Pages/Planned/PlannedCalendar/PlannedCalendar";
import { PlannedList } from "./components/Pages/Planned/PlannedList/PlannedList";
import { Settings } from "./components/Pages/Settings/Settings";
import { Users } from "./components/Pages/Users/Users";
import { useAppDispatch, useAppSelector } from "./hooks/storeHook";
import { userMe } from "./stores/userSlice";
import { ResponsiveGuard } from "./components/UI/ResponsiveGuard/ResponsiveGuard";

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((st) => st.user.user);
  const basenameRaw = (import.meta as any).env?.BASE_URL ?? "/";
  const basename =
    typeof basenameRaw === "string" && basenameRaw.endsWith("/")
      ? basenameRaw.slice(0, -1)
      : basenameRaw;
  useEffect(() => {
    dispatch(userMe());
  }, [dispatch]);
  return (
    <>
      <ResponsiveGuard minWidth={1200} />
      <BrowserRouter basename={basename === "" ? "/" : basename}>
        <Routes>
          {/* Если не авторизован, любые попытки зайти в защищённые страницы будут редиректить на /auth/login */}
          <Route
            path="/"
            element={isAuth ? <Main /> : <Navigate to="/auth/login" replace />}
          >
            <Route
              index
              element={
                isAuth ? <Home /> : <Navigate to="/auth/login" replace />
              }
            />
            <Route
              path="my-budget"
              element={
                isAuth ? <MyBudget /> : <Navigate to="/auth/login" replace />
              }
            />
            <Route
              path="expenses-and-income"
              element={
                isAuth ? <Expenses /> : <Navigate to="/auth/login" replace />
              }
            >
              <Route index element={<Navigate to="spend" replace />} />
              <Route
                path="spend"
                element={
                  isAuth ? (
                    <ExpContent />
                  ) : (
                    <Navigate to="/auth/login" replace />
                  )
                }
              />
              <Route
                path="income"
                element={
                  isAuth ? (
                    <IncContent />
                  ) : (
                    <Navigate to="/auth/login" replace />
                  )
                }
              />
            </Route>
            <Route
              path="catalogs"
              element={
                isAuth ? <Catalog /> : <Navigate to="/auth/login" replace />
              }
            />
            <Route
              path="analitic"
              element={
                isAuth ? <Analitic /> : <Navigate to="/auth/login" replace />
              }
            >
              <Route index element={<Navigate to="exp-budget" replace />} />
              <Route
                path="exp-budget"
                element={
                  isAuth ? (
                    <ExpFinance />
                  ) : (
                    <Navigate to="/auth/login" replace />
                  )
                }
              />
              <Route
                path="all-exp-catalog"
                element={
                  isAuth ? (
                    <AllExpCatalog />
                  ) : (
                    <Navigate to="/auth/login" replace />
                  )
                }
              />
              <Route
                path="all-inc"
                element={
                  isAuth ? (
                    <IncAnalitic />
                  ) : (
                    <Navigate to="/auth/login" replace />
                  )
                }
              />
            </Route>

            <Route
              path="plan"
              element={
                isAuth ? (
                  <Navigate to="/planned-list" replace />
                ) : (
                  <Navigate to="/auth/login" replace />
                )
              }
            />

            <Route path="planned-list" element={<PlannedList />} />
            <Route path="planned-calendar" element={<PlannedCalendar />} />
            <Route
              path="notes"
              element={
                isAuth ? <Notes /> : <Navigate to="/auth/login" replace />
              }
            />

            <Route
              path="settings"
              element={
                isAuth ? <Settings /> : <Navigate to="/auth/login" replace />
              }
            />

            {isAuth &&
              isAuth.user.roles.map((x) => x.name).includes("SuperAdmin") && (
                <Route path="users" element={<Users />} />
              )}
          </Route>

          <Route
            path="auth"
            element={isAuth ? <Navigate to="/" replace /> : <Auth />}
          >
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Registration />} />
          </Route>
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          {/* Пример: перенаправление по умолчанию, если путь не найден */}
          {/* <Route
            path="*"
            element={<Navigate to={isAuth ? "/" : "/auth/login"} replace />}
          /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
