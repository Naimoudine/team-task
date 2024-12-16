import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import AddMemberModal from "../components/dashboard/team/AddMemberModal";

type Props = {};

export default function FriendsList({}: Props) {
  const [showModal, setShowModal] = useState<boolean>(true);
  return (
    <div>
      <AddMemberModal showModal={showModal} setShowModal={setShowModal} />
      <header className="page-header">
        <h1 className="page-title">Team members</h1>
        <button
          className="flex items-center justify-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-200"
          onClick={() => setShowModal(!showModal)}
        >
          <PlusIcon className="size-4 text-zinc-600" />
          Invite
        </button>
      </header>
    </div>
  );
}
