import { create } from "zustand";
import {
  defaultAnthropicModel,
  defaultModel,
  defaultOpenAIModel,
  isAnthropicKey,
  isOpenAIKey,
  LLMMessage,
  LLMModel,
} from "./types/llm";
import { receiveFromPersistentStore } from "./helpers/persistentStorage";

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
  apiKey: string;
  setTextInput: (textInput: string) => void;
  setImageInput: (imageInput: string) => void;
  setError: (error: string | null) => void;
  setSendingMessage: (sendingMessage: boolean) => void;
  setMessages: (messages: LLMMessage[]) => void;
  setModel: (model: LLMModel) => void;
  setProjectName: (projectName: string) => void;
  setAutoRetry: (autoRetry: boolean) => void;
  setMaxRetryCount: (retryCount: number) => void;
  setApiKey: (apiKey: string) => void;
}

const apiKey =
  receiveFromPersistentStore<string>("anthropic_api_key", "") ||
  receiveFromPersistentStore<string>("openai_api_key", "");

export const useAppStore = create<AppState>((set) => ({
  textInput: "",
  imageInput: "",
  error: null,
  sendingMessage: false,
  messages: [],
  model: isAnthropicKey(apiKey) ? defaultAnthropicModel : isOpenAIKey(apiKey) ? defaultOpenAIModel : defaultModel,
  projectName: "",
  autoRetry: true,
  maxRetryCount: 4,
  apiKey,
  setTextInput: (textInput: string) => set({ textInput }),
  setImageInput: (imageInput: string) => set({ imageInput }),
  setError: (error: string | null) => set({ error }),
  setSendingMessage: (sendingMessage: boolean) => set({ sendingMessage }),
  setMessages: (messages: LLMMessage[]) => set({ messages }),
  setModel: (model: LLMModel) => set({ model }),
  setProjectName: (projectName: string) => set({ projectName }),
  setAutoRetry: (autoRetry: boolean) => set({ autoRetry }),
  setMaxRetryCount: (maxRetryCount: number) => set({ maxRetryCount }),
  setApiKey: (apiKey: string) => set({ apiKey }),
}));
