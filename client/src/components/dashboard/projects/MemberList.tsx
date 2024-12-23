import React from "react";
import { UserMinusIcon } from "@heroicons/react/24/outline";
import { User, useUserStore } from "../../../store/user-store";
import { deleteMember } from "../../../api";
type Props = {
  displayMemberList: boolean;
  setDisplayMemberList: React.Dispatch<React.SetStateAction<boolean>>;
  members: User[];
  ownerId: string;
  projectId: string;
  revalidator: any;
  setDisplayNotif: React.Dispatch<React.SetStateAction<boolean>>;
  setNotifMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function MemberList({
  displayMemberList,
  setDisplayMemberList,
  members,
  ownerId,
  projectId,
  revalidator,
  setDisplayNotif,
  setNotifMessage,
}: Props) {
  const { userId } = useUserStore();

  const handleRemoveMember = async (memberId: string) => {
    try {
      const result = await deleteMember(projectId, memberId);
      revalidator.revalidate();
      setDisplayMemberList(!displayMemberList);
      setDisplayNotif(true);
      setNotifMessage(result);
    } catch (error) {
      if (error instanceof Error) {
        setDisplayNotif(true);
        setNotifMessage(error.message);
        console.error("Message d'erreur :", error.message); // Accès sécurisé à 'message'
      } else {
        console.error("Erreur inattendue :", error);
      }
    }
  };

  return (
    <div
      className={
        displayMemberList
          ? "p-2 w-fit bg-white absolute top-10 right-0 border-2 border-zinc-200 rounded-lg"
          : "hidden"
      }
    >
      <ul className="w-fit">
        {members.map((member) => (
          <li key={member._id} className="p-1 rounded-lg hover:bg-zinc-200">
            <article className="flex items-center gap-1">
              <h2 className="whitespace-nowrap">
                {member.firstname} {member.lastname}
              </h2>
              {member._id !== userId && member._id !== ownerId && (
                <button
                  className="p-1 rounded-lg hover:bg-zinc-100"
                  onClick={() => handleRemoveMember(member._id)}
                >
                  <UserMinusIcon className="size-4" />
                </button>
              )}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
