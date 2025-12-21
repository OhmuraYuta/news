'use client';

import React, { useState } from "react";
import Input from "./Input";

export default function SendMessage() {

  const [text, setText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(text)

    

    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-[55]">
      <div className="border border-black"><Input text={text} setText={setText} /></div>
      <button type="submit">送信</button>
    </form>
  )
}