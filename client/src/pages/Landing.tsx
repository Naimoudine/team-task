import Header from "../components/header/Header";
import snapshot from "../assets/images/landing-snapshot.png";

type Props = {};

export default function Landing({}: Props) {
  return (
    <div className="w-screen h-fit bg-gradient-to-r from-rose-100 to-teal-100">
      <Header />
      <main className="pt-56">
        <h1 className="w-[65%] mx-auto text-5xl font-bold text-center text-gray-500">
          Streamline projects, empower your team to succeed!
        </h1>
        <h2 className="w-full mx-auto mt-8 text-xl text-center">
          Create projects, manage tasks, and collaborate seamlessly—all in one
          place.
        </h2>
        <div className="w-[60rem] mx-auto mt-24 rounded-lg p-4 backdrop-blur-sm bg-white/20 border border-zinc-300 relative after:absolute after:bottom-0 after:left-0 after:h-full after:w-full after:bg-gradient-to-t after:from-zinc-100 after:to-zinc-100/0 after:blur-sm after:content-['']">
          <img className="rounded-lg" src={snapshot} alt="snapshot app" />
        </div>
      </main>
    </div>
  );
}
