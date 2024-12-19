import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import AddMemberModal from "../components/dashboard/team/AddMemberModal";
import {
  cancelInvitation,
  getInvitations,
  getUserFriends,
  updateInvitation,
} from "../api";
import { useLoaderData, useRevalidator } from "react-router-dom";
import InvitationCard from "../components/dashboard/invitations/InvitationCard";
import FriendCard from "../components/dashboard/friends/FriendCard";
import Notif from "../components/dashboard/notifications/Notif";

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
  status: "accepted" | "pending" | "rejected";
  createdAt: Date;
  recipient: string;
  recipientDetails: RecipientDetails;
  sender: string;
  senderDetails: SenderDetails;
}

export interface Friends {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface LoaderType {
  invitations: Invitation[];
  friends: Friends[];
}

export const loader = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("userId") as string);
    const invitations = await getInvitations(userId);
    const friends = await getUserFriends(userId);
    return { invitations, friends };
  } catch (error) {
    throw new Error("Failed to get friends list");
  }
};

export default function FriendsList({}: Props) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSection, setShowSection] = useState<"members" | "invitations">(
    "members"
  );
  const [displayNotif, setDisplayNotif] = useState<boolean>(false);
  const [notifMessage, setNotifMessage] = useState<string>("");

  const { invitations, friends } = useLoaderData() as LoaderType;
  const userId = JSON.parse(localStorage.getItem("userId") as string);

  const revalidator = useRevalidator();

  const sortedInvitations = invitations.sort((a, b) => {
    const statusOrder = ["pending", "accepted", "rejected"]; // Ordre souhaité
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });

  const handleInvitationAnswer = async (
    status: "accepted" | "rejected",
    id: string
  ) => {
    try {
      if (status && id) {
        const result = await updateInvitation(id, status);
        revalidator.revalidate();
        setNotifMessage(result);
        setDisplayNotif(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotifMessage(error.message);
        setDisplayNotif(true);
        console.error("Message d'erreur :", error.message); // Accès sécurisé à 'message'
      } else {
        console.error("Erreur inattendue :", error);
      }
    }
  };

  const handleCancelInvitation = async (id: string) => {
    try {
      if (id) {
        const result = await cancelInvitation(id);
        revalidator.revalidate();
        setNotifMessage(result);
        setDisplayNotif(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotifMessage(error.message);
        setDisplayNotif(true);
        console.error("Message d'erreur :", error.message); // Accès sécurisé à 'message'
      } else {
        console.error("Erreur inattendue :", error);
      }
    }
  };

  return (
    <div>
      <AddMemberModal
        showModal={showModal}
        setShowModal={setShowModal}
        revalidator={revalidator}
        setNotifMessage={setNotifMessage}
        setDisplayNotif={setDisplayNotif}
      />
      <Notif
        displayNotif={displayNotif}
        setDisplayNotif={setDisplayNotif}
        setNotifMessage={setNotifMessage}
      >
        {notifMessage}
      </Notif>
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
            className={
              showSection === "members" ? "border-b-2 border-zinc-600" : ""
            }
            onClick={() => setShowSection("members")}
          >
            Members
          </button>
          <button
            className={
              showSection === "invitations" ? "border-b-2 border-zinc-600" : ""
            }
            onClick={() => setShowSection("invitations")}
          >
            Invitations
          </button>
        </div>
        <div>
          {showSection === "invitations" ? (
            <div className="mt-4">
              <ul className="flex flex-col gap-2">
                {sortedInvitations.map((invitation) => (
                  <li key={invitation._id}>
                    {invitation.senderDetails._id !== userId ? (
                      <InvitationCard
                        firstname={invitation?.senderDetails.firstname}
                        lastname={invitation?.senderDetails.lastname}
                        email={invitation?.senderDetails.email}
                        status={invitation.status}
                        isPending={invitation.status === "pending"}
                        onAccept={() =>
                          handleInvitationAnswer("accepted", invitation._id)
                        }
                        onReject={() =>
                          handleInvitationAnswer("rejected", invitation._id)
                        }
                      />
                    ) : (
                      <InvitationCard
                        firstname={invitation?.recipientDetails.firstname}
                        lastname={invitation?.recipientDetails.lastname}
                        email={invitation?.recipientDetails.email}
                        status={invitation.status}
                        isPending={invitation.status === "pending"}
                        onCancel={() => handleCancelInvitation(invitation._id)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4">
              <ul className="flex flex-col gap-2">
                {friends.map((friend) => (
                  <li key={friend._id}>
                    <FriendCard
                      firstname={friend.firstname}
                      lastname={friend.lastname}
                      email={friend.email}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
