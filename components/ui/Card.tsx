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
          ? "bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-md hover:border-teal-300 hover:shadow-lg"
          : "bg-white border border-slate-200 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
