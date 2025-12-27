import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

// 定义资源
const resources = {
    'zh-CN': {
        translation: zhCN,
    },
    'en-US': {
        translation: enUS,
    },
};

i18n
    .use(LanguageDetector) // 自动检测用户语言
    .use(initReactI18next) // 绑定 react-i18next
    .init({
        resources,
        fallbackLng: 'zh-CN', // 默认语言
        lng: localStorage.getItem('language') || 'zh-CN', // 从 localStorage 读取语言设置
        debug: false,

        interpolation: {
            escapeValue: false, // React 已经做了 XSS 防护
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

// 监听语言变化，同步到 localStorage
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;
