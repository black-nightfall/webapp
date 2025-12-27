import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation();

    const languages = [
        { code: 'zh-CN', name: t('language.zh-CN') },
        { code: 'en-US', name: t('language.en-US') },
    ];

    const currentLanguage = i18n.language;

    const handleLanguageChange = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
    };

    return (
        <div className="language-switcher">
            <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="language-select"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSwitcher;
