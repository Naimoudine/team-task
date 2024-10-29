import { Link } from "react-router-dom";

type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="w-full flex gap-16 items-start justify-between py-20 mx-auto border-t border-zinc-200 mt-32 px-[12.5rem]">
      <p id="logo">Team-task</p>
      <ul className="flex flex-col gap-4">
        <li className="font-medium">Product</li>
        <li>
          <Link to="">Features</Link>
        </li>
        <li>
          <Link to="">Princing</Link>
        </li>
      </ul>
      <ul className="flex flex-col gap-4">
        <li className="font-medium">Company</li>
        <li>
          <Link to="">About</Link>
        </li>
        <li>
          <Link to="">Contact</Link>
        </li>
      </ul>
      <ul className="flex flex-col gap-4">
        <li className="font-medium">Legal</li>
        <li>
          <Link to="">Terms</Link>
        </li>
        <li>
          <Link to="">Privacy</Link>
        </li>
      </ul>
    </footer>
  );
}
