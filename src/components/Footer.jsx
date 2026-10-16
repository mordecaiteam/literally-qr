
import { Link } from "react-router-dom";
import mordecaiLogo from "../assets/mordecAI-logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0C0C0C] text-white">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-6 py-7 sm:flex-row sm:items-center sm:justify-between">

          {/* LiterallyQR copyright and legal links */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">
              © {new Date().getFullYear()} LiterallyQR.
              {" "}All Rights Reserved.
            </p>

            <nav
              aria-label="Legal links"
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/40"
            >
              <Link
                to="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* MordecAI branding */}
          <a
            href="https://getmordecai.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website developed by MordecAI"
            className="group flex w-fit items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-2.5 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
          >
            <span className="whitespace-nowrap text-[10px] tracking-[0.08em] text-white/35 transition-colors duration-300 group-hover:text-white/60">
              Developed by
            </span>

            <img
              src={mordecaiLogo}
              alt="MordecAI"
              className="h-6 w-auto object-contain opacity-70 transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
            />
          </a>

        </div>
      </div>
    </footer>
  );
}
