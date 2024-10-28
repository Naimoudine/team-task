import { Form } from "react-router-dom";

type Props = {};

export const action = async ({ request }: any) => {
  const formData = await request.formData();
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ firstname, lastname, email, password }),
    });
    if (response.status !== 201) {
      throw new Error("Failed to register");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default function Register({}: Props) {
  return (
    <div className="h-full w-full items-center flex flex-col mt-24 h-fit">
      <h1 className="logo text-3xl xl:text-4xl font-bold">Team-task</h1>
      <h2 className="text-xl font-semibold mt-4">Register</h2>
      <Form
        className="flex flex-col gap-6 items-center justify-center mt-8 w-[30%]"
        method="post"
      >
        <label className="form-label" htmlFor="firstname">
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter your firstname"
          />
        </label>
        <label className="form-label" htmlFor="lastname">
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter your lastname"
          />
        </label>
        <label className="form-label" htmlFor="email">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
        </label>
        <label className="form-label" htmlFor="password">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />
        </label>
        <label className="form-label" htmlFor="confirm">
          <input
            type="password"
            name="confirm"
            id="confirm"
            placeholder="Confirm your password"
          />
        </label>
        <button
          className="border-2 border-zinc-400 bg-zinc-400 hover:bg-zinc-400/70 w-full py-2 rounded-lg"
          type="submit"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
