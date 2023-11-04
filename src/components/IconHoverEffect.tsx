import React, { ReactNode } from "react";

type IconHoverEffectProps = {
  children: ReactNode;
  red?: boolean;
  green?: boolean;
};

export const IconHoverEffect = ({
  children,
  red = false,
  green = false,
}: IconHoverEffectProps) => {
  const redClass = red
    ? "outline-red-400 hover:bg-red-200 group-hover-bg-red-200 group-focus-visible:bg-red-200"
    : "";
  const defaultClass =
    !red && !green
      ? "outline-gray-400 hover:bg-gray-200 group-hover-bg-gray-200 group-focus-visible:bg-gray-200"
      : "";
  const greenClass = green
    ? "outline-green-400 hover:bg-green-200 group-hover-bg-green-200 group-focus-visible:bg-green-200"
    : "";
  return (
    <div
      className={`rounded-full p-2 transition-colors duration-200 ${redClass} ${greenClass} ${defaultClass}`}
    >
      {children}
    </div>
  );
};
