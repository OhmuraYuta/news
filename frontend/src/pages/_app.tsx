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
import Head from 'next/head'
import Loading from '@/news/components/Loading'

// ログインしていなくてもアクセスできるパスのリスト
const publicPaths = ['/auth/login', '/auth/callback'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  const isPublicPath = publicPaths.includes(router.pathname);

  
  useEffect(() => {
    setIsMounted(true);

    if (!isPublicPath && !hasToken()) {
      // ログインページへリダイレクト
      router.push('/auth/login');
    }
    
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
    
  }, [router.pathname])
  
  if (!isMounted || (!isPublicPath && !hasToken())) {
    return (
      <div className="w-screen h-screen content-center text-center">
        <div className="w-fit mx-auto mb-5">
          <Loading />
        </div>
        <p>リダイレクト中</p>
      </div>
    );
  }
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
