import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/storeHook";
import { getCatalogApi } from "../../../stores/catalogSlice/catalogsSlice";
import { getTagsApi } from "../../../stores/tagSlice/tagSlice";
import { Content } from "../../Layouts/Content/Content";
import { Menu } from "../../Widgets/Menu/Menu";
import { MobileNav } from "../../Widgets/Menu/MobileNav";

export const Main = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCatalogApi());
    dispatch(getTagsApi());
  }, [dispatch]);

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <Menu />

      <Content>
        <Outlet />
      </Content>

      {/* Mobile bottom nav */}
      <MobileNav />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(12, 19, 30, 0.95)",
            color: "#f0e6ef",
            border: "1px solid rgba(90, 58, 74, 0.2)",
            borderRadius: "16px",
            fontSize: "13px",
            fontWeight: 500,
            padding: "12px 16px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
          },
          success: {
            iconTheme: { primary: "#4ade80", secondary: "#0b0a22" },
          },
          error: {
            iconTheme: { primary: "#FF7582", secondary: "#0b0a22" },
          },
        }}
      />
    </>
  );
};
