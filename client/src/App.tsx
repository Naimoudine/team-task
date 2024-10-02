import { Outlet } from "react-router-dom";
import Aside from "./components/Aside";

function App() {
  return (
    <div className="h-full w-full flex">
      <Aside />
      <div className="w-[80%] overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
