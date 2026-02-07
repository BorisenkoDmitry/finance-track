import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { setOpenNoteForm } from "../../../stores/NotesSlice/noteSlice";
import { ContentHeader } from "../../Layouts/ContentHeader/ContentHeader";
import { ContentMain } from "../../Layouts/ContentMain/ContentMain";
import { Button } from "../../UI/Button/Button";
import { Loader } from "../../UI/Loader/Loader";
import { HistoryNote } from "./HistoryNote/HistoryNote";
import { NoteForm } from "./NoteForm/NoteForm";
import { NotesList } from "./NotesList/NotesList";

export const Notes = () => {
  const { isLoading } = useAppSelector((st) => st.notes);
  const dispatch = useAppDispatch();

  return (
    <>
      <ContentHeader
        dateOn={{
          isDay: false,
          isMonth: true,
          isYear: true,
        }}
        title="Заметки"
        subtitle={
          <>
            <p>Создавайте заметки для ваших покупок</p>
          </>
        }
      >
        <div className="flex self-center gap-2.5">
          <Button
            onClick={() => {
              dispatch(setOpenNoteForm(true));
            }}
          >
            +
          </Button>
          <HistoryNote />
        </div>
      </ContentHeader>
      <ContentMain className="p-10">
        <NotesList />
        <NoteForm />
        <Loader isLoading={isLoading} />
      </ContentMain>
    </>
  );
};
