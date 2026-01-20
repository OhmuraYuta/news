import '@charcoal-ui/icons'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { isLanguageSupported } from '@/features/constants/settings'
import homeStore from '@/features/stores/home'
import settingsStore from '@/features/stores/settings'
import '@/styles/globals.css'
import '@/styles/themes.css'
import migrateStore from '@/utils/migrateStore'
import i18n from '../lib/i18n'

import { useRouter } from 'next/router'
import { hasToken } from '@/news/utils/auth'

// ログインしていなくてもアクセスできるパスのリスト
const publicPaths = ['/auth/login', '/auth/callback'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const hs = homeStore.getState()
    const ss = settingsStore.getState()

    if (hs.userOnboarded) {
      i18n.changeLanguage(ss.selectLanguage)
      // 保存されたテーマを適用
      document.documentElement.setAttribute('data-theme', ss.colorTheme)
      return
    }

    migrateStore()

    const browserLanguage = navigator.language
    const languageCode = browserLanguage.match(/^zh/i)
      ? 'zh'
      : browserLanguage.split('-')[0].toLowerCase()

    let language = ss.selectLanguage
    if (!language) {
      language = isLanguageSupported(languageCode) ? languageCode : 'ja'
    }
    i18n.changeLanguage(language)
    settingsStore.setState({ selectLanguage: language })

    // 初期テーマを適用
    document.documentElement.setAttribute('data-theme', ss.colorTheme)

    homeStore.setState({ userOnboarded: true })

    const isPublicPath = publicPaths.includes(router.pathname);
    if (!isPublicPath && !hasToken()) {
      // ログインページへリダイレクト
      router.push('/auth/login');
    }

  }, [router.pathname])

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
