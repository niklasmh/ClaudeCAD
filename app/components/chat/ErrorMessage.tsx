import { LLMErrorMessage, modelNames } from "@/app/types/llm";
import { BugPlay, Trash } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Props = {
  message: LLMErrorMessage;
  onDelete: () => void;
  onFix: () => void;
};

export const ErrorMessage = ({ message, onFix, onDelete }: Props) => {
  const isUser = message.role === "user";

  const tools = (
    <div
      className={`absolute group-hover:visible invisible top-0 bottom-0 flex flex-row items-center mx-3 gap-2 opacity-30 ${
        isUser ? "right-full flex-row-reverse" : "left-full"
      }`}
    >
      <div onClick={onFix} className="hover:opacity-80 cursor-pointer" title="Fix the bug">
        <BugPlay size={16} />
      </div>
      <div onClick={onDelete} className="hover:text-red-300 cursor-pointer" title="Remove the error message">
        <Trash size={16} />
      </div>
    </div>
  );

  return (
    <div className={`chat group ${isUser ? "chat-end pl-12" : "chat-start pr-12"}`}>
      <div className="chat-header">An error message</div>
      <div className={`chat-bubble relative w-full p-3 prose ${isUser ? "bg-[#2a323c88]" : ""}`}>
        <pre className="m-0">
          <code className="w-full whitespace-pre-wrap text-red-400">{message.text}</code>
        </pre>
        {tools}
      </div>
      <div className="chat-footer opacity-50">Sent {new Date(message.date).toLocaleString()}</div>
    </div>
  );
};
