import { useEffect, useState, type FC } from "react";
import { CiImageOn } from "react-icons/ci";
import ImageUploading, {
  type ImageListType,
  type ImageType,
} from "react-images-uploading";
import { MdClear } from "react-icons/md";
import Tippy from "@tippyjs/react";

interface IUploadImage {
  onSaveImage: (img: ImageType) => void;
  onDeleteImage: () => void;
  image: string | null;
}

export const UploadImage: FC<IUploadImage> = ({
  onDeleteImage,
  onSaveImage,
  image,
}) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const maxNumber = 69;
  const maxSizeRool = 300;

  useEffect(() => {
    setImages(image === null ? [] : [image]);
  }, [image]);

  const onChange = (imageList: ImageListType) => {
    setError(null);
    if (imageList.length > 0) {
      const maxSize = maxSizeRool * 1024;
      if (imageList[0].file.size <= maxSize) {
        setImages(imageList);
        onSaveImage(imageList[0]);
      } else {
        setError(`Размер изображения больше ${maxSizeRool}кб`);
      }
    } else {
      setImages(imageList);
    }
  };

  return (
    <div className="flex max-w-max flex-col items-center">
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="relative mb-2.5">
            <button
              style={isDragging ? { opacity: "0.3" } : undefined}
              onClick={() => {
                onImageUpload();
              }}
              {...dragProps}
              className={
                imageList.length === 0 && image === null
                  ? "flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-primary-700/30 bg-primary-900/30 transition-all hover:border-primary-500/40 hover:bg-primary-900/50"
                  : "flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full ring-2 ring-primary-700/30 ring-offset-2 ring-offset-primary-900 transition-all hover:ring-primary-500/40 hover:opacity-80"
              }
            >
              {imageList.length === 0 && image === null ? (
                <div className="flex flex-col items-center gap-0.5">
                  <CiImageOn className="text-[24px] text-primary-400/50" />
                  <span className="text-[8px] text-grey-200/30">Фото</span>
                </div>
              ) : (
                <img
                  src={image}
                  alt="Фото пользователя"
                  style={{}}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              )}
            </button>

            {imageList.length > 0 && (
              <Tippy content={"Удалить изображение"}>
                <button
                  className={[
                    "absolute -bottom-2.5 left-1/2 z-[2] -translate-x-1/2",
                    "app-icon-btn h-6 w-6 rounded-full text-[18px]",
                    "hover:bg-red-900/35 hover:border-red-500/40",
                  ].join(" ")}
                  onClick={() => {
                    onImageRemoveAll();
                    onDeleteImage();
                    setImages([]);
                  }}
                >
                  <MdClear />
                </button>
              </Tippy>
            )}
          </div>
        )}
      </ImageUploading>

      {error != null && (
        <span className="block w-[100px] text-center text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};
