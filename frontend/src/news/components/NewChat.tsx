'use client';

import { useRouter } from 'next/router';

import { handleLogin, hasToken, getHeader } from '../utils/auth';

export default function NewChatsBtn() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const router = useRouter();

  const createNewChat = () => {
  if (!hasToken()) {
    return handleLogin();
  }

  fetch(BASE_URL + '/api/chats', {
    method: 'POST',
    headers: getHeader()
  })
  .then((res) => res.json())
  .then((json) => json.data)
  .then((data) => {
    const id = data.chat_id;
    console.log(id)
    router.push('/chats/' + id);
  })
  }

  return (
    <button
      onClick={createNewChat}
    >
      <i className="fa-regular fa-pen-to-square mr-2"></i>
      新規チャット
    </button>
  )
}