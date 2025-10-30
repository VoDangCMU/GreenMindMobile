import React from "react";
import type { ReactNode } from "react";

interface AppHeaderButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const AppHeaderButton: React.FC<AppHeaderButtonProps> = ({ icon, onClick, disabled }) => {
  let iconEl = icon;
  if (React.isValidElement(icon) && typeof icon.type === "function") {
    iconEl = React.cloneElement(icon as React.ReactElement<any>, {
      ...((icon as React.ReactElement<any>).props || {}),
      className: "w-6 h-6 text-gray-700 dark:text-gray-200 " + ((icon as React.ReactElement<any>).props.className || "")
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition"
    >
      {iconEl}
    </button>
  );
};

export default AppHeaderButton;
