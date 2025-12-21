'use client';

import { Dispatch, SetStateAction } from "react";

export default function Input({text, setText}: {text: string, setText: Dispatch<SetStateAction<string>>}) {
  return (
    <input type="text"
      onChange={(e) => setText(e.target.value)}
      value={text}
      className="w-full h-full"
    />
  )
}