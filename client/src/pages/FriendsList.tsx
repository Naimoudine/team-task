import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import AddMemberModal from "../components/dashboard/team/AddMemberModal";
import { getInvitations } from "../api";
import { useLoaderData } from "react-router-dom";
import { useUserStore } from "../store/user-store";

type Props = {};

export const loader = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("userId") as string);
    const invitations = await getInvitations(userId);
    return { invitations };
  } catch (error) {
    throw new Error("Failed to get friends list");
  }
};

export default function FriendsList({}: Props) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showNotif, setShowNotif] = useState<boolean>(false);
  const [showInvitations, setShowInvitations] = useState<boolean>(false);

  const { invitations } = useLoaderData();
  const { userId } = useUserStore();

  return (
    <div>
      <AddMemberModal
        showModal={showModal}
        setShowModal={setShowModal}
        showNotif={showNotif}
        setShowNotif={setShowNotif}
      />
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
      <main className="p-4">
        <div className="flex items-center gap-4">
          <button
            className={!showInvitations ? "border-b-2 border-zinc-600" : ""}
          >
            Members
          </button>
          <button
            className={showInvitations ? "border-b-2 border-zinc-600" : ""}
            onClick={() => setShowInvitations(!showInvitations)}
          >
            Invitations
          </button>
        </div>
        <div>
          {showInvitations ? (
            <div className="mt-4">
              <ul>
                {invitations.map((invitation) => (
                  <li key={invitation._id}>
                    {invitation.senderDetails._id !== userId ? (
                      <article className="flex items-center gap-6 p-4 border-2 rounded-lg bg-zinc-100/20 border-zinc-200">
                        <h2 className="font-medium">
                          {invitation.senderDetails.firstname}{" "}
                          {invitation.senderDetails.lastname}
                        </h2>
                        <p className="text-sm">
                          {invitation.senderDetails.email}
                        </p>
                        <span className="p-1 text-xs rounded-lg bg-zinc-200">
                          {invitation.status}
                        </span>
                      </article>
                    ) : (
                      <article className="flex items-center gap-6 p-4 border-2 rounded-lg bg-zinc-100/20 border-zinc-200">
                        <h2 className="font-medium">
                          {invitation.recipientDetails.firstname}{" "}
                          {invitation.recipientDetails.lastname}
                        </h2>
                        <p className="text-sm">
                          {invitation.recipientDetails.email}
                        </p>
                        <span className="p-1 text-xs rounded-lg bg-zinc-200">
                          {invitation.status}
                        </span>
                      </article>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
