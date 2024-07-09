import { BugPlay } from "lucide-react";
import { ReactNode, useState } from "react";

type Props = {
  type: "fixCode";
  loading?: boolean;
  messages: ReactNode[];
};

const groupTypes = {
  fixCode: {
    title: "Fixed some bugs",
    loadingTitle: "Fixing some bugs...",
    icon: <BugPlay size={16} />,
  },
};

export const MessageGroup = ({ messages, type, loading }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  if (!type) {
    return null;
  }

  const { title, loadingTitle, icon } = groupTypes[type];

  const toggleOpen = () => {
    setOpen((o) => !o);
  };

  return (
    <div className={`collapse collapse-arrow bg-[#0001] my-4 ${open ? "collapse-open" : "collapse-close"}`}>
      <div className="collapse-title bg-[#0001] cursor-pointer flex flex-row gap-4" onClick={toggleOpen}>
        {loading ? <span className="loading loading-spinner loading-sm"></span> : icon}
        <span>{loading ? loadingTitle : title}</span>
      </div>
      <div className="collapse-content">
        <div className="mt-4">{messages}</div>
      </div>
    </div>
  );
};
