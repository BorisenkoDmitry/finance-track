import { useEffect, useState, type FC } from "react";
import { HexColorPicker } from "react-colorful";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import {
  setCurrentCatalogID,
  updateCatalogApi,
  type CatalogEntity,
} from "../../../../stores/catalogSlice/catalogsSlice";
import { Popup } from "../../../Layouts/Popup/Popup";
import { InputField } from "../../../UI/Input/Input";
import { Button } from "../../../UI/Button/Button";

interface ICatalogEditForm {
  isOpen: boolean;
  onClose: () => void;
}

export const CatalogEditForm: FC<ICatalogEditForm> = ({ isOpen, onClose }) => {
  const { catalogsFull: catalogFull, currentCatalogID } = useAppSelector(
    (x) => x.catalogs
  );
  const dispatch = useAppDispatch();

  const [currentCatalog, setCurrentState] = useState<CatalogEntity | null>(
    catalogFull.find((x) => x.id === currentCatalogID)
  );

  useEffect(() => {
    if (currentCatalogID != null) {
      setCurrentState(catalogFull.find((x) => x.id === currentCatalogID));
    }
  }, [catalogFull, currentCatalogID]);

  if (!isOpen) return null;
  if (!currentCatalog) return null;

  return createPortal(
    <Popup
      onClose={() => {
        onClose();
        dispatch(setCurrentCatalogID(null));
      }}
      wide={300}
      height="auto"
    >
      <div className="flex flex-col gap-8">
        <InputField
          label="Название каталога"
          value={currentCatalog.catalogName}
          onChange={(e) => {
            setCurrentState((x) => {
              return x ? { ...x, catalogName: e.target.value } : x;
            });
          }}
        />
        <HexColorPicker
          color={currentCatalog.catalogColor ?? ""}
          onChange={(c) => {
            setCurrentState((x) => {
              return x ? { ...x, catalogColor: c } : x;
            });
          }}
        />
        <Button
          onClick={() => {
            dispatch(
              updateCatalogApi({
                catalogId: currentCatalog.id,
                catalogColor: currentCatalog.catalogColor,
                catalogName: currentCatalog.catalogName,
                catalogType: currentCatalog.catalogType,
              })
            ).finally(() => {
              onClose();
              dispatch(setCurrentCatalogID(null));
            });
          }}
        >
          Сохранить
        </Button>
      </div>
    </Popup>,
    document.body
  );
};
