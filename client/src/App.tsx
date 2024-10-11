import { Outlet } from "react-router-dom";
import Aside from "./components/Aside";

function App() {
  return (
    <div className="flex w-full h-full">
      <Aside />
      <div className="w-[85%] overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
