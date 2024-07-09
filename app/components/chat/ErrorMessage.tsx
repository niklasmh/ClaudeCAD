import { LLMErrorMessage } from "@/app/types/llm";
import { BugPlay, Eye, Trash } from "lucide-react";
import { useState } from "react";

type Props = {
  message: LLMErrorMessage;
  onDelete: () => void;
  onFix: () => void;
};

export const ErrorMessage = ({ message, onFix, onDelete }: Props) => {
  const isUser = message.role === "user";
  const [currentMessage, setCurrentMessage] = useState<LLMErrorMessage>(message);

  if (message.hidden && message.hiddenText === null) {
    return null;
  }

  const handleShow = () => {
    setCurrentMessage({ ...currentMessage, hidden: false });
  };

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

  const hidden = (
    <div
      className={`absolute group-hover:visible invisible top-0 bottom-0 flex flex-row items-center mx-3 gap-2 opacity-30 ${
        isUser ? "right-full flex-row-reverse" : "left-full"
      }`}
    >
      <div onClick={handleShow} className="hover:opacity-80 cursor-pointer" title="Show message">
        <Eye size={16} />
      </div>
      <div onClick={onDelete} className="hover:text-red-300 cursor-pointer" title="Remove message">
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
        {message.hidden && (
          <div className="text-gray-400">
            <i>{message.hiddenText || "The code got an error"}</i>
          </div>
        )}
        {message.hidden ? hidden : tools}
      </div>
      <div className="chat-footer opacity-50">Sent {new Date(message.date).toLocaleString()}</div>
    </div>
  );
};
