import { Outlet } from "react-router-dom";
import Aside from "./components/Aside";
import { useEffect } from "react";
import { useUserStore } from "./store/user-store";
import { getUser } from "./api";

function App() {
  const { user, userId, setUser } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && !user) {
        const userData = await getUser(userId);
        if (userData) {
          setUser(userData); // Met à jour le store avec les données utilisateur
        }
      }
    };
    fetchUserData();
  }, [user, userId]);

  return (
    <div className="flex w-full h-full">
      <Aside user={user} />
      <div className="w-[85%] overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
