'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, [isOpen]);

  return (
      <div className="h-full w-screen flex">
        <div className="p-6 fixed top-0 h-full w-[70vw] bg-[#3E6EA2] z-[72] transition-all duration-300 pt-20 text-white text-xs font-extralight"
            style={{transform: isOpen ? 'translateX(0%)':'translateX(-100%)' }}>
          <Image src="/favicon.ico" width={20} height={20} alt="ロゴ" className="bg-white rounded size-8 p-1 absolute top-4" />
          <div className="my-12">
            <NewChatsBtn />
          </div>
          <p className="text-[#142537] mb-5">あなたのチャット</p>
          {!isLoading ? (
            <ul>
              {chats.length != 0 ?
                chats.map((chat) => (
                  <li key={chat.id} style={{borderBottom: 'white solid 1px'}} className="py-3"><Link href={`/chats/${chat.id}`}>{chat.title}</Link></li>
                ))
                : 'ログインしてください'}
            </ul>
          ) : (
            <div className=" text-white mx-auto">
              読み込み中...
            </div>
          )}
        </div>
        <div className={`bg-black/20 fixed bottom-0 w-full h-full transition-all duration-300
          ${isOpen ? 'opacity-100 z-[71]':'opacity-0 -z-5'}`}
          onClick={toggle}
        >
        </div>
      </div>
  )
}