import React, { useEffect, useState } from "react";
import type { Conversation, Message } from "../../../pages/Messages";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/outline";
import { addMessage, deleteConversation } from "../../../api";
import useSocket from "../../../hook/useSocket";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  conversation: Conversation;
  userId: string;
  revalidator: any;
  setDisplayDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Conversation({
  conversation,
  userId,
  revalidator,
  setDisplayDeleteModal,
}: Props) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const socket = useSocket();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = formData.get("message")?.toString();

    try {
      if (message) {
        setSubmitting(true);
        await addMessage(conversation._id, userId, message);
        form.reset();
        revalidator.revalidate();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages);
    }
  }, [conversation.messages]);

  useEffect(() => {
    if (socket) {
      socket.on("private_message", (newMessage: Message) => {
        setMessages((prev) => {
          if (!prev.some((msg) => msg._id === newMessage._id)) {
            return [...prev, newMessage];
          }
          return prev;
        });
      });
    }
    return () => {
      if (socket) {
        socket.off("private_message");
      }
    };
  }, [socket]);

  return (
    <div className="relative flex flex-col w-full h-full">
      <header className="flex items-center justify-between p-4 border-b border-zinc-200">
        <h2 className="flex items-center gap-4 text-lg font-medium">
          {conversation.correspondent === userId
            ? conversation.creatorDetails.firstname
            : conversation.correspondentDetails.firstname}{" "}
          {conversation.correspondent === userId
            ? conversation.creatorDetails.lastname
            : conversation.correspondentDetails.lastname}
          <span>
            <div className="w-2 h-2 bg-green-600 rounded-full" />
          </span>
        </h2>
        <button
          aria-label="delete conversation"
          onClick={() => setDisplayDeleteModal(true)}
        >
          <TrashIcon className="size-4" />
        </button>
      </header>
      <main className="flex flex-col justify-between w-full p-4 grow">
        <div className="flex flex-col gap-4 overflow-y-scroll max-h-[450px]">
          {messages.map((message) => (
            <div
              className={message.sender === userId ? "self-end" : "self-start"}
              key={message._id}
            >
              <div className="flex items-center gap-8">
                <h3 className="font-medium">
                  {message.sender === conversation.correspondent
                    ? conversation.correspondentDetails.firstname
                    : conversation.creatorDetails.firstname}{" "}
                  {message.sender === conversation.correspondent
                    ? conversation.correspondentDetails.lastname
                    : conversation.creatorDetails.lastname}
                </h3>
                <p className="text-xs">11h</p>
              </div>
              <div className="w-fit">
                {message.image && <img src={message.image} />}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full p-2 mt-2 border-2 rounded-lg border-zinc-200">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <textarea
              className="border-none outline-none resize-none"
              name="message"
              id="message"
              placeholder={`Send a message to ${
                userId !== conversation.creator
                  ? conversation.creatorDetails.firstname
                  : conversation.correspondentDetails.firstname
              }`}
              disabled={submitting}
            />
            <button
              className="self-end p-2 bg-black rounded-lg w-fit hover:bg-black/70"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="0.75s"
                      repeatCount="indefinite"
                      type="rotate"
                      values="0 12 12;360 12 12"
                    />
                  </path>
                </svg>
              ) : (
                <PaperAirplaneIcon className="text-white size-5" />
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
