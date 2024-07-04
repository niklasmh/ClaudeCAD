export type LLMMessage = LLMTextMessage | LLMImageMessage;

export type LLMTextMessage = {
  type: "text";
  role: Role;
  text: string;
  model: LLMModel;
  date: string;
};

export type LLMImageMessage = {
  type: "image";
  role: Role;
  image: string;
  model: LLMModel;
  date: string;
};

export type Role = "user" | "assistant" | "system";

export type LLMAnthropicModel =
  | "claude-1.2-instant"
  | "claude-3-opus"
  | "claude-3-sonnet"
  | "claude-3-haiku"
  | "claude-3.5";
export type LLMModel = LLMAnthropicModel;

export const defaultModel: LLMModel = "claude-3.5";
