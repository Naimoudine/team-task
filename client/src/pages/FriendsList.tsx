import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import AddMemberModal from "../components/dashboard/team/AddMemberModal";
import { cancelInvitation, getInvitations, updateInvitation } from "../api";
import { useLoaderData, useRevalidator } from "react-router-dom";
import InvitationCard from "../components/dashboard/invitations/InvitationCard";

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

  const revalidator = useRevalidator();

  const handleInvitationAnswer = async (
    status: "accepted" | "rejected",
    id: string
  ) => {
    try {
      if (status && id) {
        await updateInvitation(id, status);
        revalidator.revalidate();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Message d'erreur :", error.message); // Accès sécurisé à 'message'
      } else {
        console.error("Erreur inattendue :", error);
      }
    }
  };

  const handleCancelInvitation = async (id: string) => {
    try {
      if (id) {
        await cancelInvitation(id);
        revalidator.revalidate();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Message d'erreur :", error.message); // Accès sécurisé à 'message'
      } else {
        console.error("Erreur inattendue :", error);
      }
    }
  };

  useEffect(() => {
    console.log(showInvitations);
  }, [showInvitations]);

  return (
    <div>
      <AddMemberModal
        showModal={showModal}
        setShowModal={setShowModal}
        revalidator={revalidator}
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
            onClick={() => setShowInvitations(false)}
          >
            Members
          </button>
          <button
            className={showInvitations ? "border-b-2 border-zinc-600" : ""}
            onClick={() => setShowInvitations(true)}
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
          ) : null}
        </div>
      </main>
    </div>
  );
}
