import Header from "../components/header/Header";
import snapshot from "../assets/images/landing-snapshot.png";
import Features from "../components/landing/Features";

type Props = {};

export default function Landing({}: Props) {
  return (
    <div className="w-screen h-fit">
      <Header />
      <main className="pt-56">
        <h1 className="w-[65%] mx-auto text-6xl font-bold text-center text-gray-500">
          Streamline projects, empower your team to succeed!
        </h1>
        <h2 className="w-full mx-auto mt-8 text-xl text-center">
          Create projects, manage tasks, and collaborate seamlessly—all in one
          place.
        </h2>
        <div className="w-[60rem] mx-auto mt-24 rounded-lg p-4 backdrop-blur-sm bg-white/20 border border-zinc-300 relative after:absolute after:bottom-0 after:left-0 after:h-full after:w-full after:bg-gradient-to-t after:from-white after:to-white/0 after:blur-sm after:content-['']">
          <img
            className="w-full h-full rounded-lg"
            src={snapshot}
            alt="snapshot app"
          />
        </div>
        <Features />
      </main>
    </div>
  );
}
