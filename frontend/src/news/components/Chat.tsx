'use client';

import { useEffect, useState, useRef } from "react";

import { hasToken, getHeader } from "../utils/auth";
import { useRouter } from "next/router";
import SendMessage from "./SendMessage";

export type Messages = {
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
    if (chatId && hasToken()) {
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
  }, [chatId]);

  const scrollRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[50vh] w-screen absolute bottom-0 z-[70] bg-gradient-to-b from-white/0 to-[#6F93BC]">
      <div className="h-[70%]">
        <ul className="h-full overflow-scroll w-4/5 mx-auto space-y-3" ref={scrollRef}>
          {messages ?
           messages.map((message) => (
            <li key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl
                ${message.role === 'user' ?
                  'bg-[#3E6EA2] text-[#E8F0F8]' :
                  'bg-white text-gray-800'
                }
              `}>
                {message.content}
              </div>
            </li>
           )) :
           'ログインしてください'
          }
        </ul>
      </div>
      <SendMessage setMessages={setMessages}/>
    </div>
  )
}