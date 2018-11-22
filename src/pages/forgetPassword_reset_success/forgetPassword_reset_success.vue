<template>
    <div id="app">
        <mzheader :link="headerLink"></mzheader>
        <h1 class="title">{{useLang.title}}</h1>
        <mzprogress :steps="useStep" :actived="3"></mzprogress>
        <div class="content content-form">
            <div class="section">
                <div class="success-container">
                    <img src="./assets/success.png" alt="">
                    <p class="success-title">{{useLang.successTitle}}</p>
                    <p class="success-text">{{count+" "+text}}</p>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="next"></btn>
            </div>
        </div>
        <mzfooter :now-lang="nowLang" :lang-menu-item="langMenuItem" @translate="translate"></mzfooter>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import mzprogress from '../../components/progress/progress.vue';
import btn from '../../components/button/button.vue';
import Axios from 'axios';
import mzfooter from '../../components/footer/footer.vue';
import { getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_reset_success, forgetPwdStep } from '../../assets/lang.js';

export default {
  name: 'app',
  components: {
    mzheader,
    mzprogress,
    btn,
    mzfooter
  },
  mixins:[globalMethods],
  data() {
    return {
      languageObject: forgetPwd_reset_success,
      steps: forgetPwdStep,
      account: '',
      count: 5,
      backUrl: '',
    }
  },
  methods: {
    next() {
        this.goLogin()
    },
    goLogin() {
        location.href = decodeURIComponent(this.backUrl) || 'https://i.flyme.cn';
    },
  },
  mounted() {
      this.account = getParams('account');
      this.lang = getParams('lang') || 'zh_CN';
      this.backUrl = getParams('backUrl') || 'https://i.flyme.cn';
      let counter = setInterval(() => {
          this.count--;
          if (this.count <= 0) {
              clearInterval(counter);
              this.goLogin();
          }
      }, 1000)
  }
}
</script>
   
<style lang="scss">
     @import '../../assets/base.scss';
    .content-form {
        .section {
            width: 100%;
            text-align: center;
            margin: 0 auto;
            margin-bottom: 20px;
            .success-container {
                text-align: center;
                img {
                    width: 337px;
                }
                .success-title {
                    font-family: MicrosoftYaHei;
                    font-size: 20px;
                    color: #000000;
                    margin-top: 21px;
                    margin-bottom: 6px;
                    letter-spacing: 0;
                }
                .success-text {
                    opacity: 0.4;
                    font-family: MicrosoftYaHei;
                    font-size: 14px;
                    color: #000000;
                    letter-spacing: 0;
                }
            }
        }
    }
</style>
