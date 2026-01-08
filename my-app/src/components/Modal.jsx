"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, title, children, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Manage body scroll consistently regardless of render path
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body?.style?.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "auto";
    }
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, [open, mounted]);

  if (!open || !mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-[var(--bg)] border-2 border-[var(--green)] rounded-lg shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-[var(--font)]">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="px-2 py-1 rounded hover:bg-[var(--orange)]"
          >
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
