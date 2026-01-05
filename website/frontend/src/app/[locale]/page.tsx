"use client"

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CatContainer } from '@/components/ui/cat-container';
import { motion } from 'framer-motion';

export default function Home() {
  const t = useTranslations('HomePage');
  // Translation keys needed for ears: we can just hardcode or add to json.
  // Using direct text for now based on "News" and "Forum".

  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-8 bg-background overflow-hidden relative">

      {/* 
        Language Switch at Top of Page 
        Positioned absolute top right or center top
      */}
      <div className="absolute top-6 right-6 flex gap-4 z-50">
        <Link href="/" locale="en" className="text-sm font-bold hover:underline bg-white/50 px-3 py-1 rounded-full border-2 border-black">
          EN
        </Link>
        <Link href="/" locale="zh" className="text-sm font-bold hover:underline bg-white/50 px-3 py-1 rounded-full border-2 border-black">
          中文
        </Link>
      </div>

      <CatContainer
        className="max-w-xl w-full mx-4 mt-16"
        leftEar={
          <Link href="/news" className="w-full h-full flex flex-col items-center justify-center hover:text-yellow-200 transition-colors leading-tight">
            <span className="text-xl font-black">NEWS</span>
            <span className="text-sm font-bold">资讯</span>
          </Link>
        }
        rightEar={
          <Link href="/forum" className="w-full h-full flex flex-col items-center justify-center hover:text-pink-200 transition-colors leading-tight">
            <span className="text-xl font-black">FORUM</span>
            <span className="text-sm font-bold">社区</span>
          </Link>
        }
      >
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl font-medium">{t('description')}</p>

        <div className="flex gap-4 mt-8 justify-center">
          <Link href="/login" className="px-6 py-2 bg-white border-4 border-black shadow-hard rounded-xl font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2 bg-[#fdba74] border-4 border-black shadow-hard rounded-xl font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            Register
          </Link>
        </div>

        <div className="mt-8 text-sm text-muted-foreground animate-pulse">
          👆 Click the ears to explore! 👆
        </div>

      </CatContainer>
    </div>
  );
}
