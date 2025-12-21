'use client';

import { useEffect, useState } from "react";

import { hasToken, getHeader } from "../utils/auth";
import { useRouter } from "next/router";
import SendMessage from "./SendMessage";

type Messages = {
  id: string;
  chat_id: string;
  role: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Chat() {

  const [messages, setMessages] = useState<Messages[]>([]);
  const router = useRouter();

  const chatId = router.query.chatId;

  useEffect(() => {
    if (hasToken()) {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${BASE_URL}/api/chats/${chatId}`
      fetch(url, {
        method: 'GET',
        headers: getHeader()
      })
      .then((res) => res.json())
      .then((json) => json.data.messages)
      .then((messages) => {
        setMessages(messages);
      })
    }
  }, [router, chatId]);

  return (
    <div>
      <ul>
        {messages ?
         messages.map((message) => (
          <li key={message.id}>{message.role}: {message.content}</li>
         )) :
         'ログインしてください'
        }
      </ul>
      <SendMessage />
    </div>
  )
}