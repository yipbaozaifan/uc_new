<template>
    <div id="app">
        <div class="steps-warp">
            <mzprogress :steps="useStep" :actived="3" size="48" line-length="128"></mzprogress>
        </div>
        <h1 class="title"></h1>
        <div class="content content-form">
            <div class="section">
                <div class="success-container">
                    <img src="./assets/success.png" alt="">
                    <p class="success-title">{{useLang.successTitle}}</p>
                    <p class="success-text">{{count+" "+useLang.text}}</p>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="next"></btn>
            </div>
        </div>
    </div>
</template>

<script>
import mzprogress from '../../components/progress/progress_m.vue';
import btn from '../../components/button/button_m.vue';
import Axios from 'axios';
import { getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_reset_success, forgetPwdStep } from '../../assets/lang.js';

export default {
  name: 'app',
  components: {
    mzprogress,
    btn,
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
        location.href = decodeURIComponent(this.backUrl) || location.origin;
    },
  },
  mounted() {
      this.account = getParams('account');
      this.lang = getParams('lang') || this.getCookie('lang') || 'zh_CN';
      if (!(this.lang == 'zh_CN')) {
          document.title = 'Retrieve password'
      }
      this.backUrl = getParams('backUrl') || location.origin;
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
     @import '../../assets/base_m.scss';
    .content-form {
        .section {
            width: 100%;
            text-align: center;
            margin: 0 auto;
            margin-bottom: 20px;
            .success-container {
                text-align: center;
                img {
                    width: 70%;
                }
                .success-title {
                    font-size: 18px;
                    color: #000000;
                    margin-top: 21px;
                    margin-bottom: 6px;
                    letter-spacing: 0;
                }
                .success-text {
                    opacity: 0.4;
                    font-size: 12px;
                    color: #000000;
                    letter-spacing: 0;
                }
            }
        }
    }
    .btn-next {
        margin-top: px2vw(322);
    }
</style>
