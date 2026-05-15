"use client";

import { useState, type MouseEventHandler, type ReactNode } from "react";

import { cn } from "@/utils/cn";

type BtnIconEffect = "none" | "rotate" | "scale" | "pulse";

type BtnIconProps = {
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: BtnIconEffect;
  className?: string;
  iconClassName?: string;
  activeClassName?: string;
  defaultActive?: boolean;
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  ariaLabel?: string;
  disabled?: boolean;
};

export function BtnIcon({
  icon,
  onClick,
  type = "none",
  className,
  iconClassName,
  activeClassName,
  defaultActive = false,
  active,
  onActiveChange,
  ariaLabel = "icon button",
  disabled = false,
}: BtnIconProps) {
  const [internalActive, setInternalActive] = useState(defaultActive);
  const isControlled = active !== undefined;
  const isActive = isControlled ? active : internalActive;

  const effectClassName = getEffectClassName(type, isActive);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (disabled) {
      return;
    }

    const nextActive = !isActive;

    if (!isControlled) {
      setInternalActive(nextActive);
    }

    onActiveChange?.(nextActive);
    onClick?.(event);
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isActive}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center transition-transform duration-300 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300",
          effectClassName,
          isActive ? activeClassName : undefined,
          iconClassName,
        )}
      >
        {icon}
      </span>
    </button>
  );
}

function getEffectClassName(type: BtnIconEffect, isActive: boolean) {
  if (type === "rotate") {
    return isActive ? "rotate-90" : "rotate-0";
  }

  if (type === "scale") {
    return isActive ? "scale-110" : "scale-100";
  }

  if (type === "pulse") {
    return isActive ? "scale-105 opacity-80" : "scale-100 opacity-100";
  }

  return "";
}
