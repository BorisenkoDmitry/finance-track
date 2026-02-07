import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/storeHook";
import {
  getCatalogApi
} from "../../../stores/catalogSlice/catalogsSlice";
import { Content } from "../../Layouts/Content/Content";
import { Menu } from "../../Widgets/Menu/Menu";

export const Main = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCatalogApi())
  }, [dispatch]);
  return (
    <>
      <Menu />
      <Content>
        <Outlet />
      </Content>
      <Toaster position="bottom-right" />
    </>
  );
};
