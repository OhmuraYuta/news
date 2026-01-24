export const handleLogin = async () => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    // LaravelからGoogleの認証URLを取得
    const res = await fetch(BASE_URL + '/api/auth/google/url');
    const data = await res.json();

    // Googleへリダイレクト
    window.location.href = data.url;
  } catch (error) {
    console.error('Login error:', error);
  }
};

export const hasToken = (): boolean => {
  if (typeof localStorage === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token;
}

type MakeHeader = {
  'Authorization': string;
  'Content-Type': string;
}

export const getHeader = (): MakeHeader => {
  const token = localStorage.getItem('token');

  return ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  })
}

export async function getOrCreateChat(): Promise<string> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(BASE_URL + '/api/chats', { method: 'GET', headers: getHeader() });
    const json = await res.json();
    const chats = json.data;

    if (chats && chats.length > 0) {
      // Latest chat (already sorted by updated_at desc in backend)
      return `/chats/${chats[0].id}`;
    } else {
      // Create new chat
      const createRes = await fetch(BASE_URL + '/api/chats', { method: 'POST', headers: getHeader() });
      const createJson = await createRes.json();
      return `/chats/${createJson.data.chat_id}`;
    }
  } catch (error) {
    console.error('Error in getOrCreateChat:', error);
    return '/';
  }
}
