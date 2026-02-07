import LogoSVG from "@assets/icons/logo.svg?react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader } from "../../UI/Loader/Loader";
import { useAppSelector } from "../../../hooks/storeHook";

export const Auth = () => {
  const isLoading = useAppSelector((st) => st.user.isLoading);
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center gap-5 bg-[color:var(--bg-body-crl)] p-5">
      <Loader isLoading={isLoading} />
      <Toaster position="bottom-right" />
      <LogoSVG className="w-40 min-h-40" />
      <Outlet />
    </div>
  );
};
