<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $chats = $user->chats()
            ->orderBy('updated_at', 'desc')
            ->get(['id', 'title', 'updated_at']);

        return response()->json([
            'data' => $chats
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $newChat = Chat::create([
            'user_id' => Auth::id(),
            'title' => 'test chat',
        ]);

        return response()->json([
            'data' => [
                'chat_id' => $newChat->id,
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Chat $chat)
    {
        if ($chat->user_id !== Auth::id()) {
            return response()->json(['message' => 'アクセス権がありません。'], 403);
        }

        $chat->load(['messages' => function ($query) {
            $query->orderBy('created_at', 'asc'); // メッセージを時系列順に
        }]);
        
        return response()->json([
            'data' => $chat,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
