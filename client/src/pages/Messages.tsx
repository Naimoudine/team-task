import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getConversations, getUserFriends } from "../api";
import { useLoaderData, useRevalidator } from "react-router-dom";
import Conversation from "../components/dashboard/conversations/Conversation";
import AddConversation from "../components/dashboard/conversations/AddConversation";
import { User } from "../store/user-store";
import ConfirmDeleteModal from "../components/dashboard/conversations/ConfirmDeleteModal";

type Props = {};

export interface Message {
  _id: string;
  sender: string;
  text: string | null;
  image: string | null;
  createdAt: Date;
}

export interface UserDetails {
  firstname: string;
  lastname: string;
  email: string;
}

export interface Conversation {
  _id: string;
  creator: string;
  correspondent: string;
  messages: Message[];
  correspondentDetails: UserDetails;
  creatorDetails: UserDetails;
}

interface LoaderType {
  conversations: Conversation[];
  friends: User[];
}

export const loader = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("userId") as string);
    const conversations = await getConversations(userId);
    const friends = await getUserFriends(userId);
    return { conversations, friends };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function Messages({}: Props) {
  const [conversations, setConversations] = useState<Conversation[] | null>(
    null
  );
  const [currConversation, setCurrConversation] = useState<Conversation | null>(
    null
  );
  const [displayAdd, setDisplayAdd] = useState<boolean>(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean>(false);

  const userId = JSON.parse(localStorage.getItem("userId") as string);
  const loaderData = useLoaderData() as LoaderType;
  const revalidator = useRevalidator();

  useEffect(() => {
    if (loaderData.conversations) {
      setConversations(loaderData.conversations);
      if (currConversation) {
        const updatedConversation = loaderData.conversations.find(
          (conv) => conv._id === currConversation._id
        );
        setCurrConversation(updatedConversation || null);
      }
    }
  }, [loaderData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        revalidator.revalidate(); // Revalide les données au retour sur la page
      }
    };

    const handleFocus = () => {
      revalidator.revalidate(); // Revalide également lors du focus
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [revalidator]);

  return (
    <div className="flex flex-col w-full h-full">
      <ConfirmDeleteModal
        displayDeleteModal={displayDeleteModal}
        setDisplayDeleteModal={setDisplayDeleteModal}
        currConversation={currConversation!}
      />
      <header className="page-header">
        <h1 className="page-title">Message</h1>
        <div className="relative flex items-center gap-8">
          <button
            type="button"
            className={
              displayAdd
                ? "flex items-center justify-center gap-2 px-2 py-1 rounded-lg hover:bg-zinc-100 bg-zinc-100"
                : "flex items-center justify-center gap-2 px-2 py-1 rounded-lg hover:bg-zinc-100"
            }
            onClick={() => setDisplayAdd(!displayAdd)}
          >
            <PlusIcon className="size-4 text-zinc-600" />
            <span className="text-sm font-semibold text-zinc-600">
              Create conversation
            </span>
          </button>
          <AddConversation
            friends={loaderData?.friends}
            revalidator={revalidator}
            conversations={conversations ? conversations : []}
            displayAdd={displayAdd}
            setDisplayAdd={setDisplayAdd}
          />
        </div>
      </header>
      {conversations?.length ? (
        <main className="flex grow">
          <div className="w-[25%] h-full border-r border-zinc-200">
            <ul className="w-full">
              {conversations.map((conversation) => (
                <li
                  key={conversation._id}
                  className={
                    currConversation?._id === conversation._id
                      ? "w-full border-r-2 border-blue-600"
                      : "w-full"
                  }
                >
                  <button
                    className="w-full hover:bg-zinc-100"
                    onClick={() => setCurrConversation(conversation)}
                  >
                    <div className="flex flex-col w-full gap-4 p-4 border-b border-zinc-200">
                      <div className="flex items-center justify-between text-sm">
                        <h2 className="flex items-center gap-4 font-medium">
                          {conversation.creator === userId
                            ? conversation.correspondentDetails.firstname
                            : conversation.creatorDetails.firstname}{" "}
                          {conversation.creator === userId
                            ? conversation.correspondentDetails.lastname
                            : conversation.creatorDetails.lastname}
                          <span>
                            <div className="w-2 h-2 bg-green-600 rounded-full" />
                          </span>
                        </h2>
                        <p>1h</p>
                      </div>
                      <p className="overflow-hidden text-xs text-zinc-600 whitespace-nowrap text-ellipsis text-start">
                        {conversation?.messages[0]?.text}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[75%] max-h-full">
            {currConversation && (
              <Conversation
                key={currConversation._id}
                conversation={currConversation}
                userId={userId!}
                revalidator={revalidator}
                setDisplayDeleteModal={setDisplayDeleteModal}
              />
            )}
          </div>
        </main>
      ) : (
        <h2 className="mt-8 text-lg font-medium text-center">
          No conversation found. Don't hesitate to create one.
        </h2>
      )}
    </div>
  );
}
