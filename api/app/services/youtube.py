import json
from youtube_search import YoutubeSearch
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

def get_youtube_video_info(query: str) -> str:
    """
    YouTubeで動画を検索し、その字幕と基本情報を取得する関数。
    
    Args:
        query (str): ユーザーが知りたいニュースのキーワード (例: "最新 AI トレンド")
        
    Returns:
        str: 動画のタイトル、URL、字幕内容を含むJSON文字列。
             字幕がない場合は、その旨を伝えるメッセージ。
    """
    print(f"DEBUG: YouTubeで '{query}' を検索中...")

    # 1. YouTubeで動画を検索 (上位1件を取得)
    results = YoutubeSearch(query, max_results=1).to_dict()
    
    if not results:
        return json.dumps({"error": "動画が見つかりませんでした。"})

    video_data = results[0]
    video_id = video_data['id']
    title = video_data['title']
    url = f"https://www.youtube.com/watch?v={video_id}"

    # 2. 字幕を取得
    try:
        # 日本語の字幕を優先して取得
        ytt_api = YouTubeTranscriptApi()
        transcript_list = ytt_api.fetch(video_id=video_id, languages=['ja'])
        
        # 字幕リストを単純なテキストに変換
        formatter = TextFormatter()
        transcript_text = formatter.format_transcript(transcript_list)
        
        # トークン数が多すぎるとGeminiがエラーになるため、文字数を制限（例: 先頭2000文字など）
        # 必要に応じて調整してください
        truncated_text = transcript_text[:4000].replace('\n', '')

        result = {
            "title": title,
            "url": url,
            "content": truncated_text,
            "note": "内容は一部省略されている可能性があります。また、字幕は自動生成の可能性があるため、文脈に応じて正しく解釈してください。"
        }

        print(f"DEBUG: {result['title']}, {result['url']}")
        
        return json.dumps(result, ensure_ascii=False)

    except Exception as e:
        # 字幕がない動画や、取得禁止の動画の場合
        return json.dumps({
            "title": title,
            "url": url,
            "error": "この動画には字幕がないか、取得できませんでした。",
            "detail": str(e)
        }, ensure_ascii=False)

# --- テスト実行用 ---
if __name__ == "__main__":
    # テスト: 実際に動作するか確認
    test_query = "test"
    print(get_youtube_video_info(test_query))