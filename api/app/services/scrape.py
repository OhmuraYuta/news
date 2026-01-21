import requests
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
from pydantic import BaseModel, HttpUrl
from typing import List

class Result(BaseModel):
    title: str
    url: HttpUrl

class Results(BaseModel):
    results: List[Result]


def scrape_news(url: str) -> str:
    """指定された産経新聞のURLからニュース記事の本文テキストを抽出します。

    scrape_with_playwright関数で得られたurlを引数として、興味深いtitleの
    ニュースの本文を取得します。

    Args:
        url: 記事を取得したいウェブページのURL。
        例: https://sankei.com/article/20260106-FBLZCTMAKVJYHMXCNG6VMXUCXI/

    Returns:
        抽出された記事本文の文字列。

    Raises:
        requests.exceptions.RequestException: ページの取得中にネットワークエラーや
            HTTPエラーが発生した場合に送出されます。
        AttributeError: 指定されたセレクタ（.article-body）がページ内に見つからず、
            テキストの抽出に失敗した場合に送出されます。
    """

    print(f"DEBUG: URL: {url}でスクレイピング")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }
    res = requests.get(url, headers=headers)
    res.encoding = res.apparent_encoding

    soup = BeautifulSoup(res.text, "html.parser")

    result = soup.select_one(".article-body").text

    print(f"DEBUG: 本文: {result}")

    return result

async def scrape_with_playwright(query: str) -> str | Results:
    """産経新聞のサイトから指定したキーワードで記事のタイトルとURLを取得します。

    Playwrightを使用してブラウザを操作し、検索結果ページから記事情報を抽出します。
    パフォーマンス向上のため、画像やスタイルシートなどの不要なリソースの読み込みは
    ブロックされます。

    Args:
        query: 検索に使用するキーワード。
        キーワードが多すぎると検索結果が出ないので気をつけてください。

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

    async with async_playwright() as p:
        browser = await p.chromium.connect("ws://playwright:3001/")
        page = await browser.new_page()

        async def block_aggressively(route):
            if route.request.resource_type in ["image", "media", "font", "stylesheet"]:
                await route.abort()
            elif (
                "google-analytics" in route.request.url
                or "doubleclick" in route.request.url
            ):
                await route.abort()  # 広告や解析もブロック
            else:
                await route.continue_()

        await page.route("**/*", block_aggressively)

        url = f"https://www.sankei.com/search/?kw={query}"
        await page.goto(url, wait_until="domcontentloaded", timeout=600000)

        print("DEBUG: goto done")

        try:
            await page.wait_for_selector(".sk-searchresults", timeout=60000, state="attached")
        except Exception as e:
            await browser.close()
            print(f"ERROR: {e}")
            return "取得に失敗しました"

        content = await page.content()
        soup = BeautifulSoup(content, "html.parser")

        article_li = soup.select(".sk-searchresults li")

        results = [
            {
                "title": article.select_one("a").text,
                "url": "https://sankei.com" + article.select_one("a").get("href"),
            }
            for article in article_li
        ]

        print(f"DEBUG: {results}")

        return results
    


if __name__ == "__main__":
    print(scrape_news('https://sankei.com/article/20260106-FBLZCTMAKVJYHMXCNG6VMXUCXI/'))
    # scrape_with_playwright('アメリカ')
