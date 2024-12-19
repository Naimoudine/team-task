import { UserMinusIcon } from "@heroicons/react/24/outline";
import React from "react";

type Props = {
  firstname: string;
  lastname: string;
  email: string;
  onUnfriend: () => void;
};

export default function FriendCard({
  firstname,
  lastname,
  email,
  onUnfriend,
}: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-2 rounded-lg border-zinc-200">
      <div className="flex items-center gap-4">
        <h2 className="font-medium">
          {firstname} {lastname}
        </h2>
        <p className="text-sm text-zinc-600">{email}</p>
      </div>
      <button className="p-2 rounded-lg hover:bg-zinc-100" onClick={onUnfriend}>
        <UserMinusIcon className="size-4 text-zinc-600" />
      </button>
    </div>
  );
}
