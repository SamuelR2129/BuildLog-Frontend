import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  small?: boolean;
  gray?: boolean;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = ({
  gray = false,
  className = "",
  ...props
}: ButtonProps) => {
  const colorClasses = gray
    ? "bg-gray-400 hover:bg-gray-300 focus-visible:bg-gray-400"
    : "bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400";
  return (
    <button
      className={`rounded-full px-2 py-1 text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:font-bold  ${colorClasses} ${className}`}
      {...props}
    ></button>
  );
};
