'use client';

import { Dispatch, SetStateAction } from "react";

export default function Input({text, setText, placeholder}: {text: string, setText: Dispatch<SetStateAction<string>>, placeholder?: string}) {
  return (
    <input type="text"
      onChange={(e) => setText(e.target.value)}
      value={text}
      placeholder={placeholder}
      className="w-full h-full focus:outline-none"
    />
  )
}