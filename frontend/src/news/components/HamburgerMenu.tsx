"use client";

import { useState } from "react";

export default function HamburgerMenu({ w, h }: { w: number; h: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const wpx = w * 4;
  const hpx = h * 4;
  const space = (hpx - 16 - 2) / 2;

  return (
    <button
      onClick={toggle}
      style={{ width: `${wpx}px`, height: `${hpx}px` }}
      className="flex flex-col p-2 justify-between items-center group"
    >
      <span
        style={{
          transform: isOpen ? `translateY(${space}px) rotate(45deg)` : "translateY(0) rotate(0)",
        }}
        className="bg-black block transition-all duration-300 h-0.5 w-full rounded-sm origin-center"
      ></span>

      <span
        className={`bg-black block transition-all duration-300 h-0.5 w-full rounded-sm ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      ></span>

      <span
        style={{
          transform: isOpen ? `translateY(-${space}px) rotate(-45deg)` : "translateY(0) rotate(0)",
        }}
        className="bg-black block transition-all duration-300 h-0.5 w-full rounded-sm origin-center"
      ></span>
    </button>
  );
}