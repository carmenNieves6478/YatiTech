import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        glass
          ? "bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl shadow-black/20 hover:border-slate-700/80"
          : "bg-slate-900 border border-slate-800 shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
