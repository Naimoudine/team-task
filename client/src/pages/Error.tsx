import { useRouteError, Link } from "react-router-dom";

type Props = {};

interface ErrorType {
  status: string;
  statusText: string;
}

export default function Error({}: Props) {
  const error = useRouteError() as ErrorType;
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
      <h1 className="text-xl font-bold">Oops</h1>
      <h2 className="text-lg">Something went wrong</h2>
      <p>
        {error.status} - {error.statusText}
      </p>
      <Link className="underline underline-offset-2" to="/">
        Go home
      </Link>
    </div>
  );
}
