import React from "react";
import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "mordecaiteam@gmail.com";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] px-5 py-16 text-white">
      <article className="mx-auto max-w-3xl">
        <Link
  to="/"
  className="text-sm text-neutral-400 transition hover:text-white">← Back to LiterallyQR</Link>
        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">The straightforward version</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-neutral-500">Effective October 16, 2026</p>
        <p className="mt-8 leading-7 text-neutral-300">At LiterallyQR, we believe privacy should be simple. This policy explains what information we handle when you use literallyqr.online.</p>
        <div className="mt-10 space-y-9 text-sm leading-7 text-neutral-300">
          <section><h2 className="mb-2 text-lg font-bold text-white">1. Information we handle</h2><p>If you create an account, we process your email address and information needed for authentication. When you save QR codes, we store related information such as names, encoded content, destination URLs, QR type, and creation dates. Our hosting and infrastructure providers may also process technical information such as IP addresses, request details, and security logs.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">2. How we use it</h2><p>We use information to provide account access, save and manage QR codes, operate dynamic redirects, maintain security, prevent misuse, and troubleshoot problems. We do not sell your personal information.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">3. Static and dynamic QR codes</h2><p>Static QR codes encode the information you provide directly into the QR image. If you save one to your account, its associated content is stored. Dynamic QR codes use a LiterallyQR-managed redirect, so we store the destination URL and information needed to resolve the redirect. Anyone who scans a dynamic QR code may be sent to its current destination.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">4. Service providers</h2><p>We use Supabase for authentication, database services, and dynamic QR redirects, and Netlify for website hosting. These providers process information as necessary to operate their services and according to their own applicable terms and privacy practices.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">5. Security and retention</h2><p>We take reasonable steps to protect information, but no internet service is completely secure. We keep account and saved QR data while needed to operate the service, and may retain limited information longer where reasonably necessary for security, compliance, or legal obligations.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">6. Your choices</h2><p>You can manage and delete saved QR codes through your account. To request access to or deletion of other account information, contact us at the email below. We will review requests in accordance with applicable law.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">7. Updates</h2><p>We may revise this policy as the service changes. We will update the effective date when we do.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">8. Contact</h2><p>For privacy questions or data requests, email <a className="underline underline-offset-4 hover:text-white" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p></section>
        </div>
        <p className="mt-16 border-t border-white/10 pt-6 text-xs text-neutral-500">LiterallyQR · No BS. Just QR. · literallyqr.online</p>
      </article>
    </main>
  );
}
