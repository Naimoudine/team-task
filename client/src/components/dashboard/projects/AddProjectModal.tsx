import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createProject } from "../../../api";
import { Project } from "../../../pages/Projects";

type Props = {
  displayAddProjectModal: boolean;
  setDisplayAddProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  revalidator: any;
};

export default function AddProjectModal({
  displayAddProjectModal,
  setDisplayAddProjectModal,
  revalidator,
}: Props) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newTitle = formData.get("title");
    const newProject: Project = {
      title: newTitle as string,
      taskLists: [],
    };

    try {
      const userId = JSON.parse(localStorage.getItem("userId") as string);
      await createProject(userId, newProject);
      revalidator.revalidate();
    } catch (error) {
      throw new Error();
    }

    form.reset();
    setDisplayAddProjectModal(!displayAddProjectModal);
  };

  return (
    <div className={displayAddProjectModal ? "modal-component" : "hidden"}>
      <form
        className="relative flex flex-col justify-between bg-white w-[60%] h-[150px] py-4 px-4 rounded-lg"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold">Add a project</p>
          <button
            className="rounded-lg hover:bg-gray-200"
            type="button"
            aria-label="close modal"
            onClick={() => setDisplayAddProjectModal(!displayAddProjectModal)}
          >
            <XMarkIcon className="size-6 text-zinc-600" />
          </button>
        </div>
        <input
          className="w-full text-xl"
          type="text"
          name="title"
          id="title"
          placeholder="Project title"
          autoFocus
          required
        />
        <button
          className="self-end px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg w-fit hover:bg-blue-600/70"
          type="submit"
        >
          Create project
        </button>
      </form>
    </div>
  );
}
