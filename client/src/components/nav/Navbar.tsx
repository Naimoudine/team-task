import { NavLink } from "react-router-dom";
import { CheckCircleIcon, HomeIcon } from "@heroicons/react/16/solid";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="py-4">
      <ul>
        <li>
          <NavLink className="nav-link" to="/">
            <HomeIcon className="nav-icon" />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/tasks">
            <CheckCircleIcon className="nav-icon" />
            Tasks
          </NavLink>
        </li>
        <li>
          <NavLink to=""></NavLink>
        </li>
      </ul>
    </nav>
  );
}
