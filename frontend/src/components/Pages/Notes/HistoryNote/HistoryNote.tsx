import { useState } from "react";
import { Button } from "../../../UI/Button/Button";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import {
  deleteNoteAlwaysApi,
  getNotesApi,
  updateNoteApi,
} from "../../../../stores/NotesSlice/noteThunks";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RiDeleteBin3Line } from "react-icons/ri";
import Tippy from "@tippyjs/react";

export const HistoryNote = () => {
  const [isHoverHistory, setHoverHistory] = useState(true);
  const {
    notes: { historyNoteList },
    global: { periodDate: date },
  } = useAppSelector((st) => st);
  const dispatch = useAppDispatch();
  if (historyNoteList.length === 0) return null;
  return (
    <div
      // onMouseLeave={() => setHoverHistory(false)}
      // onMouseEnter={() => setHoverHistory(true)}
      className="relative"
    >
      <Button onClick={() => {
        setHoverHistory(true)
      }} className="border border-brand-primary bg-transparent text-brand-primary hover:bg-brand-primary/30 hover:text-grey-0">
        История
      </Button>
      {isHoverHistory && (
        <div onBlur={() => setHoverHistory(false)} className="absolute bottom-[-17px] right-0 max-w-[300px] translate-y-full shadow-[2px_4px_40px_-14px_rgba(34,60,80,0.2)]">
          <div className="app-surface max-h-[300px] w-screen max-w-[300px] overflow-auto rounded-[10px] p-4">
            {historyNoteList.map((note) => {
              return (
                <div
                  className="flex items-center gap-1.5 border-b border-[#383838]/30 py-2"
                  key={note.id}
                >
                  <p className="mr-auto">{note.title}</p>
                  <Tippy content="Восстановить из истории">
                    <button
                      className="app-icon-btn h-6 w-6 rounded-full text-[14px] hover:border-brand-primary/60 hover:text-brand-primary"
                      onClick={() => {
                        dispatch(
                          updateNoteApi({
                            isDeleted: false,
                            id: note.id,
                            title: note.title,
                            completed: note.completed,
                          })
                        ).finally(() => {
                          dispatch(
                            getNotesApi({
                              dateStart: date.start,
                              dateEnd: date.end,
                            })
                          );
                        });
                      }}
                    >
                      <MdOutlineSettingsBackupRestore />
                    </button>
                  </Tippy>
                  <Tippy content="Удалить без возврата">
                    <button
                      className="app-icon-btn h-6 w-6 rounded-full text-[14px] hover:border-red-500/50 hover:text-red-300 hover:bg-red-900/30"
                      onClick={() => {
                        dispatch(deleteNoteAlwaysApi(note.id)).finally(() => {
                          dispatch(
                            getNotesApi({
                              dateStart: date.start,
                              dateEnd: date.end,
                            })
                          );
                        });
                      }}
                    >
                      <RiDeleteBin3Line />
                    </button>
                  </Tippy>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
