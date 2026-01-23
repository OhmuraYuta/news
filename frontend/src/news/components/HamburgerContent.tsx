'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { hasToken, getHeader } from "../utils/auth";
import NewChatsBtn from "./NewChat";

type Chat = {
  id: number;
  title: string;
  updated_at: string;
}

export default function HamburgerContent({isOpen, toggle}: {isOpen: boolean, toggle: () => void}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if(hasToken()) {
      fetch(BASE_URL + '/api/chats', {
        method: 'GET',
        headers: getHeader()
      })
      .then((res) => res.json())
      .then((json) => {
        const chats = json.data;
        setChats(chats);
      })
    }
  }, [isOpen]);

  return (
      <div className="h-full w-screen flex">
        <div className="fixed top-0 h-full w-[60vw] bg-[#3E6EA2] z-[72] transition-all duration-300 pt-20"
            style={{transform: isOpen ? 'translateX(0%)':'translateX(-100%)' }}>
          <ul>
            {chats.length != 0 ?
              chats.map((chat) => (
                <li key={chat.id}><Link href={`/chats/${chat.id}`}>{chat.id}: {chat.title}</Link></li>
              ))
              : 'ログインしてください'}
          </ul>
          <NewChatsBtn />
        </div>
        <div className={`bg-black/20 fixed bottom-0 w-full h-full transition-all duration-300
          ${isOpen ? 'opacity-100 z-[71]':'opacity-0 -z-5'}`}
          onClick={toggle}
        >
        </div>
      </div>
  )
}