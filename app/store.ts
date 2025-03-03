import { create } from "zustand";
import { LLMMessage, LLMModel } from "./types/llm";

interface AppState {
  textInput: string;
  imageInput: string;
  error: string | null;
  sendingMessage: boolean;
  messages: LLMMessage[];
  model: LLMModel;
  projectName: string;
  autoRetry: boolean;
  maxRetryCount: number;
  setTextInput: (textInput: string) => void;
  setImageInput: (imageInput: string) => void;
  setError: (error: string | null) => void;
  setSendingMessage: (sendingMessage: boolean) => void;
  setMessages: (messages: LLMMessage[]) => void;
  setModel: (model: LLMModel) => void;
  setProjectName: (projectName: string) => void;
  setAutoRetry: (autoRetry: boolean) => void;
  setMaxRetryCount: (retryCount: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  textInput: "",
  imageInput: "",
  error: null,
  sendingMessage: false,
  messages: [],
  model: LLMModel.NOT_SET,
  projectName: "",
  autoRetry: true,
  maxRetryCount: 4,
  setTextInput: (textInput: string) => set({ textInput }),
  setImageInput: (imageInput: string) => set({ imageInput }),
  setError: (error: string | null) => set({ error }),
  setSendingMessage: (sendingMessage: boolean) => set({ sendingMessage }),
  setMessages: (messages: LLMMessage[]) => set({ messages }),
  setModel: (model: LLMModel) => set({ model }),
  setProjectName: (projectName: string) => set({ projectName }),
  setAutoRetry: (autoRetry: boolean) => set({ autoRetry }),
  setMaxRetryCount: (maxRetryCount: number) => set({ maxRetryCount }),
}));
