import { useNavigate } from "react-router-dom";
import { User, useUserStore } from "../../store/user-store";
import Navbar from "./nav/Navbar";

type Props = {
  user: User;
  revalidator: any;
};

export default function Aside({ user, revalidator }: Props) {
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        { credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      clearUser();
      localStorage.clear();
      revalidator.revalidate();
      return navigate("/");
    } catch (error) {
      throw error;
    }
  };

  return (
    <aside className="w-[15%] bg-zinc-100 py-6 px-4 flex flex-col justify-between">
      <div>
        <header className="pb-6 border-b-2 border-dashed border-zinc-400">
          <p id="logo">Team-task</p>
        </header>
        <Navbar />
      </div>
      <div className="flex items-center justify-between p-2 bg-white rounded-lg">
        <div className="flex flex-col gap-2 text-xs">
          <p className="font-semibold">
            {user?.firstname} {user?.lastname}
          </p>
          <p>{user?.email}</p>
        </div>
        <button
          type="button"
          aria-label="logout"
          onClick={() => handleLogOut()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            className="p-1 rounded-full hover:bg-zinc-200"
          >
            <g fill="red">
              <path d="M13 4.009a1 1 0 1 0-2 0l-.003 8.003a1 1 0 0 0 2 0z" />
              <path d="M4 12.992c0-2.21.895-4.21 2.343-5.657l1.414 1.414a6 6 0 1 0 8.485 0l1.415-1.414A8 8 0 1 1 4 12.992" />
            </g>
          </svg>
        </button>
      </div>
    </aside>
  );
}
