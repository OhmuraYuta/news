<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/auth/google/url', [AuthController::class, 'getGoogleAuthUrl']);
Route::post('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);