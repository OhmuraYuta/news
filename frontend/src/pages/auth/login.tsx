'use client'

import Image from 'next/image'
import { useState } from 'react'

import googleLogo from '@/news/img/google-icon.svg'
import { handleLogin } from "@/news/utils/auth"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setIsLoading(true);
    handleLogin();
  }
  return (
    <div>
      <h1>tookへようこそ！</h1>
      <button onClick={handleClick}
        className='flex items-center justify-center gap-3 bg-[#3E6EA2] h-[60px] w-4/5 max-w-[400px] mx-auto'
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Image src={googleLogo} alt='google logo' />
            Googleでログイン
          </>
        )}
      </button>
    </div>
  )
}