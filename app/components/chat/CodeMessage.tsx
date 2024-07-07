import { LLMCodeMessage, modelNames } from "@/app/types/llm";
import { Eye, Pencil, Play, Save, Trash } from "lucide-react";
import { useState } from "react";
import { CodeEditor } from "../editor/Editor";

type Props = {
  message: LLMCodeMessage;
  onChange: (message: LLMCodeMessage) => void;
  onDelete: () => void;
  onRun: (code: string) => void;
};

export const CodeMessage = ({ message, onChange, onRun, onDelete }: Props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<LLMCodeMessage>(message);

  const isUser = message.role === "user";

  const handleOpenEditButtonClick = () => {
    setEdit(true);
  };

  const handleSaveEditButtonClick = () => {
    setEdit(false);
    onChange(currentMessage);
  };

  const handleCodeChange = (code: string) => {
    setCurrentMessage({ ...currentMessage, text: code });
  };

  const handleShow = () => {
    onChange({ ...currentMessage, hidden: false });
  };

  const tools = (
    <div
      className={`absolute group-hover:visible invisible top-0 bottom-0 flex flex-row items-center mx-3 gap-2 opacity-30 ${
        isUser ? "right-full flex-row-reverse" : "left-full"
      }`}
    >
      {!edit && (
        <div onClick={handleOpenEditButtonClick} className="hover:opacity-80 cursor-pointer">
          <Pencil size={16} />
        </div>
      )}
      {edit && (
        <div onClick={handleSaveEditButtonClick} className="hover:opacity-80 cursor-pointer">
          <Save size={16} />
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
      <div className="chat-header">{modelNames[message.model]}</div>
      <div className={`chat-bubble relative w-full p-3 ${isUser ? "bg-[#2a323c88]" : ""}`}>
        {!message.hidden && <CodeEditor readOnly={!edit} code={currentMessage.text} setCode={handleCodeChange} />}
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
