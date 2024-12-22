import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Friend } from "../../../pages/FriendsList";
import FriendCard from "../friends/FriendCard";
import { addMembers } from "../../../api";
import { s } from "framer-motion/client";

type Props = {
  displayAddMember: boolean;
  setDisplayAddMember: React.Dispatch<React.SetStateAction<boolean>>;
  friends: Friend[];
  projectId: string;
  setDisplayNotif: React.Dispatch<React.SetStateAction<boolean>>;
  setNotifMessage: React.Dispatch<React.SetStateAction<string>>;
  revalidator: any;
};

export default function AddMemberModal({
  displayAddMember,
  setDisplayAddMember,
  friends,
  projectId,
  setDisplayNotif,
  setNotifMessage,
  revalidator,
}: Props) {
  const [friendList, setFriendList] = React.useState<Friend[]>([]);
  const formRef = React.useRef<HTMLFormElement>(null);

  const closeModal = () => {
    formRef.current?.reset();
    setDisplayAddMember(!displayAddMember);
  };

  const handleAddFriend = (friend: Friend) => {
    if (friendList.includes(friend)) {
      setFriendList(friendList.filter((f) => f._id !== friend._id));
    } else {
      setFriendList([...friendList, friend]);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await addMembers(projectId, friendList);
      revalidator.revalidate();
      setDisplayNotif(true);
      setNotifMessage(result);
      setDisplayAddMember(!displayAddMember);
      setFriendList([]);
    } catch (error) {
      if (error instanceof Error) {
        setDisplayAddMember(!displayAddMember);
        setDisplayNotif(true);
        setNotifMessage(error.message);
        console.error("Message d'erreur :", error.message); // Accès sécurisé à 'message'
      } else {
        console.error("Erreur inattendue :", error);
      }
    }
  };

  return (
    <div className={displayAddMember ? "modal-component" : "hidden"}>
      <div className="relative bg-white rounded-lg h-fit w-[30rem] py-4 px-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Add a new member to this project</h1>
          <button
            className="px-2 py-1 font-medium bg-white border-2 rounded-lg border-zinc-200 hover:bg-zinc-100"
            aria-label="close modal"
            onClick={() => setDisplayAddMember(!displayAddMember)}
          >
            <XMarkIcon className="size-4" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <ul className="flex flex-wrap items-center gap-2">
              {friendList.map((friend) => (
                <li
                  key={friend._id}
                  className="p-2 text-xs border-2 rounded-lg border-zinc-200 w-fit"
                >
                  {friend.firstname} {friend.lastname}
                </li>
              ))}
            </ul>
          </div>
          <h2>List of friends</h2>
          <ul className="flex flex-col gap-2 p-2 border rounded-lg border-zinc-200">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="flex items-center justify-between p-2 rounded-lg"
              >
                <h3>
                  {friend.firstname} {friend.lastname}
                </h3>
                <button
                  className="p-1.5 text-xs border-2 rounded-lg border-zinc-200 hover:bg-zinc-100"
                  onClick={() => handleAddFriend(friend)}
                >
                  {friendList.includes(friend) ? "Remove" : "Add"}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="p-2 text-white bg-black rounded-lg button hover:bg-black/70"
          type="button"
          aria-label="add member"
          onClick={() => handleSubmit()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
