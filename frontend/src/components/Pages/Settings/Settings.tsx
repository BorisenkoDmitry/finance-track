import { useMemo, useState } from "react";
import Switch from "react-switch";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { deleteImage, uploadImage } from "../../../stores/userSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { Loader } from "../../UI/Loader/Loader";
import { UploadImage } from "../../UI/UploadImage/UploadImage";
import { SettingsFormPassword } from "./SettingsFormPassword/SettingsFormPassword";
import { CardsPay } from "./CardsPay/CardsPay";

export const Settings = () => {
  const {
    user: { user },
    isLoadingImage,
    isLoading,
  } = useAppSelector((st) => st.user);
  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();

  const url = useMemo(() => {
    return user.imageUrl === null ? null : `/api/static/` + user.imageUrl;
  }, [user]);
  return (
    <>
      <ContentHeader title="Настройки" />
      <Loader isLoading={isLoading} />
      <ContentMain>
        <div className="flex gap-8">
          <div>
            <div className="flex items-center gap-4">
              <div style={{ position: "relative" }}>
                <Loader isLoading={isLoadingImage} />
                <UploadImage
                  onDeleteImage={() => dispatch(deleteImage())}
                  onSaveImage={(img) =>
                    dispatch(
                      uploadImage({
                        avatar: img.file,
                      })
                    )
                  }
                  image={url}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p>Имя: {user.name}</p>
                <p>Фамилия: {user.surname}</p>
                <p>Почта: {user.email}</p>
              </div>
            </div>
            <SettingsFormPassword />
            {/* <Switch
              onChange={(v) => {
                setChecked(v);
              }}
              checked={checked}
            /> */}
          </div>
          {/* <CardsPay /> */}
        </div>
      </ContentMain>
    </>
  );
};
