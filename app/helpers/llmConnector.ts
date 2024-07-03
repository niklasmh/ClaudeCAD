import Anthropic from "@anthropic-ai/sdk";
import { LLMAnthropicModel, LLMMessage, LLMModel, LLMTextMessage } from "../components/models/llm";

type LLMConnector = {
  [model in LLMModel]: (messages: LLMMessage[]) => Promise<string>;
};

const anthropicConnector = async (model: LLMAnthropicModel, messages: LLMMessage[]) => {
  const response = (await fetch("/api/claude", {
    method: "POST",
    body: JSON.stringify({
      model: mapModel(model),
      temperature: 0,
      system: getSystemMessage(messages),
      messages: groupMessagesByRole(messages.map(mapMessage)),
      max_tokens: 1000,
    }),
  }).then((r) => r.json())) as Anthropic.Messages.Message;

  return (response.content[0] as any).text;
};

export const llmConnector: LLMConnector = {
  "claude-1.2-instant": (messages) => anthropicConnector("claude-1.2-instant", messages),
  "claude-3-opus": (messages) => anthropicConnector("claude-3-opus", messages),
  "claude-3-sonnet": (messages) => anthropicConnector("claude-3-sonnet", messages),
  "claude-3-haiku": (messages) => anthropicConnector("claude-3-haiku", messages),
  "claude-3.5": (messages) => anthropicConnector("claude-3.5", messages),
};

const getSystemMessage = (messages: LLMMessage[]): string => {
  return messages
    .filter((message) => message.role === "system" && message.type === "text")
    .map((message) => (message as LLMTextMessage).text)
    .join("\n");
};

const mapMessage = (message: LLMMessage): Anthropic.MessageCreateParamsNonStreaming["messages"][0] => {
  if (message.type === "text") {
    return {
      role: "user",
      content: [{ type: message.type, text: message.text }],
    };
  } else if (message.type === "image") {
    return {
      role: "user",
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
  } else {
    throw new Error("Only text and image messages are supported");
  }
};

const groupMessagesByRole = (
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
  console.log(newMessages);

  return newMessages;
};

const mapModel = (model: LLMAnthropicModel): Anthropic.MessageCreateParamsNonStreaming["model"] => {
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
      return "claude-3-5-sonnet-20240620";
  }
};
