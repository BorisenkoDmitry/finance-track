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

      <Toaster position="bottom-center" containerStyle={{ bottom: 80 }} />
    </>
  );
};
