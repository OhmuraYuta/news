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

    public function test_post_msg(): void
    {
        $user = User::factory()->create();
        Chat::factory()->create(
            [
                'id' => 1,
                'user_id' => $user->id
            ]
        );
        $payload = [
            'content' => 'hoge'
        ];

        $res = $this->actingAs($user)->post('api/chats/1/messages', $payload);

        $res->assertStatus(201)
            ->assertJson(['data' => [
                'id' => 1,
                'content' => 'hoge'
            ]]);
    }

    public function test_update_msg(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create([
                'user_id' => $user->id
            ]);
        $msg = Message::factory()->create([
            'chat_id' => $chat->id,
            'content' => 'hoge'
        ]);
        $payload = ['content' => 'fuga'];

        $url = "/api/chats/$chat->id/messages/$msg->id";
        $res = $this->actingAs($user)->put($url, $payload);
        $res->assertStatus(200)
            ->assertJson(['data' => [
                'content' => 'fuga'
            ]]);
    }
}
