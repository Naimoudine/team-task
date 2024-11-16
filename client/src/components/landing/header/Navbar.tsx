import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

type Props = {};

export default function Navbar({}: Props) {
  const [displayMobilLink, setDisplayMobilLink] = useState<boolean>(false);
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col w-full gap-8 p-4 border border-2 border-transparent rounded-lg sm:w-fit border-zinc-100 bg-white/30 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-8 sm:justify-evenly">
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
          <li className="hidden sm:block">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "hover:text-black text-black font-medium"
                  : "text-black/70 hover:text-black font-medium"
              }
              to="/pricing"
            >
              Pricing
            </NavLink>
          </li>
          <li className="hidden sm:block">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "hover:text-black text-black font-medium"
                  : "text-black/70 hover:text-black font-medium"
              }
              to="/contact"
            >
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
          <li className="sm:hidden">
            <button
              type="button"
              aria-label="open menu"
              onClick={() => setDisplayMobilLink(!displayMobilLink)}
            >
              {displayMobilLink ? (
                <XMarkIcon className="size-6" />
              ) : (
                <Bars2Icon className="size-6" />
              )}
            </button>
          </li>
        </ul>
      </div>
      <div className={displayMobilLink ? "w-full sm:hidden" : "hidden"}>
        <ul className="flex items-center gap-16">
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "hover:text-black text-black font-medium"
                  : "text-black/70 hover:text-black font-medium"
              }
              to="/pricing"
            >
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "hover:text-black text-black font-medium"
                  : "text-black/70 hover:text-black font-medium"
              }
              to="/contact"
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
