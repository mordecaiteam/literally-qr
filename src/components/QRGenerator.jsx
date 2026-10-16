
import { useState } from "react";
import QRCode from "qrcode";
import {
  ArrowRight,
  BookmarkPlus,
  Check,
  Download,
  Link2,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  createDynamicQR,
  qrOptions,
} from "../lib/dynamicQR";

function downloadData(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadSvg(svg, filename) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  downloadData(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function QRGenerator({
  user,
  openAuth,
  openCollection,
}) {
  const [mode, setMode] = useState("static");

  const [input, setInput] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [qrSvg, setQrSvg] = useState("");
  const [generatedValue, setGeneratedValue] = useState("");
  const [qrName, setQrName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [dynamicName, setDynamicName] = useState("");
  const [dynamicURL, setDynamicURL] = useState("");
  const [dynamicResult, setDynamicResult] = useState(null);
  const [dynamicLoading, setDynamicLoading] = useState(false);
  const [dynamicError, setDynamicError] = useState("");

  function resetStatic() {
    setQrImage("");
    setQrSvg("");
    setGeneratedValue("");
    setSaved(false);
    setSaveMessage("");
    setError("");
  }

  function switchMode(nextMode) {
    if (loading || saving || dynamicLoading) return;
    setMode(nextMode);
    resetStatic();
    setDynamicResult(null);
    setDynamicError("");
  }

  async function generateStatic() {
    const value = input.trim();

    if (!value) {
      setError("Please enter a URL or some text.");
      return;
    }

    setLoading(true);
    resetStatic();

    try {
      const [png, svg] = await Promise.all([
        QRCode.toDataURL(value, qrOptions),
        QRCode.toString(value, {
          ...qrOptions,
          type: "svg",
        }),
      ]);

      setQrImage(png);
      setQrSvg(svg);
      setGeneratedValue(value);
    } catch (err) {
      setError(err.message || "Unable to generate QR code.");
    } finally {
      setLoading(false);
    }
  }

  async function saveStatic() {
    if (!generatedValue || saving || saved) return;

    if (!user) {
      openAuth();
      return;
    }

    setSaving(true);
    setSaveMessage("");

    const { error } = await supabase
      .from("qr_codes")
      .insert({
        user_id: user.id,
        name: qrName.trim() || "Untitled QR Code",
        type: "static",
        content: generatedValue,
      });

    if (error) {
      setSaveMessage(error.message);
    } else {
      setSaved(true);
      setSaveMessage("Saved to your collection!");
    }

    setSaving(false);
  }

  async function generateDynamic() {
    if (dynamicLoading) return;

    if (!user) {
      openAuth();
      return;
    }

    setDynamicLoading(true);
    setDynamicError("");
    setDynamicResult(null);

    try {
      const result = await createDynamicQR(
        user,
        dynamicName,
        dynamicURL
      );

      setDynamicResult(result);
    } catch (err) {
      setDynamicError(
        err.message || "Unable to create dynamic QR."
      );
    } finally {
      setDynamicLoading(false);
    }
  }

  const preview =
    mode === "static" ? qrImage : dynamicResult?.png;

  const svg =
    mode === "static" ? qrSvg : dynamicResult?.svg;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#141414]">
      <div className="p-6 sm:p-9">
        {/* Mode selector */}
        <div className="mb-8 grid grid-cols-2 rounded-lg bg-[#202020] p-1">
          {["static", "dynamic"].map((item) => (
            <button
              key={item}
              type="button"
              disabled={loading || saving || dynamicLoading}
              onClick={() => switchMode(item)}
              className={`rounded-md px-4 py-3 text-sm font-medium transition ${
                mode === item
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {item === "static" ? "Static QR" : "Dynamic QR"}
            </button>
          ))}
        </div>

        {mode === "static" ? (
          <div>
            <label
              htmlFor="static-input"
              className="mb-3 flex items-center gap-2 text-sm font-semibold"
            >
              <Link2 size={17} />
              URL or text
            </label>

            <textarea
              id="static-input"
              rows={3}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resetStatic();
              }}
              placeholder="https://example.com"
              className="w-full resize-none rounded-lg border border-neutral-700 bg-[#1A1A1A] p-4 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-white"
            />

            <p className="mt-2 text-xs text-neutral-500">
              Static QR codes never require our redirect server.
            </p>

            {error && (
              <p role="alert" className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              onClick={generateStatic}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-4 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate QR Code"}
              <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <LockKeyhole size={18} />
              <h2 className="text-lg font-semibold">
                Dynamic QR Code
              </h2>
            </div>

            <p className="text-sm leading-6 text-neutral-400">
              Create a QR code whose destination you can
              change later. Automatically saved to your account.
            </p>

            <div>
              <label
                htmlFor="dynamic-name"
                className="mb-2 block text-sm font-medium"
              >
                QR code name
              </label>
              <input
                id="dynamic-name"
                type="text"
                maxLength={100}
                value={dynamicName}
                onChange={(e) => {
                  setDynamicName(e.target.value);
                  setDynamicResult(null);
                }}
                placeholder="e.g. Restaurant Menu"
                className="w-full rounded-lg border border-neutral-700 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label
                htmlFor="dynamic-url"
                className="mb-2 block text-sm font-medium"
              >
                Destination URL
              </label>
              <input
                id="dynamic-url"
                type="url"
                value={dynamicURL}
                onChange={(e) => {
                  setDynamicURL(e.target.value);
                  setDynamicResult(null);
                }}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-neutral-700 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-white"
              />
              <p className="mt-2 text-xs text-neutral-500">
                You can update this URL in My Collection.
              </p>
            </div>

            {dynamicError && (
              <p role="alert" className="text-sm text-red-400">
                {dynamicError}
              </p>
            )}

            <button
              onClick={generateDynamic}
              disabled={dynamicLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-4 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-50"
            >
              {dynamicLoading
                ? "Creating..."
                : user
                ? "Generate Dynamic QR"
                : "Log in to Generate"}
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>

      {/* Shared QR preview */}
      {preview && (
        <div className="border-t border-neutral-800 bg-[#111111] p-6 text-center sm:p-9">
          <h2 className="text-lg font-semibold">
            Your QR code is ready
          </h2>

          <p className="mt-2 text-sm text-neutral-400">
            {mode === "dynamic"
              ? "Saved automatically. Scan to test your redirect."
              : "Scan, download, or save your QR code."}
          </p>

          <div className="mx-auto my-7 w-fit rounded-xl bg-white p-4">
            <img
              src={preview}
              alt="Generated QR code"
              className="h-56 w-56 sm:h-64 sm:w-64"
            />
          </div>

          {mode === "dynamic" && dynamicResult && (
            <div className="mx-auto mb-6 max-w-md">
              <p className="mb-2 text-xs text-neutral-400">
                Permanent QR URL
              </p>
              <p className="break-all rounded-lg border border-neutral-800 bg-[#202020] p-3 text-xs text-neutral-300">
                {dynamicResult.redirectUrl}
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => downloadData(
                preview,
                "freeqr-code.png"
              )}
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black hover:bg-neutral-200"
            >
              <Download size={17} />
              PNG
            </button>

            <button
              onClick={() => downloadSvg(
                svg,
                "freeqr-code.svg"
              )}
              className="flex items-center gap-2 rounded-lg border border-neutral-700 px-5 py-3 text-sm hover:bg-neutral-800"
            >
              <Download size={17} />
              SVG
            </button>

            {mode === "static" && (
              <button
                onClick={resetStatic}
                title="Reset QR"
                aria-label="Reset QR"
                className="rounded-lg border border-neutral-700 p-3 hover:bg-neutral-800"
              >
                <RotateCcw size={17} />
              </button>
            )}
          </div>

          {mode === "static" ? (
            <div className="mx-auto mt-8 max-w-md border-t border-neutral-800 pt-7 text-left">
              <label
                htmlFor="qr-name"
                className="mb-2 block text-sm font-medium"
              >
                Name your QR code
              </label>

              <input
                id="qr-name"
                value={qrName}
                maxLength={100}
                disabled={saved}
                onChange={(e) => setQrName(e.target.value)}
                placeholder="e.g. My Website"
                className="w-full rounded-lg border border-neutral-700 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-white disabled:opacity-50"
              />

              <button
                onClick={saveStatic}
                disabled={saving || saved}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-600 px-5 py-3 text-sm hover:bg-neutral-800 disabled:opacity-60"
              >
                {saved
                  ? <Check size={17} />
                  : <BookmarkPlus size={17} />}
                {saving
                  ? "Saving..."
                  : saved
                  ? "Saved"
                  : user
                  ? "Save to Collection"
                  : "Log in to Save"}
              </button>

              {saveMessage && (
                <p role="status" className="mt-3 text-center text-sm text-neutral-300">
                  {saveMessage}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm text-neutral-400">
              Dynamic QR codes can be edited anytime.
            </p>
          )}

          {(saved || mode === "dynamic") && (
            <button
              onClick={openCollection}
              className="mt-5 text-sm font-medium text-white underline underline-offset-4"
            >
              View My Collection
            </button>
          )}
        </div>
      )}
    </div>
  );
}
