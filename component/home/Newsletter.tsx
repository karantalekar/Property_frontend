"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import {
  subscribeEmail,
  resetNewsletter,
} from "@/redux/slices/newsletterSlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { loading, success, error } = useSelector(
    (state: RootState) => state.newsletter,
  );

  const handleSubscribe = () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    dispatch(subscribeEmail(email));
  };

  useEffect(() => {
    if (success) {
      toast.success("Subscribed successfully ");
      setEmail("");
      dispatch(resetNewsletter());
    }

    if (error) {
      toast.error(error);
      dispatch(resetNewsletter());
    }
  }, [success, error, dispatch]);

  return (
    <section className="relative w-full h-[430px] flex items-center justify-center text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/newsletter.png')" }}
      />

      <div className="relative z-10 px-6 max-w-4xl text-white">
        <p className="text-sm tracking-widest uppercase mb-4">
          Stay Tuned with Regent Groove
        </p>

        <h2 className="text-3xl md:text-5xl leading-snug mb-10">
          Sign up for our newsletter to receive our news, deals and special
          offers.
        </h2>

        <div className="flex flex-col text-black sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-[450px] px-5 py-4 rounded-md bg-white outline-none"
          />

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="flex items-center text-lg gap-2 bg-[#E6D7C3] hover:bg-[#d9c7af] px-6 py-4 rounded-md font-medium transition"
          >
            {loading ? "Submitting..." : "Subscribe"}
            <Send size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
