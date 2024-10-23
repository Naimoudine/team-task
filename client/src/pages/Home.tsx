type Props = {};

export default function Home({}: Props) {
  return (
    <section className="wrapper">
      <header>
        <h1 className="page-title">Home</h1>
      </header>
      <div className="flex justify-between gap-8 p-4 mt-8 border rounded-lg w-fit border-zinc-200">
        <article className="px-4 border-r-2 border-dashed border-zinc-200">
          <h2 className="font-semibold text-zinc-600">Total Projects</h2>
          <p className="text-xl font-bold">2</p>
        </article>
        <article className="px-4 border-r-2 border-dashed border-zinc-200">
          <h2 className="font-semibold text-zinc-600">Total Tasks</h2>
          <p className="text-xl font-bold">2</p>
        </article>
        <article>
          <h2 className="font-semibold text-zinc-600">Team members</h2>
          <p className="text-xl font-bold">2</p>
        </article>
      </div>
    </section>
  );
}
