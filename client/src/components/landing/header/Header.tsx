import Navbar from "./Navbar";

type Props = {};

export default function Header({}: Props) {
  return (
    <header className="fixed flex items-center justify-center w-full py-8 z-[100]">
      <Navbar />
    </header>
  );
}
