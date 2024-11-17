import Header from "../components/landing/header/Header";

type Props = {};

export default function About({}: Props) {
  return (
    <div className="w-screen h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center gap-4 pt-40">
        <h1 className="text-3xl font-bold">About</h1>
        <p className="mt-2">
          Choose the plan that suits you the most. And scale if needed.
        </p>
        <div className="flex gap-16 mt-12"></div>
      </main>
    </div>
  );
}
