import { LLMCodeMessage, modelNames } from "@/app/types/llm";
import { Eye, EyeOff, Pencil, Play, Save, Trash } from "lucide-react";
import { useState } from "react";
import { CodeEditor } from "../editor/Editor";

type Props = {
  message: LLMCodeMessage;
  onChange: (message: LLMCodeMessage) => void;
  onDelete: () => void;
  onRun: (code: string) => void;
};

export const CodeMessage = ({ message, onChange, onRun, onDelete }: Props) => {
  const [currentMessage, setCurrentMessage] = useState<LLMCodeMessage>(message);

  const isUser = message.role === "user";

  const handleCodeChange = (code: string) => {
    setCurrentMessage({ ...currentMessage, text: code });
  };

  const handleShow = () => {
    setCurrentMessage({ ...currentMessage, hidden: false });
    onChange({ ...currentMessage, hidden: false });
  };

  const handleHide = () => {
    setCurrentMessage({ ...currentMessage, hidden: true });
    onChange({ ...currentMessage, hidden: true });
  };

  const tools = (
    <div
      className={`absolute group-hover:visible invisible top-0 bottom-0 flex flex-row items-center mx-3 gap-2 opacity-30 ${
        isUser ? "right-full flex-row-reverse" : "left-full"
      } ${message.hidden === false ? "!visible" : ""}`}
    >
      {message.hidden === false && (
        <div onClick={handleHide} className="hover:opacity-80 cursor-pointer" title="Hide code">
          <EyeOff size={16} />
        </div>
      )}
      <div onClick={() => onRun(currentMessage.text)} className="hover:opacity-80 cursor-pointer">
        <Play size={16} />
      </div>
      <div onClick={onDelete} className="hover:text-red-300 cursor-pointer">
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
      <div onClick={handleShow} className="hover:opacity-80 cursor-pointer" title="Show code">
        <Eye size={16} />
      </div>
      <div onClick={onDelete} className="hover:text-red-300 cursor-pointer" title="Remove code">
        <Trash size={16} />
      </div>
    </div>
  );

  return (
    <div className={`chat group ${isUser ? "chat-end pl-12" : "chat-start pr-12"}`}>
      <div className="chat-header">{modelNames[message.model]}</div>
      <div className={`chat-bubble relative ${isUser ? "bg-[#2a323c88]" : ""} ${message.hidden ? "" : "w-full p-3"}`}>
        {!message.hidden && <CodeEditor code={currentMessage.text} setCode={handleCodeChange} />}
        {message.hidden && (
          <div className="text-gray-400">
            <i>{message.hiddenText || "This code is hidden"}</i>
          </div>
        )}
        {message.hidden ? hidden : tools}
      </div>
      <div className="chat-footer opacity-50">Sent {new Date(message.date).toLocaleString()}</div>
    </div>
  );
};
