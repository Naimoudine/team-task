import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
  showNotif: boolean;
  setShowNotif: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function Notif({
  children,
  showNotif,
  setShowNotif,
  setErrorMessage,
  setSuccessMessage,
}: Props) {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={
        showNotif
          ? "absolute bottom-5 left-1/2 -translate-x-1/2 py-1 px-2 flex items-center gap-4 font-medium text-white bg-black rounded-lg"
          : "hidden"
      }
    >
      {children}
      <button onClick={() => setShowNotif(!showNotif)}>
        <XMarkIcon className="size-3" />
      </button>
    </div>
  );
}
