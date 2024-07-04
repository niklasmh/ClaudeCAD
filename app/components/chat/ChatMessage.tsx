import { LLMMessage, LLMTextMessage } from "@/app/types/llm";
import { Pencil, RefreshCw, Save, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  message: LLMTextMessage;
  onChange: (message: LLMMessage) => void;
  onDelete: () => void;
  onRerun: () => void;
};

export const ChatMessage = ({ message, onChange, onRerun, onDelete }: Props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<LLMTextMessage>(message);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isUser = message.role === "user";

  const handleOpenEditButtonClick = () => {
    setEdit(true);
  };

  const handleSaveEditButtonClick = () => {
    setEdit(false);
    onChange(currentMessage);
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;

    if (el) {
      if (el.value.includes("\n")) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      } else {
        el.style.height = "auto";
        el.style.height = "48px";
      }
    }
  };

  const handleInputChange = () => {
    resizeTextarea();
  };

  useEffect(() => {
    setTimeout(() => {
      resizeTextarea();
    }, 100);
  }, [edit]);

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
      {isUser && (
        <div onClick={onRerun} className="hover:opacity-80 cursor-pointer">
          <RefreshCw size={16} />
        </div>
      )}
      <div onClick={onDelete} className="hover:text-red-300 cursor-pointer">
        <Trash size={16} />
      </div>
    </div>
  );

  return (
    <div className={`chat group ${isUser ? "chat-end" : "chat-start"}`}>
      <div className="chat-header">{message.model}</div>
      <div className={`chat-bubble relative ${isUser ? "bg-[#2a323c88]" : ""} ${edit ? "w-full p-0" : ""}`}>
        {!edit && <p>{message.text}</p>}
        {edit && (
          <textarea
            className="w-full flex-1 h-[48px] textarea bg-[#2a323c] resize-none overflow-hidden border-none !outline-none"
            value={currentMessage.text}
            ref={textareaRef}
            onChange={(e) =>
              setCurrentMessage({
                ...currentMessage,
                text: e.target.value,
              })
            }
            onInput={handleInputChange}
          />
        )}
        {tools}
      </div>
      <div className="chat-footer opacity-50">Sent {new Date(message.date).toLocaleString()}</div>
    </div>
  );
};
