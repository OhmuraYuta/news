'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      // Laravelにコードを送信してトークンをもらう
      fetch('http://localhost:8080/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Googleから貰ったcodeを送る
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          console.log('Token:', data.token);
          // ここでトークンをCookieやlocalStorageに保存する
          localStorage.setItem('token', data.token);
          
          // ログイン後のページへ遷移
          router.push('/');
        } else {
          console.error('Login failed', data);
        }
      })
      .catch((err) => console.error('Error:', err));
    }
  }, [searchParams, router]);

  return <div>ログイン処理中...</div>;
}