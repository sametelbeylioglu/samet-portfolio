import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-11 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1d1d1f] px-4 py-2 text-[14px] text-[#f5f5f7] placeholder:text-[#48484a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(255,255,255,0.2)] focus-visible:border-[rgba(255,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
