
import { useState } from "react";
import { X, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.session) {
          onClose();
        } else {
          setMessage(
            "Check your email for a verification link to finish signing up."
          );
        }
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) throw error;
        onClose();
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#141414] p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-7 flex items-start justify-between">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#252525]">
              <LockKeyhole size={21} />
            </div>

            <h2
              id="auth-title"
              className="text-2xl font-bold text-white"
            >
              {mode === "login"
                ? "Welcome back"
                : "Create an account"}
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              {mode === "login"
                ? "Log in to access your QR collection."
                : "Save your QR codes and access them anywhere."}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-lg bg-[#222222] p-1">
          {["login", "signup"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => switchMode(item)}
              className={`rounded-md px-3 py-2.5 text-sm font-medium transition ${
                mode === item
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {item === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="auth-email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>

            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-neutral-700 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete={
                  mode === "signup"
                    ? "new-password"
                    : "current-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-neutral-700 bg-[#202020] px-4 py-3 pr-12 text-sm text-white outline-none focus:border-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-sm text-neutral-300">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log in"
              : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Free forever. No subscription required.
        </p>
      </div>
    </div>
  );
}
