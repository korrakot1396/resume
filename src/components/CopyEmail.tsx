import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { profile } from "../data/portfolio";

export function CopyEmail() {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("Email copied");
    } catch {
      setStatus("Copy unavailable. Please select the email above.");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 3500);
  }
  return (
    <div className="copy-email">
      <button
        className="text-link"
        onClick={() => {
          void copy();
        }}
      >
        {status === "Email copied" ? <Check size={16} /> : <Copy size={16} />}{" "}
        Copy email address
      </button>
      <output>{status}</output>
    </div>
  );
}
