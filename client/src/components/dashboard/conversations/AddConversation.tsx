import React, { useState } from "react";
import { User } from "../../../store/user-store";
import { addConversation } from "../../../api";
import { Conversation } from "../../../pages/Messages";

type Props = {
  friends: User[];
  revalidator: any;
  conversations: Conversation[];
  displayAdd: boolean;
  setDisplayAdd: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddConversation({
  friends,
  revalidator,
  conversations,
  displayAdd,
  setDisplayAdd,
}: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleClick = (friend: User) => {
    if (selectedUser && selectedUser._id === friend._id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(friend);
    }
  };

  const createConversation = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") as string);
      if (userId && selectedUser) {
        await addConversation(userId, selectedUser?._id);
        revalidator.revalidate();
        setDisplayAdd(!displayAdd);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div
      className={
        displayAdd
          ? "absolute z-50 left-0 w-full p-2 bg-white border rounded-lg shadow-lg border-zinc-100 top-8"
          : "hidden"
      }
    >
      <div>
        {friends.filter((friend) =>
          conversations.some(
            (conversation) => conversation.correspondent !== friend._id
          )
        ).length ? (
          <ul className="flex flex-col gap-2 text-sm">
            {friends
              .filter((friend) =>
                conversations.some(
                  (conversation) => conversation.correspondent !== friend._id
                )
              )
              .map((friend) => (
                <li key={friend._id}>
                  <button
                    aria-label="add friend"
                    className={
                      selectedUser?._id === friend._id
                        ? "bg-zinc-100 px-2 py-1 rounded-lg w-full"
                        : "px-2 py-1 w-full hover:bg-zinc-100 rounded-lg"
                    }
                    onClick={() => handleClick(friend)}
                  >
                    {friend.firstname} {friend.lastname}
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-sm text-center">No friends</p>
        )}
      </div>
      <button
        className={
          selectedUser
            ? "w-full mt-2 font-medium text-white bg-black rounded-lg hover:bg-black/70"
            : "w-full mt-2 font-medium text-white bg-zinc-200 rounded-lg"
        }
        type="button"
        onClick={() => createConversation()}
        disabled={!selectedUser}
      >
        Create
      </button>
    </div>
  );
}
