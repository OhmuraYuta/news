'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { handleLogin, hasToken, getHeader } from '../utils/auth';

type User = {
  name: string;
  email: string;
};

export default function Login() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const getUserInfo = async () => {
  
    if (hasToken()) {
      fetch(BASE_URL + '/api/user', {
        method: 'GET',
        headers: getHeader()
      })
      .then((res) => {
        if(!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
    }
  }

  useEffect(() => {
    if (localStorage != undefined) {
      getUserInfo();
    }
  }, [])

const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      // 1. Laravelにログアウト通知を送る
      await fetch(BASE_URL + '/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
      // エラーになっても、フロント側ではログアウトさせる
    } finally {
      // 2. ブラウザからトークンを削除
      localStorage.removeItem('token');
      router.reload();
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      {user ?
        <div>
          ログイン済み{user?.name}{user?.email}
          <button
            onClick={handleLogout}
          >
            ログアウト
          </button>
        </div> :
        <div>
          <h1>ログイン</h1>
          <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
              Googleでログイン
          </button>
        </div>
      }
    </div>
  );
}