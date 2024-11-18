import React, { useEffect, useState } from "react";
import {
  Form,
  useNavigation,
  Link,
  redirect,
  useRouteError,
} from "react-router-dom";

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
    const data = await response.json();

    if (response.status !== 201) {
      throw new Error(data?.message ? data.message : "Failed to register");
    }
    return redirect("/login");
  } catch (error) {
    throw error;
  }
};

interface InputErrorType {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export default function Register({}: Props) {
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [inputError, setInputError] = useState<InputErrorType>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const navigation = useNavigation();
  const isSubmiting = navigation.state === "loading";
  const error = useRouteError() as Error;

  const nameRegex = /^.{2,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    switch (type) {
      case "email":
        if (
          !emailRegex.test(e.currentTarget.value) &&
          e.currentTarget.value.length > 0
        ) {
          setInputError({
            ...inputError,
            email:
              "Email should have at least 2 characters before and after @ & at least 2 for the domaine.",
          });
        } else {
          setInputError({ ...inputError, email: "" });
        }
        break;
      case "password":
        if (
          !passwordRegex.test(e.currentTarget.value) &&
          e.currentTarget.value.length > 0
        ) {
          setPassword(e.target.value);
          setInputError({
            ...inputError,
            password:
              "Password should be at least 8 characters long, include at least an uppercase and lowercase letter, include one digit & a special character (e.g, !@#$%^&*())",
          });
        } else {
          setPassword(e.target.value);
          setInputError({ ...inputError, password: "" });
        }
        break;
      case "lastname":
        if (
          !nameRegex.test(e.currentTarget.value) &&
          e.currentTarget.value.length > 0
        ) {
          setInputError({
            ...inputError,
            lastname: "Lasttname should be at least 2 characters long.",
          });
        } else {
          setPassword(e.target.value);
          setInputError({ ...inputError, lastname: "" });
        }
        break;
      default:
        if (
          !nameRegex.test(e.currentTarget.value) &&
          e.currentTarget.value.length > 0
        ) {
          setInputError({
            ...inputError,
            firstname: "Firstname should be at least 2 characters long.",
          });
        } else {
          setInputError({ ...inputError, firstname: "" });
        }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full px-8 mt-24 h-fit">
      <h1 className="text-3xl font-bold logo xl:text-4xl">Team-task</h1>
      <h2 className="mt-4 text-xl font-semibold">Register</h2>
      <p className="mt-4 text-sm font-semibold text-center text-red-600">
        {error?.message}
      </p>
      <Form
        className="flex flex-col gap-6 items-center justify-center mt-8 w-full md:w-[50%] xl:w-[30%]"
        method="post"
      >
        <label className="form-label" htmlFor="firstname">
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter your firstname"
            required
            onChange={(e) => handleChange(e, "")}
          />
          {inputError.firstname && (
            <p className="form-label-error">{inputError.firstname}</p>
          )}
        </label>
        <label className="form-label" htmlFor="lastname">
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter your lastname"
            required
            onChange={(e) => handleChange(e, "")}
          />
          {inputError.lastname && (
            <p className="error">{inputError.lastname}</p>
          )}
        </label>
        <label className="form-label" htmlFor="email">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            required
            onChange={(e) => handleChange(e, "email")}
          />
          {inputError.email && (
            <p className="form-label-error">{inputError.email}</p>
          )}
        </label>
        <label className="form-label" htmlFor="password">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            required
            onChange={(e) => {
              handleChange(e, "password");
            }}
            value={password!}
          />
          {inputError.password && (
            <p className="form-label-error">{inputError.password}</p>
          )}
        </label>
        <label className="form-label" htmlFor="confirm">
          <input
            type="password"
            name="confirm"
            id="confirm"
            placeholder="Confirm your password"
            required
            onChange={(e) => setConfirm(e.target.value)}
            value={confirm!}
          />
        </label>
        <button
          className="flex items-center justify-center w-full py-2 text-white bg-black border-2 border-transparent rounded-lg hover:bg-black/70 disabled:bg-gray-200 "
          type="submit"
          disabled={
            password !== confirm ||
            password === "" ||
            confirm === "" ||
            inputError.firstname !== "" ||
            inputError.lastname !== "" ||
            inputError.email !== "" ||
            inputError.password !== ""
          }
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
            "Register"
          )}
        </button>
      </Form>
      <p className="mt-6">
        Already have an account ?{" "}
        <Link className="underline underline-offset-2" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
