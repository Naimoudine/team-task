import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useRef } from "react";
import { useUserStore } from "../../../store/user-store";
import { createInvitation } from "../../../api";
import { useRevalidator } from "react-router-dom";

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type Roles = ["collaborator"];

export default function AddMemberModal({ showModal, setShowModal }: Props) {
  const { userId } = useUserStore();
  const revalidator = useRevalidator();

  const roles: Roles = ["collaborator"];
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email")?.toString();
    const role = formData.get("role")?.toString();

    try {
      if (userId && email && role) {
        await createInvitation(userId, email, role);
        revalidator.revalidate();
        form.reset();
        setShowModal(!showModal);
      }
    } catch (error) {
      form.reset();
      setShowModal(!showModal);
      if (error instanceof Error) {
        console.error("Message d'erreur :", error.message); // Accès sécurisé à 'message'
      } else {
        console.error("Erreur inattendue :", error);
      }
    }
  };

  const handleCloseModal = () => {
    formRef.current?.reset();
    setShowModal(!showModal);
  };

  return (
    <div className={showModal ? "modal-component" : "hidden"}>
      <form
        className="relative bg-white rounded-lg h-fit w-[30rem] py-4 px-6 flex flex-col gap-4"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Send an invitation to a team member</h1>
          <button
            className="px-2 py-1 font-medium bg-white border-2 rounded-lg border-zinc-200 hover:bg-zinc-100"
            aria-label="close modal"
            onClick={handleCloseModal}
          >
            <XMarkIcon className="size-4" />
          </button>
        </div>
        <label className="flex flex-col gap-1" htmlFor="email">
          Send to
          <input
            className="p-2 border-2 rounded-lg border-zinc-400"
            type="email"
            name="email"
            id="email"
          />
        </label>
        <select
          className="p-2 border rounded-lg border-zinc-400"
          name="role"
          id="role"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          className="p-2 text-white bg-black rounded-lg button hover:bg-black/70"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
