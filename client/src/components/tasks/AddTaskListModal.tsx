import { XMarkIcon } from "@heroicons/react/16/solid";
import type React from "react";
import { createTaskList } from "../../api";
type Props = {
  displayAddTaskListModal: boolean;
  setDisplayAddTaskListModal: React.Dispatch<React.SetStateAction<boolean>>;
  revalidator: any;
};

export default function AddTaskListModal({
  displayAddTaskListModal,
  setDisplayAddTaskListModal,
  revalidator,
}: Props) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newTitle = formData.get("title");
    const newTask = {
      title: newTitle as string,
      tasks: [],
    };

    try {
      await createTaskList(newTask);
      revalidator.revalidate();
    } catch (error) {
      throw error;
    }

    form.reset();
    setDisplayAddTaskListModal(!displayAddTaskListModal);
  };

  return (
    <div className={displayAddTaskListModal ? "modal-component" : "hidden"}>
      <form
        className="relative flex flex-col justify-between bg-white w-[60%] h-[150px] py-4 px-4 rounded-lg"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold">Add a list</p>
          <button
            className="rounded-lg hover:bg-gray-200"
            type="button"
            aria-label="close modal"
            onClick={() => setDisplayAddTaskListModal(!displayAddTaskListModal)}
          >
            <XMarkIcon className="size-6 text-zinc-600" />
          </button>
        </div>
        <input
          className="w-full text-xl"
          type="text"
          name="title"
          id="title"
          placeholder="List title"
          autoFocus
          required
        />
        <button
          className="self-end px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg w-fit hover:bg-blue-600/70"
          type="submit"
        >
          Create list
        </button>
      </form>
    </div>
  );
}
