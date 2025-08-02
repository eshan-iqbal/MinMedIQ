import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 21a9 9 0 0 0 0-18h-1a8 8 0 0 0-8 8v1" />
      <path d="M22 22 15 15" />
      <path d="M12 11.5v-1" />
      <path d="M12 8.5v-1" />
      <path d="M12 5.5v-1" />
      <path d="M10.5 13h-1" />
      <path d="M7.5 13h-1" />
      <path d="M4.5 13h-1" />
      <path d="m4.8 11.2 1.4-1.4" />
      <path d="m8.6 7.4 1.4-1.4" />
      <path d="m6.2 12.8-1.4 1.4" />
      <path d="m10 9-1.4 1.4" />
    </svg>
  );
}
