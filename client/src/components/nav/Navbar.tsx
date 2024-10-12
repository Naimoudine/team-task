import { NavLink } from "react-router-dom";
import { FolderIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";

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
          <NavLink className="nav-link" to="/projects">
            <FolderIcon className="nav-icon" />
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="">
            <UsersIcon className="nav-icon" />
            Teams
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
