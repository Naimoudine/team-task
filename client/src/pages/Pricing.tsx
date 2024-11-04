import { useNavigate } from "react-router-dom";
import Header from "../components/landing/header/Header";

type Props = {};

export default function Pricing({}: Props) {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center gap-4 pt-40">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="mt-2">
          Choose the plan that suits you the most. And scale if needed.
        </p>
        <div className="flex gap-16 mt-12">
          <article className="p-4 border rounded-lg border-zinc-200 w-[250px]">
            <h3 className="font-semibold ">starter</h3>
            <p className="text-sm">for individuals</p>
            <h2 className="mt-6 text-2xl">Free</h2>
            <ul className="flex flex-col gap-2 py-4 mt-6 border-t border-zinc-200">
              <li>1GB Storage</li>
              <li>Unlimited tasks</li>
              <li>5 shared lists with up to 5 people</li>
              <li>Up to 10MB upload & 500MB file storage</li>
              <li className="text-sm text-zinc-600">And more...</li>
            </ul>
            <button
              className="w-full py-2 font-semibold text-center text-white bg-black rounded-lg hover:bg-black/70"
              type="button"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </article>
          <article className="p-4 border-2 rounded-lg border-zinc-400 w-[250px]">
            <h3 className="font-semibold ">pro</h3>
            <p className="text-sm">for teams</p>
            <h2 className="mt-6 text-2xl">
              $12 <span className="text-sm text-zinc-600">/ month</span>
            </h2>
            <ul className="flex flex-col gap-2 py-4 mt-6 border-t border-zinc-200">
              <li>1GB Storage</li>
              <li>Unlimited tasks</li>
              <li>unlimited shared lists with up to 25 people</li>
              <li>Up to 500MB upload & 25GB file storage</li>
              <li className="text-sm text-zinc-600">And more...</li>
            </ul>
            <button
              className="w-full py-2 font-semibold text-center text-white bg-black rounded-lg hover:bg-black/70"
              type="button"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </article>
        </div>
      </main>
    </div>
  );
}
