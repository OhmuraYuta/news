<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\User;
use App\Models\Chat;
use App\Models\Message;

class MessageTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_get_msg(): void
    {
        $user = User::factory()->create();

        Chat::factory()->create(
            [
                'id' => 1,
                'user_id' => $user->id
            ]
        );

        Message::factory()->count(10)->create(['chat_id' => 1]);

        $response = $this->actingAs($user)->get('/api/chats/1/');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data.messages');
    }
}
