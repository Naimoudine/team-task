import { useNavigate } from "react-router-dom";
import { Task, TaskList } from "./TaskSection";
import { CSS } from "@dnd-kit/utilities";
import { displayPriority } from "./TaskSection";
import { useSortable } from "@dnd-kit/sortable";

type Props = {
  task: Task;
  list: TaskList;
  projectId: string;
};

export default function TaskCard({ task, list, projectId }: Props) {
  // const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable(task._id);
  const style = { transition, transform: CSS.Transform.toString(transform) };
  return (
    <article
      key={task._id}
      className="task-card"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      // onClick={() =>
      //   navigate(
      //     `/projects/${projectId}/taskLists/${list._id}/tasks/${task._id}`
      //   )
      // }
    >
      <div className="flex items-center gap-4 w-fit">
        <p className="font-semibold text-zinc-500">
          {displayPriority(task.priority)}
        </p>
        <h3 className="text-sm font-bold">{task.title}</h3>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {task.labelList.map((label) => (
          <span key={label} className="task-label">
            {label}
          </span>
        ))}
      </div>
    </article>
  );
}
