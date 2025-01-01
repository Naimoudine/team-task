import React from "react";
import { deleteConversation } from "../../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { Conversation } from "../../../pages/Messages";

type Props = {
  displayDeleteModal: boolean;
  setDisplayDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  currConversation: Conversation;
};

export default function ConfirmDeleteModal({
  displayDeleteModal,
  setDisplayDeleteModal,
  currConversation,
}: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleDelete = async () => {
    try {
      if (currConversation._id) {
        await deleteConversation(currConversation._id);
        setDisplayDeleteModal(false);
        navigate(pathname);
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
    <div className={displayDeleteModal ? "modal-component" : "hidden"}>
      <div className="p-4 bg-white rounded-lg h-fit">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Confirm delete</h1>
        </div>
        <p className="my-4 text-sm">
          All your messages within this conversation will be permanantly deleted
        </p>
        <div className="flex items-center justify-center gap-8">
          <button
            type="button"
            className="px-2 py-1 border-2 rounded-lg border-zinc-200 hover:bg-zinc-200"
            onClick={() => setDisplayDeleteModal(false)}
          >
            cancel
          </button>
          <button
            type="button"
            className="px-2 py-1 text-white bg-red-600 border-2 rounded-lg border-zinc-200 hover:bg-red-600/70"
            onClick={() => handleDelete()}
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
}
