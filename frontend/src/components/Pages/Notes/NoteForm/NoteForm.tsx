import { createPortal } from "react-dom";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import {
  setCurrentNote,
  setOpenNoteForm,
} from "../../../../stores/NotesSlice/noteSlice";
import {
  createNoteApi,
  getNotesApi,
  updateNoteApi,
} from "../../../../stores/NotesSlice/noteThunks";
import { Popup } from "../../../Layouts/Popup/Popup";
import { Button } from "../../../UI/Button/Button";
import { InputField } from "../../../UI/Input/Input";
import { useEffect } from "react";
import { FieldWrapper } from "../../../Wrappers/FieldWrapper/FieldWrapper";

type Inputs = {
  title: string;
  content: string;
};

export const NoteForm = () => {
  const {
    notes: { isOpenNoteForm, currentItem },
    global: { periodDate },
  } = useAppSelector((st) => st);

  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    values: {
      content: "",
      title: "",
    },
  });
  useEffect(() => {
    if (currentItem != null) {
      setValue("title", currentItem.title);
      setValue("content", currentItem.content);
    } else {
      setValue("title", "");
      setValue("content", "");
    }
  }, [currentItem, setValue]);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (currentItem === null) {
      dispatch(
        createNoteApi({
          content: JSON.stringify(data.content),
          title: data.title,
        })
      ).finally(() => {
        reset();
        dispatch(
          getNotesApi({
            title: "",
            dateEnd: periodDate.end,
            dateStart: periodDate.start,
          })
        );
      });
    } else {
      dispatch(
        updateNoteApi({
          completed: currentItem.completed,
          id: currentItem.id,
          title: data.title,
          content: data.content,
        })
      ).finally(() => {
        reset();
        dispatch(
          getNotesApi({
            title: "",
            dateEnd: periodDate.end,
            dateStart: periodDate.start,
          })
        );
      });
    }

    dispatch(setCurrentNote(null));
  };

  if (!isOpenNoteForm) return null;

  return createPortal(
    <Popup
      onClose={() => {
        dispatch(setOpenNoteForm(false));
        dispatch(setCurrentNote(null));
      }}
      wide={600}
    >
      <h2 className="mb-5 text-xl font-semibold">
        {currentItem === null
          ? `Создание новой заметки`
          : `Редактирование заметки`}
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => {
            return (
              <InputField
                label="Заголовок"
                ref={field.ref}
                value={field.value}
                onChange={field.onChange}
                errorText={errors.title ? errors.title.message : ""}
              />
            );
          }}
        />

        <Controller
          name="content"
          control={control}
          render={({ field }) => {
            return (
              <FieldWrapper tagWrapp="div" label="Контент">
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  className="min-h-[250px] [&_.ql-editor]:min-h-[200px] [&_*]:font-sans [&_p]:text-sm"
                />
              </FieldWrapper>
            );
          }}
        />

        <Button className="w-full max-w-[230px] self-end">
          {currentItem === null ? `Создать` : `Сохранить`}
        </Button>
      </form>
    </Popup>,
    document.body
  );
};
