import requests
import os

def get_news_from_apitube(query: str):
    """Searches for web news articles using the APITube API.

    Queries the APITube service for Japanese news articles where the title
    matches the provided query. Aggregates the top results into a single
    summary string.

    Args:
        query: A string representing the news topic or keywords to search for.

    Returns:
        A string containing a concatenated list of found articles, including
        their titles, sources, and brief summaries.

        If no matching articles are found or if the API request fails,
        a message string indicating the result or error is returned.
    """
    print(f"\n[System] Webニュース検索: query='{query}'")
    
    # APITubeのエンドポイント
    url = "https://api.apitube.io/v1/news/everything"

    headers = {
        "X-API-Key": os.environ.get('APITUBE_API_KEY')
    }
    
    # パラメータ設定
    params = {
        "title": query,           # 記事タイトルで検索
        "per_page": 3,            # 記事数は3つ程度で十分
    }
    
    try:
        response = requests.get(url,headers=headers, params=params)
        data = response.json()
        
        # 結果の整形
        results = []
        # 'results' というキーの中に記事リストが入っています
        articles = data.get("results", [])
        
        if not articles:
            return "該当するニュース記事は見つかりませんでした。"

        for article in articles:
            title = article.get("title", "No Title")
            # descriptionがない場合はcontentを使うなどの処理
            description = article.get("description", "なし")

            summary = ""
            for s in article.get('summary'):
                summary += s.get('sentence', "")
            
            results.append({
                "title": title,
                "description": description,
                "summary": summary
            })
            
        return results

    except Exception as e:
        return f"ニュース取得中にエラーが発生しました: {str(e)}"
    
if __name__ == "__main__":
    print(get_news_from_apitube('japan'))