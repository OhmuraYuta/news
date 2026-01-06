import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


def scrape_news(query: str) -> str:

    print(f"DEBUG: キーワード: {query}でスクレイピング")

    url = f"https://www.sankei.com/search/"
    params = {"kw": query}
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }
    res = requests.get(url, headers=headers, params=params)
    res.encoding = res.apparent_encoding

    soup = BeautifulSoup(res.text, "html.parser")

    print(res.text)

    news_list = soup.select("article.storycard")

    print(len(news_list))

    result = [
        {"title": news.select_one("a"), "url": news.select_one("a").get("href")}
        for news in news_list
    ]

    print(result)


def scrape_with_playwright(query: str) -> str:
    """産経新聞のサイトから指定したキーワードで記事のタイトルとURLを取得します。

    Playwrightを使用してブラウザを操作し、検索結果ページから記事情報を抽出します。
    パフォーマンス向上のため、画像やスタイルシートなどの不要なリソースの読み込みは
    ブロックされます。

    Args:
    query: 検索に使用するキーワード。

    Returns:
    取得した記事情報のリスト、またはエラーメッセージ。
    成功した場合、各要素が 'title'（記事題名）と 'url'（記事リンク）を
    持つ辞書のリストを返します。
    例:
    [{'title': 'ニュースのタイトル', 'url': 'https://sankei.com/...'}]

    検索結果の要素が見つからない場合は "取得に失敗しました" という文字列を返します。

    Raises:
    Playwright関連のエラー: ブラウザの接続やページの遷移中に修復不可能な
    エラーが発生した場合に送出されます。
    """

    print(f"DEBUG: キーワード: {query}でスクレイピング")

    with sync_playwright() as p:
        browser = p.chromium.connect("ws://playwright:3001/")
        page = browser.new_page()

        def block_aggressively(route):
            if route.request.resource_type in ["image", "media", "font", "stylesheet"]:
                route.abort()
            elif (
                "google-analytics" in route.request.url
                or "doubleclick" in route.request.url
            ):
                route.abort()  # 広告や解析もブロック
            else:
                route.continue_()

        page.route("**/*", block_aggressively)

        url = f"https://www.sankei.com/search/?kw={query}"
        page.goto(url, wait_until="domcontentloaded", timeout=600000)

        try:
            page.wait_for_selector(".sk-searchresults", timeout=10000)
        except:
            browser.close()
            return "取得に失敗しました"

        content = page.content()
        soup = BeautifulSoup(content, "html.parser")

        article_li = soup.select(".sk-searchresults li")

        results = [
            {
                "title": article.select_one("a").text,
                "url": "https://sankei.com" + article.select_one("a").get("href"),
            }
            for article in article_li
        ]

        return results


if __name__ == "__main__":
    print(scrape_with_playwright("AI"))
