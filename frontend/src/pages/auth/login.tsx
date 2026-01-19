'use client'

import { handleLogin } from "@/news/utils/auth"

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
        Googleでログイン
      </button>
    </div>
  )
}