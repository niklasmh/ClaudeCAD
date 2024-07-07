import { Geometry } from "./geometry";

export type LLMMessage = LLMTextMessage | LLMImageMessage | LLMCodeMessage | LLMModelMessage | LLMErrorMessage;

export type BaseMessage = {
  role: Role;
  date: string;
  hidden?: boolean;
  hiddenText?: string;
};

export type LLMTextMessage = {
  type: "text";
  text: string;
  model: LLMModel;
} & BaseMessage;

export type LLMImageMessage = {
  type: "image";
  image: string;
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
}

export const defaultModel = LLMModel.CLAUDE_3_5;

export const modelNames: Record<LLMModel, string> = {
  [LLMModel.CLAUDE_1_2_INSTANT]: "Claude 1.2 Instant",
  [LLMModel.CLAUDE_3_OPUS]: "Claude 3 Opus",
  [LLMModel.CLAUDE_3_SONNET]: "Claude 3 Sonnet",
  [LLMModel.CLAUDE_3_HAIKU]: "Claude 3 Haiku",
  [LLMModel.CLAUDE_3_5]: "Claude 3.5 Sonnet",
};
