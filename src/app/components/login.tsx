"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUserThunk } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import Image from "next/image";
import pinnak from "../assets/pinnak.png";
import userPic from "../assets/user-pic.png";

type LoginFormValues = {
  email: string;
  password: string;
};

export function Login() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    try {
      const result = await dispatch(loginUserThunk(values)).unwrap();
      if (result) {
        reset();
        router.push("/dashboard");
      }
    } catch (err: any) {
      setServerError(err || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Background Effects */}
      <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-green-300/40 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-emerald-300/40 blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl"></div>

      {/* Floating Icons */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 text-4xl animate-float">📊</div>
        <div className="absolute bottom-32 right-20 text-5xl animate-float animation-delay-2000">
          🎯
        </div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-float animation-delay-1500">
          ⚡
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-5xl animate-float animation-delay-2500">
          📈
        </div>
        <div className="absolute top-1/2 right-10 text-3xl animate-float animation-delay-3000">
          🤝
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* LEFT SIDE */}
            <div className="flex flex-col items-center justify-start rounded-l-3xl bg-gradient-to-br from-green-400/20 via-emerald-400/20 to-teal-400/20 p-8 backdrop-blur-sm border border-green-200/50 shadow-xl">
              {/* Logo TOP CENTER */}
              <div className="flex justify-center  ">
                <div className="relative   ">
                  <Image
                    src={pinnak}
                    alt="Pinnak Logo"
                    
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="space-y-4 text-center">
              
                <p className="text-base text-gray-700 md:text-lg leading-relaxed">
                  Transform your sales pipeline with intelligent lead scoring,
                  automated follow-ups, and predictive analytics. Pinnak
                  helps you convert more leads into loyal customers.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center rounded-r-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-green-200">
              <div className="w-full max-w-md p-8 lg:p-12">
                <div className="mb-8 text-center">
                  <div className="relative mx-auto mb-4 overflow-hidden">
                    <Image
                      src={userPic}
                      alt="User Profile"
                      width={100}
                      height={80}
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mt-4">
                    Welcome Back
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Sign in to manage your leads and pipeline
                  </p>
                </div>

                {serverError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {serverError}
                  </div>
                )}

                <form
                  className="space-y-5"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      className={`w-full rounded-xl border px-4 py-3 ${
                        errors.email ? "border-red-400" : "border-green-200"
                      }`}
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className={`w-full rounded-xl border px-4 py-3 ${
                        errors.password ? "border-red-400" : "border-green-200"
                      }`}
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                  </div>

                  {/* BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-white font-semibold"
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-500">
                  © {new Date().getFullYear()} Pinnak
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
