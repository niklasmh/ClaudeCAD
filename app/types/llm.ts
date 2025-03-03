import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { Geometry } from "./geometry";
import { receiveFromPersistentStore } from "../helpers/persistentStorage";

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
  NOT_SET = "not-set",
  CLAUDE_1_2_INSTANT = "claude-1.2-instant",
  CLAUDE_3_OPUS = "claude-3-opus",
  CLAUDE_3_SONNET = "claude-3-sonnet",
  CLAUDE_3_HAIKU = "claude-3-haiku",
  CLAUDE_3_5 = "claude-3.5",
  CLAUDE_3_7 = "claude-3.7",
  GPT_4O = "gpt-4o",
  GPT_4O_MINI = "gpt-4o-mini",
  GPT_O1 = "gpt-o1",
  //GPT_O1_MINI = "gpt-o1-mini", // No vision
  //GPT_O3_MINI = "gpt-o3-mini", // No vision
  GPT_4_5 = "gpt-4.5",
}

export const defaultModel = LLMModel.CLAUDE_3_7;
export const defaultAnthropicModel = LLMModel.CLAUDE_3_7;
export const defaultOpenAIModel = LLMModel.GPT_4O_MINI;

export const llmModels: LLMModel[] = [
  LLMModel.CLAUDE_1_2_INSTANT,
  LLMModel.CLAUDE_3_OPUS,
  LLMModel.CLAUDE_3_SONNET,
  LLMModel.CLAUDE_3_HAIKU,
  LLMModel.CLAUDE_3_5,
  LLMModel.GPT_4O,
  LLMModel.GPT_4O_MINI,
  LLMModel.GPT_O1,
  //LLMModel.GPT_O1_MINI,
  //LLMModel.GPT_O3_MINI,
  LLMModel.GPT_4_5,
];

export const llmModelsWithTools: LLMModel[] = [
  LLMModel.CLAUDE_3_5,
  LLMModel.CLAUDE_3_7,
  LLMModel.GPT_4O,
  LLMModel.GPT_4O_MINI,
  LLMModel.GPT_O1,
  //LLMModel.GPT_O3_MINI,
];

export const llmModelsWithFormat: LLMModel[] = [
  LLMModel.GPT_4O,
  LLMModel.GPT_4O_MINI,
  LLMModel.GPT_O1,
  //LLMModel.GPT_O3_MINI,
];

export enum LLMModelEndpoint {
  CLAUDE = "claude",
  OPENAI = "openai",
}

export const endpoints: Record<LLMModel, LLMModelEndpoint> = {
  [LLMModel.NOT_SET]: LLMModelEndpoint.CLAUDE,
  [LLMModel.CLAUDE_1_2_INSTANT]: LLMModelEndpoint.CLAUDE,
  [LLMModel.CLAUDE_3_OPUS]: LLMModelEndpoint.CLAUDE,
  [LLMModel.CLAUDE_3_SONNET]: LLMModelEndpoint.CLAUDE,
  [LLMModel.CLAUDE_3_HAIKU]: LLMModelEndpoint.CLAUDE,
  [LLMModel.CLAUDE_3_5]: LLMModelEndpoint.CLAUDE,
  [LLMModel.CLAUDE_3_7]: LLMModelEndpoint.CLAUDE,
  [LLMModel.GPT_4O]: LLMModelEndpoint.OPENAI,
  [LLMModel.GPT_4O_MINI]: LLMModelEndpoint.OPENAI,
  [LLMModel.GPT_O1]: LLMModelEndpoint.OPENAI,
  //[LLMModel.GPT_O1_MINI]: LLMModelEndpoint.OPENAI,
  //[LLMModel.GPT_O3_MINI]: LLMModelEndpoint.OPENAI,
  [LLMModel.GPT_4_5]: LLMModelEndpoint.OPENAI,
};

export const endpointNames: Record<LLMModelEndpoint, string> = {
  [LLMModelEndpoint.CLAUDE]: "Anthropic",
  [LLMModelEndpoint.OPENAI]: "OpenAI",
};

export const modelNames: Record<LLMModel, string> = {
  [LLMModel.NOT_SET]: "Not set",
  [LLMModel.CLAUDE_1_2_INSTANT]: "Claude 1.2 Instant",
  [LLMModel.CLAUDE_3_OPUS]: "Claude 3 Opus",
  [LLMModel.CLAUDE_3_SONNET]: "Claude 3 Sonnet",
  [LLMModel.CLAUDE_3_HAIKU]: "Claude 3 Haiku",
  [LLMModel.CLAUDE_3_5]: "Claude 3.5 Sonnet",
  [LLMModel.CLAUDE_3_7]: "Claude 3.7 Sonnet",
  [LLMModel.GPT_4O]: "GPT-4o",
  [LLMModel.GPT_4O_MINI]: "GPT-4o mini",
  [LLMModel.GPT_O1]: "GPT o1",
  //[LLMModel.GPT_O1_MINI]: "GPT o1-mini",
  //[LLMModel.GPT_O3_MINI]: "GPT o3-mini",
  [LLMModel.GPT_4_5]: "GPT 4.5",
};

export const isAnthropicKey = (key: string) => key.startsWith("sk-ant-");
export const isOpenAIKey = (key: string) => key.startsWith("sk-proj-");

export const hasAnthropicKey = () => !!receiveFromPersistentStore<string>("anthropic_api_key", "");
export const hasOpenAIKey = () => !!receiveFromPersistentStore<string>("openai_api_key", "");
