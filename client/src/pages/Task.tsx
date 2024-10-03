type Props = {};

export default function Task({}: Props) {
  return (
    <div className="flex flex-col w-full h-full">
      <header className="flex items-center justify-center">
        <p className="w-full py-1 text-lg font-semibold text-center text-zinc-600 bg-zinc-100">
          Task
        </p>
      </header>
      <main className="flex flex-grow">
        <div className="w-[80%]">
          <div className="max-w-[800px] mx-auto my-8">
            <h1 className="text-2xl font-semibold">Learn typescript</h1>
            <form className="mt-8">
              <textarea
                className="w-full text-lg resize-none"
                name="description"
                id="description"
                placeholder="Add description..."
              ></textarea>
            </form>
          </div>
        </div>
        <aside className="border-l border-zinc-200 w-[20%] h-full"></aside>
      </main>
    </div>
  );
}
