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
  const [character, setCharacter] = useState<string>('');
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
        body: JSON.stringify({character: character, content: text})
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

  const [modeText, setModeText] = useState(true);

  const changeMode = () => {
    setModeText(!modeText);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-2 z-[51] w-[80%] fixed bottom-5 right-1/2 translate-x-1/2">
      {modeText ? (
        <div className=""><Input text={text} setText={setText} placeholder="メッセージを入力" /></div>
      ) : (
        <div className=""><Input text={character} setText={setCharacter} placeholder="性格を入力" /></div>
      )}
      <div className="flex justify-between items-center">
        <button onClick={changeMode} className="size-7 text-[#0096D1]"><i className="fa-solid fa-arrows-rotate"></i></button>
        <button type="submit" className="bg-[#0096D1] p-3 size-7 rounded text-center content-center"><i className="fa-regular fa-paper-plane rotate-45 text-white -translate-x-[55%] -translate-y-[60%]"></i></button>
      </div>
    </form>
  )
}