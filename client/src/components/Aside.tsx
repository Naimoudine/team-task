import Navbar from "./nav/Navbar";

type Props = {};

export default function Aside({}: Props) {
  return (
    <aside className="w-[15%] bg-zinc-100 py-6 px-4">
      <header className="pb-6 border-b-2 border-dashed border-zinc-400">
        <p id="logo">Team-task</p>
      </header>
      <Navbar />
    </aside>
  );
}
