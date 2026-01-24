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

  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, [chatId]);

  const scrollRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const lastMessageRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages]);

  const [thinking, setThinking] = useState(false);

  return (
    <div className="h-[50vh] w-screen absolute bottom-0 z-[70] bg-gradient-to-b from-white/0 to-[#6F93BC]">
      <div className="h-[70%]">
        {!isLoading ? (
          <ul className="h-full overflow-scroll w-4/5 mx-auto space-y-3" ref={scrollRef}>
            {messages ?
            messages.map((message, index) => (
              <li key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
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
            {thinking && (
              <li className="flex">
                <div className="flex max-w-[80%] p-3 rounded-2xl bg-white text-gray-800">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-800 border-t-transparent mr-2" />
                  考え中…
                </div>
              </li>
            )}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center text-white h-full w-4/5 mx-auto content-center text-center">
            <div className="size-10 animate-spin rounded-full border-4 border-white border-t-transparent mb-3" />
            チャットを読み込み中
          </div>
        )}
      </div>
      <SendMessage setMessages={setMessages} setThinking={setThinking}/>
    </div>
  )
}