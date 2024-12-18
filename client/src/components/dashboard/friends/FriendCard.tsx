import React from "react";

type Props = {
  firstname: string;
  lastname: string;
  email: string;
};

export default function FriendCard({ firstname, lastname, email }: Props) {
  return (
    <div className="flex items-center justify-between p-4 border-2 rounded-lg border-zinc-200">
      <div className="flex items-center gap-4">
        <h2 className="font-medium">
          {firstname} {lastname}
        </h2>
        <p className="text-sm text-zinc-600">{email}</p>
      </div>
      <button>unfriend</button>
    </div>
  );
}
