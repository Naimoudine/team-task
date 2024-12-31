import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(): Socket | null {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3310", {
        transports: ["websocket"],
        withCredentials: true,
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);
  return socketRef.current;
}
