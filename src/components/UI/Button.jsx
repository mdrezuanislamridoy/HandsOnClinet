import React from "react";

export default function Button({
  type,
  onClick,
  children,
  disabled,
  className,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-md ${className}`}
    >
      {children}
    </button>
  );
}
