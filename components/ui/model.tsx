"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaXmark } from "react-icons/fa6";

import { cn } from "@/utils/cn";

type ModelProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  closeLabel?: string;
  closeButtonClassName?: string;
};

export function Model({
  open,
  onClose,
  children,
  className,
  contentClassName,
  showCloseButton = true,
  closeLabel = "Đóng modal",
  closeButtonClassName,
}: ModelProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-black/15 px-4 py-6 backdrop-blur-sm",
        className,
      )}
      onClick={onClose}
      role="dialog"
    >
      <div
        className={cn(
          "relative w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#111111] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.6)]",
          contentClassName,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {showCloseButton ? (
          <button
            aria-label={closeLabel}
            className={cn(
              "absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white",
              closeButtonClassName,
            )}
            onClick={onClose}
            type="button"
          >
            <FaXmark className="h-5 w-5" />
          </button>
        ) : null}

        {children}
      </div>
    </div>,
    document.body,
  );
}
