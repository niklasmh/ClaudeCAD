import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

import { isAnthropicKey, isOpenAIKey, LLMMessage, LLMTextMessage } from "../types/llm";
import { receiveFromPersistentStore, saveToPersistentStore } from "./persistentStorage";

type ErrorMessage = { error: string };

type LLMConnector = {
  [model: string]: (messages: LLMMessage[]) => Promise<string | ErrorMessage>;
};

const getAPIKey = (): string => {
  try {
    const anthropicKey = receiveFromPersistentStore<string>("anthropic_api_key", "");

    if (!anthropicKey) {
      const openAIKey = receiveFromPersistentStore<string>("openai_api_key", "");

      if (!openAIKey) {
        throw new Error("No API key found");
      }

      return openAIKey;
    }

    return anthropicKey;
  } catch (e) {
    const key = prompt("Please enter your Anthropic or OpenAI API key");

    if (key) {
      if (isAnthropicKey(key)) {
        saveToPersistentStore<string>("anthropic_api_key", key);
        return key;
      }

      if (isOpenAIKey(key)) {
        saveToPersistentStore<string>("openai_api_key", key);
        window.location.reload();
        return key;
      }
    }

    return "";
  }
};

const anthropicConnector = async (model: string, messages: LLMMessage[]): Promise<string | ErrorMessage> => {
  const response = fetch("/api/claude", {
    method: "POST",
    body: JSON.stringify({
      model: mapAnthropicModel(model),
      temperature: 0,
      system: getSystemMessage(messages),
      messages: groupAnthropicMessagesByRole(messages.map(mapAnthropicMessage)),
      max_tokens: 1000,
      api_key: getAPIKey(),
    }),
  });
  try {
    const data = (await response.then((r) => r.json())) as Anthropic.Messages.Message | ErrorMessage;
    if ("error" in data) {
      return data;
    }
    return (data.content[0] as any).text;
  } catch (e) {
    return { error: await response.then((r) => r.text()) };
  }
};

const openaiConnector = async (model: string, messages: LLMMessage[]): Promise<string | ErrorMessage> => {
  const response = fetch("/api/openai", {
    method: "POST",
    body: JSON.stringify({
      model: mapOpenAIModel(model),
      temperature: 0,
      system: getSystemMessage(messages),
      messages: groupOpenAIMessagesByRole(messages.map(mapOpenAIMessage)),
      max_tokens: 1000,
      api_key: getAPIKey(),
    }),
  });
  try {
    const data = (await response.then((r) => r.json())) as OpenAI.ChatCompletion | ErrorMessage;
    if ("error" in data) {
      return data;
    }
    return (data.choices[0].message as any).content;
  } catch (e) {
    return { error: await response.then((r) => r.text()) };
  }
};

export const llmConnector: LLMConnector = {
  "claude-1.2-instant": (messages) => anthropicConnector("claude-1.2-instant", messages),
  "claude-3-opus": (messages) => anthropicConnector("claude-3-opus", messages),
  "claude-3-sonnet": (messages) => anthropicConnector("claude-3-sonnet", messages),
  "claude-3-haiku": (messages) => anthropicConnector("claude-3-haiku", messages),
  "claude-3.5": (messages) => anthropicConnector("claude-3.5", messages),
  "gpt-4o": (messages) => openaiConnector("gpt-4o", messages),
  "gpt-4o-mini": (messages) => openaiConnector("gpt-4o-mini", messages),
};

const getSystemMessage = (messages: LLMMessage[]): string => {
  return messages
    .filter((message) => message.role === "system" && message.type === "text")
    .map((message) => (message as LLMTextMessage).text)
    .join("\n");
};

const mapAnthropicRole = (
  role: LLMMessage["role"]
): Anthropic.MessageCreateParamsNonStreaming["messages"][0]["role"] => {
  if (role === "user") {
    return "user";
  }
  return "assistant";
};

