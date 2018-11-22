const globalMethods = {
    data() {
        return {lang: 'zh_CN',}
    },
    computed: {
        useLang() {
            if (this.lang === 'zh_CN') {
                return this.languageObject.CH;
            } else {
                return this.languageObject.EN;
            }
        },
        useModal() {
            if (!this.modalLangObject) {
                return null;
            }
            if (this.lang === 'zh_CN') {
                return this.modalLangObject.CH;
            } else {
                return this.modalLangObject.EN;
            }
        },
        useInput() {
            if (!this.inputLangObject) {
                return null;
            }
            if (this.lang === 'zh_CN') {
                return this.inputLangObject.CH;
            } else {
                return this.inputLangObject.EN;
            }
        },
        useStep() {
            if (this.lang === 'zh_CN') {
                return this.steps.CH;
            } else {
                return this.steps.EN;
            }
        },
        headerLink() {
            if (this.lang === 'zh_CN') {
                return 'https://www.meizu.com/';
            } else {
                return 'https://www.meizu.com/en';
            }
        },
        nowLang() {
            if (this.lang === 'zh_CN') {
                return '简体中文';
            } else {
                return 'English';
            }
        },
        langMenuItem() {
            if (this.lang === 'zh_CN') {
                return 'English';
            } else {
                return '简体中文';
            }
        }
    },
    methods: {
        translate() {
            const reg = /lang=([^&\s]+)/;
            if (!reg.test(decodeURIComponent(location.href))) {
                if (this.lang === 'zh_CN') {
                    location.href = 'https://i.in.flyme.cn/forgetpwd?lang=en_US';
                    return;
                } else {
                    location.href = 'https://i.flyme.cn/forgetpwd?lang=zh_CN';
                    return;
                }
            } else {
                if (this.lang === 'zh_CN') {
                    location.href = decodeURIComponent(location.href).replace(reg, 'lang=en_US');
                    return;
                } else {
                    location.href = decodeURIComponent(location.href).replace(reg, 'lang=zh_CN');
                    return;
                }
            }
            
        }
    }
}

export default globalMethods