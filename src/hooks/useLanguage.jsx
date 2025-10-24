import { createContext, useContext, useState, useEffect } from 'react';
import { locales, colorPickerLocales } from '../constants/locales.js';

// 创建语言上下文
const LanguageContext = createContext();

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  // 从localStorage获取保存的语言设置，默认为中文
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('folder-generator-language');
    return savedLanguage || 'zh';
  });

  // 当语言改变时保存到localStorage
  useEffect(() => {
    localStorage.setItem('folder-generator-language', language);
    // 更新HTML lang属性
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    // 更新页面标题
    document.title = locales[language].title;
  }, [language]);

  // 切换语言函数
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // 设置特定语言
  const setLanguageCode = (code) => {
    if (locales[code]) {
      setLanguage(code);
    }
  };

  // 获取翻译文本的函数
  const t = (key, defaultValue = '') => {
    const keys = key.split('.');
    let value = locales[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return value || defaultValue || key;
  };

  // 获取颜色选择器的翻译
  const getColorPickerLocale = () => {
    return colorPickerLocales[language] || colorPickerLocales.zh;
  };

  const value = {
    language,
    setLanguage: setLanguageCode,
    toggleLanguage,
    t,
    getColorPickerLocale,
    isZh: language === 'zh',
    isEn: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default useLanguage;