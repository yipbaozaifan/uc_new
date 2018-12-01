<template>
    <div class="footer">
        <div class="footer-inner">
            <div class="footer-main">
                <div class="footer-inner-link">
                    <a href="http://www.meizu.com/about.html" target="_blank" title="关于魅族" v-show="nowLang === '简体中文'">关于魅族</a>
                    <a href="https://www.meizu.com/en/about.html" target="_blank" title="about us" v-show="nowLang === 'English'">About us</a>
				    <img class="foot-line" src="https://uc-res.mzres.com/resources/common/images/default/space.gif">
                    <a href="http://hr.meizu.com" target="_blank" title="工作机会" v-show="nowLang === '简体中文'">工作机会</a>
                    <img class="foot-line" src="https://uc-res.mzres.com/resources/common/images/default/space.gif" v-show="nowLang === '简体中文'">    
                    <a href="http://www.meizu.com/contact.html" target="_blank" title="联系我们" v-show="nowLang === '简体中文'">联系我们</a>
                    <a title="Contact us" target="_blank" href="https://www.meizu.com/en/contact.html " v-show="nowLang === 'English'">Contact us</a>
                    <img class="foot-line" src="https://uc-res.mzres.com/resources/common/images/default/space.gif">
                    <a href="http://www.meizu.com/legalStatement.html" target="_blank" title="法律声明" v-show="nowLang === '简体中文'">法律声明</a>
                    <a title="Legal Statment" target="_blank" href="https://www.meizu.com/en/legal.html" v-show="nowLang === 'English'">Legal Statement</a>
                    <img class="foot-line" src="https://uc-res.mzres.com/resources/common/images/default/space.gif">
                    <a href="https://uc-res.mzres.com/resources/uc/wlogin/faq/html/index.html" target="_blank" title="常见问题" v-show="nowLang === '简体中文'">常见问题</a>
                    <img class="foot-line" src="https://uc-res.mzres.com/resources/common/images/default/space.gif" v-show="nowLang === '简体中文'">
                    <div href="javascript:void(0);" id="globalName" class="footer-language" title="简体中文" @mouseover="showLangMenu" @mouseout="hideLangMenu">
                        {{nowLang}}&nbsp;&nbsp;&nbsp;
                        <div id="globalContainer" class="footer-language_menu" v-show="langShow">
                            <a href="javascript:void(0)" id="i18n-link" class="ClobalItem" @click="exchangeLang">{{langMenuItem}}</a>
                        </div>
                    </div>
                </div>
                <div class="footer-inner-service" v-show="nowLang === '简体中文'">
                    <span class="service-label">客服热线</span>
                    <span class="service-num">400-788-3333</span>
                    <a id='service-online' class='service-online' title="在线客服" @click="openOnline">在线客服</a>
                </div>
                <div class="mz_footer-service" v-show="nowLang === 'English'">
                    <a href="mailto:mzcs@meizu.com">
                    <span class="mz_service-label">Customer Service: mzcs@meizu.com</span>
                    </a>    
                </div>
                <div class='footer-outerLink' v-show="nowLang === '简体中文'">
                    <div class="wechat-qrcode" v-show="show"></div>
                    <a class='footer-sinaMblog' href="http://weibo.com/meizumobile" target="_blank"><i class='icon'></i></a>
                    <a id='footer-weChat' class='footer-weChat' target="_blank" @mouseover="showQrcode" @mouseout="hideQrcode"><i class='icon'></i></a>
                    <a class='footer-qzone' href="http://user.qzone.qq.com/2762957059" target="_blank"><i class='icon'></i></a>
                </div>
                <div class="mz_footer-outerLink" v-show="nowLang === 'English'">
                    <a class="mz_footer-facebook" href="https://www.facebook.com/MeizuIndiaOfficial" target="_blank"><i class="mz_i_icon"></i></a>
                    <a class="mz_footer-twitter" href="https://twitter.com/Meizu_India" target="_blank"><i class="mz_i_icon"></i></a>
                    <a class="mz_footer-googleplus" href="https://plus.google.com/u/0/b/113858313108002162708/113858313108002162708/posts " target="_blank"><i class="mz_i_icon"></i></a>
                    <a class="mz_footer-linkin" href="https://www.linkedin.com/company/meizu" target="_blank"><i class="mz_i_icon"></i></a>        
                </div>
            </div>
            <div class="clear"></div>
            <div class="footer-copyright">
                <div class="copyrightInner">
                    <span>©{{new Date().getFullYear()}} Meizu Telecom Equipment Co., Ltd. All rights reserved.</span>
                    <a href="http://www.miitbeian.gov.cn/" class='linkAGray' target="_blank" v-show="nowLang === '简体中文'">备案号: 粤ICP备13003602号-4</a>
                    <a href="http://www3.res.meizu.com/static/cn/widget/footer/images/icp2_b2dcb54.jpg" class='linkAGray' target="_blank" v-show="nowLang === '简体中文'">经营许可证编号: 粤B2-20130198</a>
                    <a target="_blank" href="http://www2.res.meizu.com/zh_cn/images/common/com_licence.jpg" hidefocus="true" class="linkAGray" v-show="nowLang === '简体中文'">营业执照</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        nowLang: {
            type: String,
            default: 'English'
        },
        langMenuItem: {
            type: String,
            default: 'English'
        }
    },
    data() {
        return {
            show: false,
            langShow: false,
        }
    },
    methods: {
        showQrcode() {
            this.show = true;
        },
        hideQrcode() {
            this.show = false;
        },
        openOnline() {
            window.open('http://url.meizu.com/ols_Fyun',
    			'_blank','height=575,width=1150,fullscreen=3,top=200,left=200,status=yes,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,titlebar=no,fullscreen=no');
        },
        showLangMenu() {
            this.langShow = true;
        },
        hideLangMenu() {
            this.langShow = false;
        },
        exchangeLang() {
            this.$emit('translate');
        }
    }
}
</script>

