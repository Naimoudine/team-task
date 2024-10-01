import Navbar from "./nav/Navbar";

type Props = {};

export default function Aside({}: Props) {
  return (
    <aside className="w-[20%] bg-gray-200 py-6 px-4">
      <header className="border-dashed border-b-2 border-zinc-400 pb-6">
        <p id="logo">Team-task</p>
      </header>
      <Navbar />
    </aside>
  );
}
