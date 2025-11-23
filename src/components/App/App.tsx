import { useState } from "react";
import css from "./App.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import NoteList from "../NoteList/NoteList";
import useModalControl from "../hooks/useModalControl";
import SearchBox from "../SearchBox/SearchBox";
import { fetchNotes, createNote } from "../../services/noteService";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import type { NotesResponse } from "../../services/noteService";
import type { CreateNoteData } from "../../types/note";

function App() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const createNoteModal = useModalControl();
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<NotesResponse>({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes(page, debouncedSearch, 12),
  });

  const createNoteMutation = useMutation({
    mutationFn: (data: CreateNoteData) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] as const });
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox search={search} onChange={setSearch} />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={createNoteModal.openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <strong className={css.loading}>Loading notes...</strong>}

      {!isLoading && data?.notes?.length ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && <p>No notes found</p>
      )}

      {createNoteModal.isModalOpen && (
        <Modal onClose={createNoteModal.closeModal}>
          <NoteForm
            onCancel={createNoteModal.closeModal}
            onSubmit={async (newNoteData) => {
              await createNoteMutation.mutateAsync(newNoteData);
              createNoteModal.closeModal();
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
