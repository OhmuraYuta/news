'use client'

import Image from 'next/image'

import googleLogo from '@/news/img/google-icon.svg'
import { handleLogin } from "@/news/utils/auth"
import { google } from '@ai-sdk/google'

export default function Login() {
  return (
    <div>
      <h1>tookへようこそ！</h1>
      <button onClick={handleLogin} className='flex items-center bg-[#3E6EA2]'>
        <Image src={googleLogo} alt='google logo' />
        Googleでログイン
      </button>
    </div>
  )
}