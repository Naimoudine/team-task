import { Outlet, useRevalidator } from "react-router-dom";
import Aside from "./components/dashboard/Aside";
import { useEffect } from "react";
import { User, useUserStore } from "./store/user-store";
import { getUser } from "./api";
import useSocket from "./hook/useSocket";

function App() {
  const socket = useSocket();
  const { user, userId, setUser } = useUserStore();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (socket) {
      console.log("Socket connected:", socket);

      socket.on("connect", () => {
        console.log("Connected to the server");
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      socket.on("connect_timeout", () => {
        console.error("Connection timed out");
      });

      socket.on("auth-error", (message) => {
        console.error("Authentication failed:", message);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });
    } else {
      console.log("Socket is not yet initialized.");
    }
  }, [socket]);

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
      <Aside user={user as User} revalidator={revalidator} />
      <div className="w-[85%] overflow-hidden">
        <Outlet context={socket} />
      </div>
    </div>
  );
}

export default App;
