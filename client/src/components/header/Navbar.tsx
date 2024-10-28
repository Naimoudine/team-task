import { Link, NavLink } from "react-router-dom";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="flex items-center gap-8 p-4 border-2 border-transparent rounded-lg shadow-lg bg-white/30 backdrop-blur-xl w-fit justify-evenly">
      <Link to="/">
        <p id="logo">Team-task</p>
      </Link>
      <ul className="flex items-center gap-8 font-semibold w-fit justify-evenly">
        <li>
          <NavLink to="/">Features</NavLink>
        </li>
        <li>
          <NavLink to="/">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/">About</NavLink>
        </li>
        <li>
          <NavLink to="/">Contact</NavLink>
        </li>
        <li>
          <NavLink to="/">Log in</NavLink>
        </li>
        <li>
          <NavLink to="/">Register</NavLink>
        </li>
      </ul>
    </nav>
  );
}
