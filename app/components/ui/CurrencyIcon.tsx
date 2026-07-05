"use client";

import { useState } from "react";

/* round currency icon served from public/currency/<code>.svg,
   falling back to the currency code if the file is missing */
export function CurrencyIcon({
  code,
  size = 20,
}: {
  code: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="bg-canvas text-ink-muted flex shrink-0 items-center justify-center rounded-full font-medium uppercase"
        style={{ width: size, height: size, fontSize: size * 0.42 }}
      >
        {code.slice(0, 2)}
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
