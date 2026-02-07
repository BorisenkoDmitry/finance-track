import { format } from "date-fns/format";
import { useEffect } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { PiBookmarkSimpleFill, PiBookmarkSimpleLight } from "react-icons/pi";
import { RiDeleteBin3Line, RiEdit2Line } from "react-icons/ri";
import { TbLoaderQuarter } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import {
  setCurrentNote,
  setOpenNoteForm,
  type NoteItem,
} from "../../../../stores/NotesSlice/noteSlice";
import {
  deleteNoteToHistoryApi,
  getNotesApi,
  updateNoteApi,
} from "../../../../stores/NotesSlice/noteThunks";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export const NotesList = () => {
  const { noteList: list, isLoadingUpdateItem } = useAppSelector(
    (st) => st.notes
  );
  const { periodDate } = useAppSelector((st) => st.global);
  const date = useAppSelector((st) => st.global.periodDate);

  const dispatch = useAppDispatch();

  const onMarkedNote = (id: string, complited: boolean) => {
    dispatch(
      updateNoteApi({
        id,
        completed: !complited,
      })
    ).finally(() => {
      dispatch(
        getNotesApi({
          title: "",
          dateEnd: periodDate.end,
          dateStart: periodDate.start,
        })
      );
    });
  };

  const onEditNote = (item: NoteItem) => {
    dispatch(setCurrentNote(item));
    dispatch(setOpenNoteForm(true));
  };

  const onDeleteNoteHistory = (id: string) => {
    dispatch(deleteNoteToHistoryApi(id)).finally(() => {
      dispatch(
        getNotesApi({
          title: "",
          dateEnd: periodDate.end,
          dateStart: periodDate.start,
        })
      );
    });
  };

  useEffect(() => {
    dispatch(
      getNotesApi({
        dateStart: date.start,
        dateEnd: date.end,
      })
    );
  }, [date, dispatch]);

  if (list.length === 0) return <div>Список пуст...</div>;

  return (
    <ul className="grid grid-cols-4 gap-8">
      {list.map((note) => {
        const isCompleted = note.completed;
        return (
          <li
            className={[
              "relative flex min-h-[300px] flex-col p-4",
              "shadow-[2px_4px_40px_-14px_rgba(34,60,80,0.2)]",
              "transition-transform hover:rotate-0 hover:scale-[1.03]",
              "rotate-[-2deg] even:rotate-[2deg] even:hover:scale-[1.02]",
              "before:absolute before:right-[-20px] before:top-5 before:h-[30px] before:w-[100px] before:rotate-[40deg] before:bg-[#409e8a] before:content-['']",
              isCompleted
                ? "opacity-60 outline outline-2 outline-[#409e8a] outline-offset-[-5px] hover:rotate-[-2deg] hover:scale-100 even:hover:rotate-[2deg] even:hover:scale-100"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={note.id}
          >
            {isCompleted && (
              <IoMdCheckmarkCircle className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 text-[60px] text-[#409e8a]" />
            )}
            <h3
              className={[
                "mb-4 max-w-[250px] border-b-2 border-dotted border-brand-primary pb-2 text-xl",
                isCompleted ? "blur-[2px]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {note.title}
            </h3>
            <div
              className={[
                "text-sm",
                "[&_p]:text-sm",
                "[&_ol]:mb-2.5 [&_ol]:list-decimal [&_ol]:pl-5",
                "[&_ul]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5",
                "[&_li]:mb-1.5",
                "[&_h1]:mb-2.5 [&_h1]:text-[18px] [&_h1]:text-brand-primary",
                "[&_h2]:mb-2 [&_h2]:text-base [&_h2]:text-brand-primary",
                "[&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:text-brand-primary",
                isCompleted ? "pointer-events-none cursor-not-allowed blur-[2px]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              dangerouslySetInnerHTML={{ __html: note.content }}
            ></div>
            <div className="mt-auto flex justify-end gap-1.5">
              <div
                className="mr-auto max-w-[150px] text-sm"
              >
                {format(new Date(note.createdAt), "dd MMMM yyyy, HH:mm:ss")}
              </div>
              <Tippy
                content={
                  note.completed
                    ? "Отметить как невыполнено"
                    : "Отметить как выполнено"
                }
              >
                <button
                  className="app-icon-btn h-[30px] w-[30px] rounded-full hover:bg-brand-primary/30 hover:border-brand-primary/60 hover:text-grey-0"
                  onClick={() => onMarkedNote(note.id, note.completed)}
                >
                  {isLoadingUpdateItem ? (
                    <TbLoaderQuarter className="animate-spin" />
                  ) : note.completed ? (
                    <PiBookmarkSimpleFill />
                  ) : (
                    <PiBookmarkSimpleLight />
                  )}
                </button>
              </Tippy>
              {!note.completed && (
                <Tippy content="Редактировать">
                  <button
                    className="app-icon-btn h-[30px] w-[30px] rounded-full hover:bg-brand-primary/30 hover:border-brand-primary/60 hover:text-grey-0"
                    onClick={() => onEditNote(note)}
                  >
                    <RiEdit2Line />
                  </button>
                </Tippy>
              )}
              <Tippy content="Переместить в историю">
                <button
                  className="app-icon-btn h-[30px] w-[30px] rounded-full hover:bg-brand-primary/30 hover:border-brand-primary/60 hover:text-grey-0"
                  onClick={() => onDeleteNoteHistory(note.id)}
                >
                  <RiDeleteBin3Line />
                </button>
              </Tippy>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
