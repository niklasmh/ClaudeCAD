import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { Geometry } from "./geometry";

export type LLMMessage = LLMTextMessage | LLMImageMessage | LLMCodeMessage | LLMModelMessage | LLMErrorMessage;

export type BaseMessage = {
  role: Role;
  date: string;
  hidden?: boolean;
  hiddenText?: string | null;
};

export type LLMTextMessage = {
  type: "text";
  text: string;
  label: "request" | "assistant-no-code" | "description";
  model: LLMModel;
} & BaseMessage;

export type LLMImageMessage = {
  type: "image";
  image: string;
  label: "sketch" | "model-with-sketch" | "model" | "normal-mapping";
  model: LLMModel;
  editable?: boolean;
} & BaseMessage;

export type LLMCodeMessage = {
  type: "code";
  text: string;
  model: LLMModel;
} & BaseMessage;

export type LLMModelMessage = {
  type: "model";
  geometries: Geometry[];
  originalGeometries: Geom3[];
} & BaseMessage;

export type LLMErrorMessage = {
  type: "error";
  text: string;
} & BaseMessage;

export type Role = "user" | "assistant" | "system";

export enum LLMModel {
  CLAUDE_1_2_INSTANT = "claude-1.2-instant",
  CLAUDE_3_OPUS = "claude-3-opus",
  CLAUDE_3_SONNET = "claude-3-sonnet",
  CLAUDE_3_HAIKU = "claude-3-haiku",
  CLAUDE_3_5 = "claude-3.5",
  GPT_4O = "gpt-4o",
  GPT_4O_MINI = "gpt-4o-mini",
  GPT_O1_MINI = "gpt-o1-mini",
  GPT_O3_MINI = "gpt-o3-mini",
  OLLAMA_DEEPSEEK_R1_32B = "ollama-deepseek-r1:32b",
  OLLAMA_DEEPSEEK_CODER_V2_16B = "ollama-deepseek-coder-v2:16b",
  OLLAMA_LLAMA3_2_VISION_11B = "ollama-llama3.2-vision:11b",
}

export const defaultModel = LLMModel.CLAUDE_3_5;
export const defaultAnthropicModel = LLMModel.CLAUDE_3_5;
export const defaultOpenAIModel = LLMModel.GPT_4O_MINI;

export const modelNames: Record<LLMModel, string> = {
  [LLMModel.CLAUDE_1_2_INSTANT]: "Claude 1.2 Instant",
  [LLMModel.CLAUDE_3_OPUS]: "Claude 3 Opus",
  [LLMModel.CLAUDE_3_SONNET]: "Claude 3 Sonnet",
  [LLMModel.CLAUDE_3_HAIKU]: "Claude 3 Haiku",
  [LLMModel.CLAUDE_3_5]: "Claude 3.5 Sonnet",
  [LLMModel.GPT_4O]: "GPT-4o",
  [LLMModel.GPT_4O_MINI]: "GPT-4o Mini",
  [LLMModel.GPT_O1_MINI]: "GPT o1-mini",
  [LLMModel.GPT_O3_MINI]: "GPT o3-mini",
  [LLMModel.OLLAMA_DEEPSEEK_R1_32B]: "Ollama DeepSeek R1 32B",
  [LLMModel.OLLAMA_DEEPSEEK_CODER_V2_16B]: "Ollama DeepSeek Coder V2 16B",
  [LLMModel.OLLAMA_LLAMA3_2_VISION_11B]: "Ollama Llama3.2 Vision 11B",
};

export const isAnthropicKey = (key: string) => key.startsWith("sk-ant-");
export const isOpenAIKey = (key: string) => key.startsWith("sk-proj-");
