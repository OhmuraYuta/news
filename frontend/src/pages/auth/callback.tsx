'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getOrCreateChat } from '@/news/utils/auth';
import Loading from '@/news/components/Loading';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      // Laravelにコードを送信してトークンをもらう
      fetch(BASE_URL + '/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Googleから貰ったcodeを送る
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            // ここでトークンをCookieやlocalStorageに保存する
            localStorage.setItem('token', data.token);

            // リダイレクト先を取得
            getOrCreateChat()
              .then((path) => {
                // ログイン後のページへ遷移
                router.push(path);
              })

          } else {
            console.error('Login failed', data);
          }
        })
        .catch((err) => console.error('Error:', err));
    }
  }, [searchParams, router]);

  return (
    <div className="w-screen h-screen content-center text-center">
      <div className="w-fit mx-auto mb-5">
        <Loading />
      </div>
      <p>ログイン処理中</p>
    </div>
  )
}