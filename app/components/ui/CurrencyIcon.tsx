"use client";

import { useState } from "react";

/* round currency icon served from public/currency/<code>.svg,
   falling back to the flag emoji if the file is missing */
export function CurrencyIcon({
  code,
  flag,
  size = 20,
}: {
  code: string;
  flag: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="flex shrink-0 items-center justify-center leading-none"
        style={{ width: size, height: size, fontSize: size * 0.8 }}
      >
        {flag}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/currency/${code.toLowerCase()}.svg`}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full"
      onError={() => setFailed(true)}
    />
  );
}
