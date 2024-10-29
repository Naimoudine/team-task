import { Link, NavLink } from "react-router-dom";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="flex items-center gap-8 p-4 border border-2 border-transparent rounded-lg border-zinc-100 bg-white/30 backdrop-blur-xl w-fit justify-evenly">
      <Link to="/">
        <p id="logo">Team-task</p>
      </Link>
      <ul className="flex items-center gap-8 text-sm font-semibold w-fit justify-evenly">
        <li>
          <NavLink className="text-black/70 hover:text-black" to="/">
            Features
          </NavLink>
        </li>
        <li>
          <NavLink className="text-black/70 hover:text-black" to="/">
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
