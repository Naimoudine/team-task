import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="w-full flex gap-16 items-start justify-between py-20 mx-auto border-t border-zinc-200 mt-32 px-[12.5rem]">
      <p id="logo">Team-task</p>
      <ul className="flex flex-col gap-4">
        <li className="font-medium">Product</li>
        <li>
          <ScrollLink
            className="cursor-pointer text-black/70 hover:text-black"
            to="features"
            smooth={true}
            duration={500}
            offset={-125}
          >
            Features
          </ScrollLink>
        </li>
        <li>
          <Link className="text-black/70 hover:text-black" to="">
            Princing
          </Link>
        </li>
      </ul>
      <ul className="flex flex-col gap-4">
        <li className="font-medium">Company</li>
        <li>
          <Link className="text-black/70 hover:text-black" to="">
            About
          </Link>
        </li>
        <li>
          <Link className="text-black/70 hover:text-black" to="">
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
    </footer>
  );
}
