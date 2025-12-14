<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // 1. GoogleのログインURLをフロントエンドに返す
    public function getGoogleAuthUrl()
    {
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
        return response()->json(['url' => $url]);
    }

    // 2. フロントエンドからコードを受け取り、ログイン処理をする
    public function handleGoogleCallback(Request $request)
    {
        try {
            // フロントエンドから送られた認証コードを使ってGoogleユーザー情報を取得
            // stateless() はAPI認証でセッションを使わない場合に必須です
            $googleUser = Socialite::driver('google')->stateless()->user();

            // ユーザーを検索、または作成（メールアドレスをキーにする例）
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'password' => bcrypt(Str::random(16)), // ランダムなパスワード
                    // 必要に応じてgoogle_idなどを保存するカラムを追加してください
                ]
            );

            // Sanctumなどでトークンを発行（Laravel Sanctumがインストールされている前提）
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Login successful'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed', 'message' => $e->getMessage()], 401);
        }
    }
}