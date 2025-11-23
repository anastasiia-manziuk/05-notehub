import axios from "axios";
import type { Note, CreateNoteData } from "../types/note";

export interface NotesResponse {
  notes: Note[];
  page: number;
  totalPages: number;
  totalResults: number;
}

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export const fetchNotes = async (
  page = 1,
  search = "",
  perPage = 12
): Promise<NotesResponse> => {
  const res = await axios.get<NotesResponse>(`${BASE_URL}/notes`, {
    params: { page, search, perPage },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const res = await axios.post<Note>(`${BASE_URL}/notes`, data, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
};

export const deleteNote = async (id: Note["id"]): Promise<void> => {
  await axios.delete(`${BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
};
