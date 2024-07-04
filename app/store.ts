import { create } from "zustand";
import { defaultModel, LLMMessage, LLMModel } from "./types/llm";

interface AppState {
  textInput: string;
  imageInput: string;
  error: string | null;
  sendingMessage: boolean;
  messages: LLMMessage[];
  model: LLMModel;
  setTextInput: (textInput: string) => void;
  setImageInput: (imageInput: string) => void;
  setError: (error: string | null) => void;
  setSendingMessage: (sendingMessage: boolean) => void;
  setMessages: (messages: LLMMessage[]) => void;
  setModel: (model: LLMModel) => void;
}

export const useAppStore = create<AppState>((set) => ({
  textInput: "",
  imageInput: "",
  error: null,
  sendingMessage: false,
  messages: [],
  model: defaultModel,
  setTextInput: (textInput: string) => set({ textInput }),
  setImageInput: (imageInput: string) => set({ imageInput }),
  setError: (error: string | null) => set({ error }),
  setSendingMessage: (sendingMessage: boolean) => set({ sendingMessage }),
  setMessages: (messages: LLMMessage[]) => set({ messages }),
  setModel: (model: LLMModel) => set({ model }),
}));
