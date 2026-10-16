
import { Check, ArrowDown, ShieldCheck } from "lucide-react";
import QRGenerator from "../components/QRGenerator";

export default function Home({
  user,
  openAuth,
  openCollection,
}) {
  return (
    <main className="min-h-screen bg-[#0C0C0C] text-white">
      {/* Side-by-side hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-24">
        
        {/* Left: Branding */}
        <div className="text-center lg:text-left">
          <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-[-0.06em] sm:text-7xl xl:text-8xl">
            No BS.
            <br />
            Just QR<span className="text-neutral-500">.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-neutral-400 sm:text-lg lg:mx-0">
            Tired of "free" QR generators that hit you with
            a paywall? Same. Make your QR code, download it,
            and get on with your day.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4 lg:justify-start">
            {[
              "No subscriptions",
              "No watermarks",
              "No surprise paywalls",
            ].map((text) => (
              <span
                key={text}
                className="flex items-center gap-2 text-sm text-neutral-300"
              >
                <Check size={16} className="text-white" />
                {text}
              </span>
            ))}
          </div>

          <div className="mt-10 flex justify-center lg:justify-start">
            <a
              href="#generator"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Start generating
              <ArrowDown size={16} />
            </a>
          </div>
        </div>

        {/* Right: Actual working QR generator */}
        <div id="generator" className="w-full min-w-0 scroll-mt-8">
          <QRGenerator
            user={user}
            openAuth={openAuth}
            openCollection={openCollection}
          />
        </div>
      </section>

      {/* Why we exist */}
      <section className="border-t border-neutral-800 px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Why this exists
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            We got tired of the fake-free stuff, too.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-neutral-400">
            You shouldn't have to create an account, enter
            your card details, or start a subscription just
            to make a basic QR code. So we built a simpler
            alternative.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Paste your link",
                body: "Drop in a URL or some text.",
              },
              {
                number: "02",
                title: "Generate",
                body: "Get your QR code in seconds.",
              },
              {
                number: "03",
                title: "Download",
                body: "Grab your PNG or SVG. No checkout.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-xl border border-neutral-800 bg-[#141414] p-6"
              >
                <span className="text-xs font-bold text-neutral-500">
                  {item.number}
                </span>
                <h3 className="mt-5 font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="border-t border-neutral-800 px-5 py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-center">
          <ShieldCheck
            size={32}
            className="shrink-0 text-neutral-400"
          />

          <div>
            <h2 className="text-xl font-bold">
              Free doesn't mean misleading.
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Static QR codes work without an account.
              Dynamic QR codes let you edit destinations
              later and require a free account to manage.
              No subscription needed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
