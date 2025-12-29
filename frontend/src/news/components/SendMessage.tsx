'use client';

import React, { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";

import { v4 as uuidv4 } from "uuid";

import { speakMessageHandler } from '@/features/chat/handlers';

import Input from "./Input";
import { hasToken, getHeader } from "../utils/auth";
import { Messages } from "./Chat";
import { queryToString } from "../utils/common";

export default function SendMessage({setMessages}: {setMessages: Dispatch<SetStateAction<Messages[]>>}) {

  const [text, setText] = useState<string>('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim() === '') {
      setText('');
      return;
    }
    
    const newMessage = {
      id: uuidv4(),
      chat_id: queryToString(router.query.chatId),
      role: 'user',
      content: text,
      created_at: Date.now().toString(),
      updated_at: Date.now().toString()
    }
    setMessages((prev) => [...prev, newMessage]);

    if (hasToken()) {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = BASE_URL + '/api/chats/' + router.query.chatId + '/messages';
      fetch(url, {
        method: 'POST',
        headers: {
          ...getHeader(),
          'Accept': 'application/json'
        },
        body: JSON.stringify({content: text})
      })
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => {
        console.log(data)
        speakMessageHandler(data.content);
        setMessages((prev) => [...prev, data]);
      })
    }

    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-[51]">
      <div className="border border-black"><Input text={text} setText={setText} /></div>
      <button type="submit">送信</button>
    </form>
  )
}