import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface GroupItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const GroupItem = ({ title, children, defaultOpen = false }: GroupItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 border rounded-lg overflow-hidden shadow-sm">
      <button
        type="button"
        className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-medium text-gray-700">{title}</h2>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <div
        className={`bg-gray-50 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default GroupItem;