const mapAnthropicMessage = (message: LLMMessage): Anthropic.MessageCreateParamsNonStreaming["messages"][0] => {
  const role = mapAnthropicRole(message.role);

  if (message.type === "text") {
    return {
      role,
      content: [{ type: message.type, text: message.text }],
    };
  } else if (message.type === "image") {
    return {
      role,
      content: [
        {
          type: message.type,
          source: {
            type: "base64",
            media_type: "image/png",
            data: message.image.split(",")[1],
          },
        },
      ],
    };
  } else if (message.type === "code") {
    return {
      role,
      content: [{ type: "text", text: "Here is the code used:\n\n```javascript\n" + message.text + "\n```" }],
    };
  } else if (message.type === "error") {
    return {
      role,
      content: [
        { type: "text", text: "This is the error message from the code above:\n\n```\n" + message.text + "\n```" },
      ],
    };
  } else if (message.type === "model") {
    return {
      role,
      content: [],
    };
  } else {
    throw new Error(`Unknown message type: ${(message as any).type}`);
  }
};

const mapOpenAIRole = (role: LLMMessage["role"]): OpenAI.ChatCompletionCreateParams["messages"][0]["role"] => {
  if (role === "user") {
    return "user";
  }
  return "assistant";
};

const mapOpenAIMessage = (message: LLMMessage): OpenAI.ChatCompletionCreateParams["messages"][0] => {
  const role = mapOpenAIRole(message.role);

  if (message.type === "text") {
    return {
      role,
      content: [{ type: message.type, text: message.text }],
    } as OpenAI.ChatCompletionCreateParams["messages"][0];
  } else if (message.type === "image") {
    return {
      role,
      content: [
        {
          type: "image_url",
          image_url: {
            url: "data:image/png;base64," + message.image.split(",")[1],
          },
        },
      ],
    } as OpenAI.ChatCompletionCreateParams["messages"][0];
  } else if (message.type === "code") {
    return {
      role,
      content: [{ type: "text", text: "Here is the code used:\n\n```javascript\n" + message.text + "\n```" }],
    } as OpenAI.ChatCompletionCreateParams["messages"][0];
  } else if (message.type === "error") {
    return {
      role,
      content: [
        { type: "text", text: "This is the error message from the code above:\n\n```\n" + message.text + "\n```" },
      ],
    } as OpenAI.ChatCompletionCreateParams["messages"][0];
  } else if (message.type === "model") {
    return {
      role,
      content: [],
    } as OpenAI.ChatCompletionCreateParams["messages"][0];
  } else {
    throw new Error(`Unknown message type: ${(message as any).type}`);
  }
};

const groupAnthropicMessagesByRole = (
  messages: Anthropic.MessageCreateParamsNonStreaming["messages"]
): Anthropic.MessageCreateParamsNonStreaming["messages"] => {
  const newMessages = [messages[0]];

  for (let i = 0; i < messages.length - 1; i++) {
    const message = messages[i];
    const nextMessage = messages[i + 1];

    if (message.role !== nextMessage.role) {
      newMessages.push(nextMessage);
    } else {
      newMessages[newMessages.length - 1].content = [
        ...newMessages[newMessages.length - 1].content,
        ...(nextMessage.content as any),
      ];
    }
  }

  return newMessages;
};

const groupOpenAIMessagesByRole = (
  messages: OpenAI.ChatCompletionCreateParams["messages"]
): OpenAI.ChatCompletionCreateParams["messages"] => {
  const newMessages = [messages[0]];

  for (let i = 0; i < messages.length - 1; i++) {
    const message = messages[i];
    const nextMessage = messages[i + 1];

    if (message.role !== nextMessage.role) {
      newMessages.push(nextMessage);
    } else {
      newMessages[newMessages.length - 1].content = [
        ...(newMessages[newMessages.length - 1].content || []),
        ...(nextMessage.content as any),
      ];
    }
  }

  return newMessages;
};

const mapAnthropicModel = (model: string): Anthropic.MessageCreateParamsNonStreaming["model"] => {
  switch (model) {
    case "claude-1.2-instant":
      return "claude-instant-1.2";
    case "claude-3-opus":
      return "claude-3-opus-20240229";
    case "claude-3-sonnet":
      return "claude-3-sonnet-20240229";
    case "claude-3-haiku":
      return "claude-3-haiku-20240307";
    case "claude-3.5":
    default:
      return "claude-3-5-sonnet-20240620";
  }
};

const mapOpenAIModel = (model: string): OpenAI.Chat.ChatModel => {
  switch (model) {
    case "gpt-4o-mini":
      return "gpt-4o-mini";
    case "gpt-4o":
    default:
      return "gpt-4o";
  }
};
