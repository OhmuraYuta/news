<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MessageController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::resource('chats', ChatController::class)->only([
        'index', 'store', 'show'
    ]);

    Route::resource('chats.messages', MessageController::class)->only([
        'store', 'update'
    ]);
});

Route::get('/auth/google/url', [AuthController::class, 'getGoogleAuthUrl']);
Route::post('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);