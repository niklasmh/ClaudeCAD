import { create } from "zustand";
import { Message } from "./types/chat";

interface AppState {
  textInput: string;
  imageInput: string;
  error: string | null;
  sendingMessage: boolean;
  messages: Message[];
}

export const useAppStore = create((set) => ({
  textInput: "",
  imageInput: "",
  error: null,
  sendingMessage: false,
  messages: [],
  setTextInput: (textInput: string) => set({ textInput }),
  setImageInput: (imageInput: string) => set({ imageInput }),
  setError: (error: string | null) => set({ error }),
  setSendingMessage: (sendingMessage: boolean) => set({ sendingMessage }),
  setMessages: (messages: Message[]) => set({ messages }),
}));
