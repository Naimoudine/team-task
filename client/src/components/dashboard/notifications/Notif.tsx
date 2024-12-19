import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
  displayNotif: boolean;
  setDisplayNotif: React.Dispatch<React.SetStateAction<boolean>>;
  setNotifMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function Notif({
  children,
  displayNotif,
  setDisplayNotif,
  setNotifMessage,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifMessage("");
      setDisplayNotif(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [displayNotif]);

  return (
    <div
      className={
        displayNotif
          ? "absolute bottom-5 left-1/2 -translate-x-1/2 py-1 px-2 flex items-center gap-4 font-medium text-white bg-black rounded-lg"
          : "hidden"
      }
    >
      {children}
      <button onClick={() => setDisplayNotif(!displayNotif)}>
        <XMarkIcon className="size-3" />
      </button>
    </div>
  );
}
