<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $chat_id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $chat = Chat::where('user_id', Auth::id())
            ->findOrFail($chat_id);
        
        $newMessage = $chat->messages()->create([
            'chat_id' => Auth::id(),
            'role' => 'user',
            'content' => $request->content,
        ]);

        return response()->json([
            'data' => $newMessage,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $chat_id, Message $message)
    {
        if ($message->chat_id != $chat_id || $message->chat->user_id != Auth::id()) {
            return response()->json(['message' => 'アクセス権がありません。'], 403);
        }
        
        $request->validate([
            'content' => 'required|string',
        ]);

        $message->update([
            'content' => $request->content,
        ]);

        return response()->json([
            'data' => $message,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
