import { User } from "../store/user-store";
import Navbar from "./nav/Navbar";

type Props = {
  user: User;
};

export default function Aside({ user }: Props) {
  return (
    <aside className="w-[15%] bg-zinc-100 py-6 px-4 flex flex-col">
      <header className="pb-6 border-b-2 border-dashed border-zinc-400">
        <p id="logo">Team-task</p>
      </header>
      <Navbar />
      <div>
        <p>{user?.firstname}</p>
      </div>
    </aside>
  );
}
