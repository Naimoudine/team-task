import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import AddMemberModal from "../components/dashboard/team/AddMemberModal";
import { getInvitations } from "../api";
import { useLoaderData } from "react-router-dom";
import { useUserStore } from "../store/user-store";

type Props = {};

interface RecipientDetails {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface SenderDetails {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface Invitation {
  _id: string;
  status: "accpeted" | "pending" | "rejected";
  createdAt: Date;
  recipient: string;
  recipientDetails: RecipientDetails;
  sender: string;
  senderDetails: SenderDetails;
}

export const loader = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("userId") as string);
    const invitations = await getInvitations(userId);
    return invitations;
  } catch (error) {
    throw new Error("Failed to get friends list");
  }
};

export default function FriendsList({}: Props) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showInvitations, setShowInvitations] = useState<boolean>(false);

  const invitations = useLoaderData() as Invitation[];
  const userId = JSON.parse(localStorage.getItem("userId") as string);

  console.log(invitations);

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
                      <div className="flex items-center justify-between p-4 border-2 rounded-lg bg-zinc-100/20 border-zinc-200">
                        <div className="flex items-center gap-6">
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
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="px-4 py-1 font-medium text-white bg-black rounded-lg hover:bg-black/70">
                            accept
                          </button>
                          <button className="px-4 py-1 font-medium text-white bg-black rounded-lg hover:bg-black/70">
                            reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 border-2 rounded-lg bg-zinc-100/20 border-zinc-200">
                        <div className="flex items-center gap-6">
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
                        </div>
                        <button className="px-4 py-2 rounded-lg py2 bg-zinc-200 hover:bg-zinc-200/70">
                          cancel
                        </button>
                      </div>
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
