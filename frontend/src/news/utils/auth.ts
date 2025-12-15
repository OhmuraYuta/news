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