'use client';

import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { div } from 'three/webgpu';

type User = {
  name: string;
  email: string;
};

export default function Login() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async () => {
    try {
      // LaravelからGoogleの認証URLを取得
      const res = await fetch(BASE_URL + '/api/auth/google/url');
      const data = await res.json();
      
      // Googleへリダイレクト
      window.location.href = data.url;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      fetch(BASE_URL + '/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
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

  return (
    <div style={{ padding: '50px' }}>
      {user ?
        <div>
          ログイン済み{user?.name}{user?.email}
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