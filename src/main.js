import { createApp } from 'vue'
import App from '@/App.vue'
import 'virtual:windi.css'
import 'virtual:windi-devtools'
// 引入全局样式
import './assets/css/global.css'

const app = createApp(App);

// i18n
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages';

// find the locale from the browser
const findPrimaryLanguage = () => {
    const languages = navigator.languages || [navigator.language]
    const locales = Object.keys(messages)
    for (const language of languages) {
        for (const locale of locales) {
            if (language.toLowerCase().startsWith(locale)) {
                return locale
            }
        }
    }
    return 'en'
}

// 尝试从 localstorage或navigator.language中获取语言
const lang = localStorage.getItem('lang') || findPrimaryLanguage();

const i18n = createI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages,
    legacy: false,
});

app.use(i18n);

app.mount('#app');
