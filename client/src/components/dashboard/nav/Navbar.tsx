import { NavLink } from "react-router-dom";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="py-4">
      <ul className="flex flex-col gap-2">
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-active-link" : "nav-link"
            }
            to="/dashboard"
          >
            <HomeIcon className="nav-icon" />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-active-link" : "nav-link"
            }
            to="/projects"
          >
            <FolderIcon className="nav-icon" />
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-active-link" : "nav-link"
            }
            to="/teams"
          >
            <UsersIcon className="nav-icon" />
            Teams
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-active-link" : "nav-link"
            }
            to="/messages"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="nav-icon" />
            Message
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
