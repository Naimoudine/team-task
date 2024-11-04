import { Form } from "react-router-dom";
import Header from "../components/landing/header/Header";

type Props = {};

export default function Contact({}: Props) {
  return (
    <div className="w-screen h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center gap-4 pt-40">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="mt-2">We'll get back to you shortly.</p>
        <div className="flex gap-16 mt-12">
          <Form className="flex flex-col gap-8 w-[400px]">
            <label className="flex flex-col gap-2 form-label" htmlFor="name">
              <span>Full name</span>
              <input type="text" name="name" id="name" />
            </label>
            <label className="flex flex-col gap-2 form-label" htmlFor="emal">
              <span>Email address</span>
              <input type="email" name="email" id="email" />
            </label>
            <label htmlFor="message" className="flex flex-col gap-2 form-label">
              <span>message</span>
              <textarea name="message" id="message" className="resize-x-none" />
            </label>
            <button
              className="w-full py-2 font-semibold text-white bg-black rounded-lg hover:bg-black/70"
              type="submit"
            >
              Contact us
            </button>
          </Form>
        </div>
      </main>
    </div>
  );
}
