import React from "react";
import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "mordecaiteam@gmail.com";

export default function Terms() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] px-5 py-16 text-white">
      <article className="mx-auto max-w-3xl">
<a
  href="/"
  className="text-sm text-neutral-400 transition hover:text-white"
>
  ← Back to LiterallyQR
</a>
        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">No BS. Just QR.</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-neutral-500">Effective October 16, 2026</p>
        <p className="mt-8 leading-7 text-neutral-300">By using literallyqr.online ("LiterallyQR," "we," or "us"), you agree to these terms. Please read them before using the service.</p>
        <div className="mt-10 space-y-9 text-sm leading-7 text-neutral-300">
          <section><h2 className="mb-2 text-lg font-bold text-white">1. What we provide</h2><p>LiterallyQR lets you generate static QR codes and, with an account, create and manage dynamic QR codes. These features are currently offered without a subscription or QR-generation fee. We may change features or availability in the future, subject to applicable law and any notice requirements.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">2. Acceptable use</h2><p>You must not use LiterallyQR for phishing, fraud, malware distribution, illegal activity, infringement of others' rights, or attempts to disrupt or compromise our systems. You are responsible for the content and destination URLs of QR codes you create. We may restrict accounts, disable redirects, or remove content to address misuse, security concerns, or legal requirements.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">3. Accounts</h2><p>You are responsible for maintaining the security of your account and for activity under it. Provide accurate account information and contact us if you suspect unauthorized access.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">4. Static and dynamic QR availability</h2><p>A downloaded static QR code works independently of LiterallyQR, but any website or resource it points to may change or stop working. Dynamic QR codes rely on our hosted redirect service. We do not promise uninterrupted redirects, permanent hosting, or lifetime availability. Avoid relying on dynamic codes as the sole access method for critical information.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">5. Third-party destinations</h2><p>QR codes may lead to third-party websites and services. We do not control, endorse, or guarantee those destinations. You should verify links before visiting or sharing them.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">6. Disclaimers</h2><p>To the extent permitted by applicable law, LiterallyQR is provided "as is" and "as available," without warranties of any kind, whether express or implied. We do not guarantee that the service will always be available, secure, or error-free.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">7. Limitation of liability</h2><p>To the maximum extent permitted by law, LiterallyQR and its operators will not be liable for indirect, incidental, special, or consequential damages arising from use of the service, including lost business, unavailable redirects, or data loss. Nothing in these terms limits liability that cannot legally be limited.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">8. Changes and discontinuation</h2><p>We may update these terms or modify, suspend, or discontinue the service. Where legally required, we will provide notice of material changes. Updated terms will show a new effective date.</p></section>
          <section><h2 className="mb-2 text-lg font-bold text-white">9. Contact</h2><p>Questions or abuse reports can be sent to <a className="underline underline-offset-4 hover:text-white" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p></section>
        </div>
        <p className="mt-16 border-t border-white/10 pt-6 text-xs text-neutral-500">LiterallyQR · No BS. Just QR. · literallyqr.online</p>
      </article>
    </main>
  );
}
