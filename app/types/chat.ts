import { LLMModel } from "./llm";

export interface Message {
  role: "user" | "assistant" | "system";
  type: "text" | "image";
  text: string;
  image: string;
  model: LLMModel;
  date: string;
}
