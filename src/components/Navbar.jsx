
import {
  QrCode,
  Bookmark,
  LogOut,
  UserRound,
} from "lucide-react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

export default function Navbar({
  user,
  authLoading,
  openAuth,
}) {
  const navigate = useNavigate();

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/", { replace: true });
  }

  return (
    <header className="border-b border-neutral-800 bg-[#090909]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5">

        {/* LiterallyQR Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-75"
          aria-label="LiterallyQR Home"
        >
          <QrCode size={25} strokeWidth={2.2} />

          <span className="text-xl font-bold tracking-tight">
            LiterallyQR
          </span>
        </Link>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-2 sm:gap-4"
        >
          {!authLoading && user ? (
            <>
              <NavLink
                to="/collection"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-neutral-800 ${
                    isActive
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400"
                  }`
                }
              >
                <Bookmark size={17} />

                <span className="hidden sm:inline">
                  My Collection
                </span>
              </NavLink>

              <span
                title={user.email}
                className="hidden max-w-40 items-center gap-2 truncate text-sm text-neutral-400 md:flex"
              >
                <UserRound size={17} />
                <span className="truncate">
                  {user.email}
                </span>
              </span>

              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                title="Log out"
                className="rounded-lg border border-neutral-700 p-2.5 transition hover:bg-neutral-800"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : !authLoading ? (
            <>
              <button
                type="button"
                onClick={openAuth}
                className="text-sm text-neutral-300 transition hover:text-white"
              >
                Log in
              </button>

              <button
                type="button"
                onClick={openAuth}
                className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Sign up
              </button>
            </>
          ) : (
            <span
              role="status"
              className="text-sm text-neutral-500"
            >
              Loading...
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
