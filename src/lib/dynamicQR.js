
import QRCode from "qrcode";
import { supabase } from "./supabase";

export const qrOptions = {
  errorCorrectionLevel: "M",
  margin: 4,
  width: 1024,
  color: {
    dark: "#000000",
    light: "#FFFFFF",
  },
};

export function validateDestination(value) {
  try {
    const url = new URL(value.trim());

    if (
      !["https:", "http:"].includes(url.protocol) ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      throw new Error("Invalid URL");
    }

    return url.href;
  } catch {
    throw new Error(
      "Enter a valid URL starting with https:// or http://"
    );
  }
}

export function getDynamicURL(shortCode) {
  const base = import.meta.env.VITE_SUPABASE_URL;

  return (
    `${base}/functions/v1/qr-redirect` +
    `?code=${encodeURIComponent(shortCode)}`
  );
}

export async function createDynamicQR(user, name, destination) {
  if (!user) {
    throw new Error("Please log in first.");
  }

  const validURL = validateDestination(destination);

  // Generate a cryptographically random 32-character code.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  const shortCode = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  const { data, error } = await supabase
    .from("qr_codes")
    .insert({
      user_id: user.id,
      name: name.trim() || "Untitled Dynamic QR",
      type: "dynamic",
      content: validURL,
      short_code: shortCode,
    })
    .select("id, name, content, short_code")
    .single();

  if (error) throw error;

  const redirectUrl = getDynamicURL(data.short_code);

  const [png, svg] = await Promise.all([
    QRCode.toDataURL(redirectUrl, qrOptions),
    QRCode.toString(redirectUrl, {
      ...qrOptions,
      type: "svg",
    }),
  ]);

  return { ...data, redirectUrl, png, svg };
}

export async function updateDynamicDestination(
  user,
  id,
  destination
) {
  if (!user) {
    throw new Error("Please log in first.");
  }

  const validURL = validateDestination(destination);

  const { data, error } = await supabase
    .from("qr_codes")
    .update({ content: validURL })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("type", "dynamic")
    .select("id, content")
    .single();

  if (error) throw error;

  return data;
}