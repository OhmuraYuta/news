<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

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
            'character' => 'string|nullable',
            'content' => 'required|string',
        ]);

        $chat = Chat::where('user_id', Auth::id())
            ->findOrFail($chat_id);
            
        $rawMessages = $chat->messages()->get();
        
        
        $messages = $rawMessages->map(function ($rawMsg) {
            return [
                'role' => $rawMsg->role,
                'text' => $rawMsg->content
            ];
        })->all();
        
        $payload = [
            'messages' => $messages,
            'character' => $request->input('character'),
            'text' => $request->input('content')
        ];

        $makeTitle = false;
        if ($chat->title == "新規チャット") {
            $payload["makeTitle"] = true;
            $makeTitle = true;
        }

        $res = Http::post('http://api:8000/gemini', $payload);
        
        $chat->messages()->create([
            'role' => 'user',
            'content' => $request->input('content'),
        ]);
            
        $geminiMessage = $chat->messages()->create([
            'role' => 'model',
            'content' => $res->json()['text']
        ]);

        if ($makeTitle) {
            $chat->update([
                'title' => $res->json()['title']
            ]);
        }

        return response()->json([
            'data' => $geminiMessage,
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
            'content' => $request->input('content'),
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
