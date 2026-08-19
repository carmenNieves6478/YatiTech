import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-600/20 active:scale-[0.98]",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 active:scale-[0.98]",
    outline:
      "border-2 border-teal-600/40 hover:border-teal-600 text-teal-700 hover:bg-teal-50 active:scale-[0.98]",
    ghost:
      "text-slate-600 hover:text-teal-700 hover:bg-slate-100 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold",
    md: "px-4 py-2 text-sm font-semibold",
    lg: "px-6 py-3 text-base font-bold",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
