import { Link } from "react-router-dom";
import { DisplayType } from "../../pages/Tasks";

type Props = {
  display: DisplayType;
};

export default function TaskList({ display }: Props) {
  return (
    <div className="w-full h-full">
      {display === "list" ? (
        <section className="w-full">
          <h2 className="task-status">Status 1</h2>
          <ul className="task-list">
            <li className="task">
              <Link to="">task 1</Link>
            </li>
            <li className="task">
              <Link to="">task 2</Link>
            </li>
            <li className="task">
              <Link to="">task 3</Link>
            </li>
          </ul>
        </section>
      ) : (
        <div className="mx-2 w-full h-full flex gap-4 mt-2">
          <section className="task-card-list">
            <header>
              <h2 className="font-semibold mb-2">Status 1</h2>
            </header>
            <article className="task-card">task 1</article>
            <article className="task-card">task 2</article>
            <article className="task-card">task 3</article>
            <article className="task-card">task 4</article>
          </section>
          <section className="task-card-list">
            <header>
              <h2 className="font-semibold mb-2">Status 1</h2>
            </header>
            <article className="task-card">task 1</article>
            <article className="task-card">task 2</article>
            <article className="task-card">task 3</article>
            <article className="task-card">task 4</article>
          </section>
        </div>
      )}
    </div>
  );
}
