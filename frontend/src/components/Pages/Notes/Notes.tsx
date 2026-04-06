import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { setOpenNoteForm } from "../../../stores/NotesSlice/noteSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { FloatingAction } from "../../UI/FloatingAction/FloatingAction";
import { Loader } from "../../UI/Loader/Loader";
import { HistoryNote } from "./HistoryNote/HistoryNote";
import { NoteForm } from "./NoteForm/NoteForm";
import { NotesList } from "./NotesList/NotesList";
import { Sparkles } from "lucide-react";

export const Notes = () => {
  const { isLoading } = useAppSelector((st) => st.notes);
  const dispatch = useAppDispatch();

  return (
    <>
      <ContentHeader
        dateOn={{ isMonth: true, isYear: true }}
        title="Заметки"
        subtitle={
          <p className="text-grey-200/60 hidden sm:block">Создавайте заметки для ваших покупок</p>
        }
      >
        <div className="flex items-center gap-1 rounded-xl border border-primary-700/20 bg-primary-800/30 p-0.5">
          <HistoryNote />
        </div>
      </ContentHeader>
      <ContentMain>
        <NotesList />
        <NoteForm />
        <Loader isLoading={isLoading} />
      </ContentMain>

      {/* Mobile FAB */}
      <FloatingAction
        onClick={() => dispatch(setOpenNoteForm(true))}
        icon={<Sparkles size={16} />}
        label="Заметка"
      />
    </>
  );
};
