
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowLeft,
  Download,
  Trash2,
  Bookmark,
  Pencil,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  getDynamicURL,
  updateDynamicDestination,
  qrOptions,
} from "../lib/dynamicQR";

export default function Collection({ user, goHome }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [newURL, setNewURL] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCollection() {
      setLoading(true);
      setError("");
      setItems([]);

      const { data, error } = await supabase
        .from("qr_codes")
        .select(
          "id, name, type, content, short_code, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const results = await Promise.all(
        (data || []).map(async (item) => {
          const encodedValue =
            item.type === "dynamic"
              ? getDynamicURL(item.short_code)
              : item.content;

          const preview = await QRCode.toDataURL(
            encodedValue,
            qrOptions
          ).catch(() => null);

          return { ...item, preview };
        })
      );

      if (!active) return;

      setItems(results);
      setLoading(false);
    }

    loadCollection();

    return () => {
      active = false;
    };
  }, [user.id]);

  function startEditing(item) {
    setEditing(item);
    setNewURL(item.content);
    setError("");
  }

  async function saveDestination() {
    if (!editing || updating) return;

    setUpdating(true);
    setError("");

    try {
      const updated = await updateDynamicDestination(
        user,
        editing.id,
        newURL
      );

      setItems((current) =>
        current.map((item) =>
          item.id === editing.id
            ? { ...item, content: updated.content }
            : item
        )
      );

      setEditing(null);
    } catch (err) {
      setError(err.message || "Unable to update destination.");
    } finally {
      setUpdating(false);
    }
  }

  async function deleteQR(item) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    setError("");

    const { error } = await supabase
      .from("qr_codes")
      .delete()
      .eq("id", item.id)
      .eq("user_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    setItems((current) =>
      current.filter((qr) => qr.id !== item.id)
    );
  }

  function downloadQR(item) {
    if (!item.preview) return;

    const link = document.createElement("a");
    link.href = item.preview;
    link.download = `freeqr-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-12">
      <button
        onClick={goHome}
        className="mb-8 flex items-center gap-2 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Generator
      </button>

      <div className="mb-9">
        <h1 className="text-3xl font-bold tracking-tight">
          My Collection
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Manage your saved static and dynamic QR codes.
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-5 text-sm text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-neutral-400">
          Loading your collection...
        </p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-[#141414] px-6 py-16 text-center">
          <Bookmark
            size={32}
            className="mx-auto mb-4 text-neutral-500"
          />
          <h2 className="text-lg font-semibold">
            No saved QR codes yet
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Generate a QR code and save it to see it here.
          </p>
          <button
            onClick={goHome}
            className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black"
          >
            Create QR Code
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-neutral-800 bg-[#141414] p-5"
            >
              <div className="mb-5 flex justify-center rounded-lg bg-white p-4">
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt={`QR code for ${item.name}`}
                    className="h-44 w-44"
                  />
                ) : (
                  <p className="p-10 text-sm text-black">
                    Preview unavailable
                  </p>
                )}
              </div>

              <div className="mb-3 flex items-center justify-between gap-2">
                <h2
                  className="truncate font-semibold"
                  title={item.name}
                >
                  {item.name}
                </h2>

                <span className="shrink-0 rounded-full border border-neutral-700 px-2 py-1 text-xs text-neutral-400">
                  {item.type === "dynamic"
                    ? "Dynamic"
                    : "Static"}
                </span>
              </div>

              <p
                title={item.content}
                className="truncate text-xs text-neutral-400"
              >
                {item.content}
              </p>

              <p className="mt-3 text-xs text-neutral-500">
                {new Date(item.created_at).toLocaleDateString()}
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => downloadQR(item)}
                  disabled={!item.preview}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
                >
                  <Download size={16} />
                  Download
                </button>

                <button
                  onClick={() => deleteQR(item)}
                  aria-label={`Delete ${item.name}`}
                  className="rounded-lg border border-neutral-700 px-3 py-2.5 text-neutral-300 hover:bg-neutral-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {item.type === "dynamic" && (
                <button
                  onClick={() => startEditing(item)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm hover:bg-neutral-800"
                >
                  <Pencil size={15} />
                  Edit Destination
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit destination modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !updating) {
              setEditing(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-title"
            className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#141414] p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="edit-title"
                className="text-xl font-semibold"
              >
                Edit Destination
              </h2>

              <button
                onClick={() => setEditing(null)}
                disabled={updating}
                aria-label="Close"
                className="text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-5 text-sm text-neutral-400">
              Change where this QR code redirects.
              The QR image will remain the same.
            </p>

            <label
              htmlFor="edit-url"
              className="mb-2 block text-sm font-medium"
            >
              New destination URL
            </label>

            <input
              id="edit-url"
              type="url"
              value={newURL}
              onChange={(e) => setNewURL(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-white"
            />

            <button
              onClick={saveDestination}
              disabled={updating}
              className="mt-5 w-full rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
