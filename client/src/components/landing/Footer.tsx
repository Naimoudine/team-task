import { Link } from "react-router-dom";

type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="w-full flex flex-col gap-16 items-start py-10 mx-auto border-t border-zinc-200 mt-32 md:px-[10.5rem]">
      <p id="logo">Team-task</p>
      <div className="flex justify-between w-full">
        <ul className="flex flex-col gap-4">
          <li className="font-medium">Product</li>
          <li>
            <Link className="text-black/70 hover:text-black" to="">
              Princing
            </Link>
          </li>
        </ul>
        <ul className="flex flex-col gap-4">
          <li className="font-medium">Company</li>
          <li>
            <Link className="text-black/70 hover:text-black" to="/contact">
              Contact
            </Link>
          </li>
        </ul>
        <ul className="flex flex-col gap-4">
          <li className="font-medium">Legal</li>
          <li>
            <Link className="text-black/70 hover:text-black" to="">
              Terms
            </Link>
          </li>
          <li>
            <Link className="text-black/70 hover:text-black" to="">
              Privacy
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
