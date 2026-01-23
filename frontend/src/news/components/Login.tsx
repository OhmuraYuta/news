'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { handleLogin, hasToken, getHeader } from '../utils/auth';

type User = {
  name: string;
  email: string;
  avatar_url?: string;
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

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setIsLoading(true);
    handleLogout();
  }

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className='z-[70]'>
      {user ?
        <div className='relative'>
          <button onClick={toggle} className='flex'>
            <img src={user.avatar_url} alt={user?.name} className='w-8 h-8 rounded-full' />
            <p>{user?.name}</p>
          </button>
          {isOpen ?
            <div className='z-[71] w-screen h-screen bg-white absolute top-0 right-0 p-5'>
              <div className='flex justify-end'>
                <button
                  onClick={toggle}
                  className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                  <XMarkIcon className='w-8 h-8 text-gray-600' />
                </button>
              </div>
              <p>{user?.email}</p>
              <img src={user.avatar_url} alt="icon" />
              <p>{user?.name}</p>
              <button
                onClick={handleClick}
                className='flex items-center justify-center gap-3 bg-[#3E6EA2] h-[60px] w-4/5 max-w-[400px] mx-auto'
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    ログアウト
                  </>
                )}
              </button>
            </div> : null
          }
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