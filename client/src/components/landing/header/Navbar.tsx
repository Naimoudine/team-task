import { Link, NavLink, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

type Props = {};

export default function Navbar({}: Props) {
  const { pathname } = useLocation();

  return (
    <nav className="flex items-center gap-8 p-4 border border-2 border-transparent rounded-lg border-zinc-100 bg-white/30 backdrop-blur-lg w-fit justify-evenly">
      {pathname === "/" ? (
        <ScrollLink
          className="cursor-pointer"
          to="top"
          smooth={true}
          duration={500}
        >
          <p id="logo">Team-task</p>
        </ScrollLink>
      ) : (
        <Link id="logo" to="/">
          Team-task
        </Link>
      )}
      <ul className="flex items-center gap-8 text-sm font-semibold w-fit justify-evenly">
        <li>
          <NavLink className="text-black/70 hover:text-black" to="/pricing">
            Pricing
          </NavLink>
        </li>
        <li>
          <NavLink className="text-black/70 hover:text-black" to="/">
            About
          </NavLink>
        </li>
        <li>
          <NavLink className="text-black/70 hover:text-black" to="/">
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink className="p-2 rounded-lg hover:bg-zinc-100" to="/login">
            Log in
          </NavLink>
        </li>
        <li>
          <NavLink
            className="p-2 text-white bg-black rounded-lg hover:bg-black/70"
            to="/register"
          >
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
