import {
  redirect,
  Form,
  useNavigation,
  Link,
  useRouteError,
} from "react-router-dom";
import { useUserStore } from "../store/user-store";

type Props = {};

export interface Error {
  message: string;
}

export const action = async ({ request }: any) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ? data.message : "Failed to login");
    }

    const setUser = useUserStore.getState().setUser;

    setUser({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
    });

    localStorage.setItem("userId", JSON.stringify(data._id));

    return redirect("/dashboard");
  } catch (error) {
    throw error;
  }
};

export default function Login({}: Props) {
  const navigation = useNavigation();
  const isSubmiting = navigation.state === "submitting";
  const error = useRouteError() as Error;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-8">
      <h1 className="text-3xl font-bold logo xl:text-4xl">Team-task</h1>
      <h2 className="mt-4 text-xl font-semibold">Login</h2>
      <p className="mt-4 text-sm font-semibold text-center text-red-600">
        {error?.message}
      </p>
      <Form
        className="flex flex-col gap-6 items-center justify-center mt-8 w-full md:w-[50%] xl:w-[30%]"
        method="post"
      >
        <label className="form-label" htmlFor="email">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            required
          />
        </label>
        <label className="form-label" htmlFor="password">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            required
          />
        </label>
        <button
          className="flex items-center justify-center w-full py-2 text-white bg-black border-2 border-transparent rounded-lg hover:bg-black/70 disabled:bg-gray-200 "
          type="submit"
        >
          {isSubmiting ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
              >
                <animateTransform
                  attributeName="transform"
                  dur="0.75s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </path>
            </svg>
          ) : (
            "Log in"
          )}
        </button>
      </Form>
      <p className="mt-6">
        No account ?{" "}
        <Link className="underline underline-offset-2" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}