<style lang="scss">
.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 130px;
    border-top: solid 1px #E5E6E7;
    background-color: #fff;
    color: black;
    .footer-inner {
        width: 1000px;
        margin: 24px auto 30px;
        .footer-main {
            height: 50px;
            line-height: 50px;
            a {
                color: #515151;
                text-decoration: none;
                font-size: 14px;
                &:link {
                    color: black;
                }
            }
            .footer-inner-link {
                float: left;
                font-size: 14px;
                .foot-line {
                    background-color: #888;
                    margin: 0px 5px;
                    width: 1px;
                    height: 10px;
                }
                .footer-language {
                    display: inline;
                    position: relative;
                    overflow: hidden;
                    cursor: default;
                    background: url(https://uc-res.mzres.com/resources/uc/web/base/images/base.png) -80px -150px no-repeat;
                    .footer-language_menu {
                        -moz-box-shadow: 0px 0px 10px #E1E4E8;
                        -webkit-box-shadow: 0px 0px 10px #E1E4E8;
                        box-shadow: 0px 0px 10px #E1E4E8;
                        -moz-border-radius: 2px;
                        -webkit-border-radius: 2px;
                        -webkit-border-radius: 2px;
                        border-radius: 2px;
                        background-color: #FEFEFE;
                        position: absolute;
                        border: solid 1px #E1E4E8;
                        overflow: hidden;
                        left: -8px !important;
                        bottom: 16px;
                        width: 77px;
                        /* height: 80px; */
                        a {
                            display: block;
                            height: 40px;   
                            line-height: 40px;
                            margin: 0px auto;
                            text-decoration: none;
                            border-bottom: solid 1px #E4E7E9;
                            font-size: 14px;
                            color: #000000;
                            text-align: left;
                            padding-left: 10px;
                            outline: none;
                        }
                    }
                }
            }
            .footer-inner-service {
                float: left;
                margin-left: 36px;
                font-size: 14px;
                .service-label {
                    margin-right: 10px;
                }
                .service-num {
                    margin-right: 20px;
                }
                .service-online {
                    display: inline-block;
                    height: 20px;
                    line-height: 18px;
                    width: 64px;
                    color: white;
                    background-color: #32a5e7;
                    border-radius: 2px;
                    -webkit-border-radius: 2px;
                    -moz-border-radius: 2px;
                    text-align: center;
                    cursor: pointer;
                }
            }
            .mz_footer-service {
                float: left;
                margin-left: 36px;
            }
            .footer-outerLink {
                position: relative;
                float: right;
                padding-top: 9px;
                a {
                    cursor: pointer;
                    margin-left: 10px;
                    display: inline-block;
                    overflow: hidden;
                    width: 32px;
                    height: 32px;
                }
                .footer-sinaMblog {
                    i {
                        background-position: -218px -91px;
                        display: inline-block;
                    }
                    &:hover {
                        i {
                            background-position: -218px -137px;
                        }
                    }
                }
                .footer-weChat {
                    i {
                        background-position: -302px -91px;
                        display: inline-block;
                    }
                    &:hover {
                        i {
                            background-position: -302px -137px;;
                        }
                    }
                }
                .footer-qzone {
                    i {
                        background-position: -344px -91px;
                        display: inline-block;
                    }
                    &:hover {
                        i {
                            background-position: -344px -137px;
                        }
                    }
                }
            }
            .mz_footer-outerLink {
                position: relative;
                float: right;
                padding-top: 9px;
                a {
                    margin-left: 10px;
                    display: inline-block;
                    overflow: hidden;
                    width: 32px;
                    height: 32px;
                    .mz_i_icon {
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        background: url(http://www2.res.meizu.com/en/images/common/foot_icon_1.png) no-repeat;
                    }
                    &.mz_footer-facebook {
                        i {
                            background-position: 0 0;
                            &:hover {
                                background-position: 0 -45px;
                            }
                        }
                    }
                    &.mz_footer-twitter {
                        i {
                            background-position: -42px 0;
                            &:hover {
                                background-position: -42px -45px;
                            }
                        }
                        
                    }
                    &.mz_footer-googleplus {
                        i {
                            background-position: -168px 0;
                            &:hover {
                                background-position: -168px -45px;
                            }
                        }
                    }
                    &.mz_footer-linkin {
                        i {
                             background-position: -84px 0;
                             &:hover {
                                background-position: -84px -45px;
                            }
                        }
                    }
                }
            }
        }
        .clear {
            content: "";
            clear: both;
            display: block;
            height: 0;
            overflow: hidden;
        }
        .footer-copyright {
            width: 100%;
            .copyrightInner {
                width: 1000px;
                margin: 0px auto;
                span {
                    font-size: 12px;
                    color: #7f7f7f;
                    float: left;
                }
                a {
                    white-space: nowrap;
                    float: left;
                    color: #7f7f7f;
                    margin-left: 6px;
                    font-size: 12px;
                    &.linkAGray{
                        color: #7f7f7f;
                    }
                }
            }
        }
    }
    .wechat-qrcode {
        position: absolute;
        z-index: 1000;
        width: 310px;
        height: 270px;
        left: -82px;
        top: -250px;
        background: url(https://uc-res.mzres.com/resources/uc/web/base/images/weixin.png) no-repeat;
    }
}
</style>
