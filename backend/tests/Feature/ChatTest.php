<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Chat;

class ChatTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_get_chat(): void
    {
        $user = User::factory()->create();

        Chat::factory()->count(10)->create(
            [
                'user_id' => $user->id
            ]
        );

        $response = $this->actingAs($user)->get('/api/chats');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data');
    }
}
