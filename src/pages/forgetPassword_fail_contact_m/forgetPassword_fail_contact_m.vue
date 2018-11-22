<template>
    <div id="app">
        <div class="steps-warp">
            <mzprogress :steps="useStep" :actived="2" size="48" line-length="128"></mzprogress>
        </div>
        <h1 class="title"></h1>
        <div class="content content-form">
            <div class="section">
                <div class="fail-container">
                    <img src="./assets/fail.png" alt="">
                    <p class="fail-title">{{useLang.failTitle}}</p>
                    <p class="fail-text">{{useLang.failText}}</p>
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
import { forgetPwd_fail_contact, forgetPwdStep } from '../../assets/lang.js';

export default {
  name: 'app',
  components: {
    mzprogress,
    btn,
  },
  mixins:[globalMethods],
  data() {
    return {
      languageObject: forgetPwd_fail_contact,
      steps: forgetPwdStep,
      account: ''
    }
  },
  methods: {
    next() {
        console.log('complaint');
        location.href = 'https://i.flyme.cn/appeal';
    },
  },
  mounted() {
      this.account = getParams('account');
      this.lang = getParams('lang') || 'zh_CN';
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
            .fail-container {
                text-align: center;
                img {
                    width: 70%;
                }
                .fail-title {
                    font-family: MicrosoftYaHei;
                    font-size: 18px;
                    color: #000000;
                    margin-top: 21px;
                    margin-bottom: 6px;
                    letter-spacing: 0;
                }
                .fail-text {
                    opacity: 0.4;
                    font-family: MicrosoftYaHei;
                    font-size: 12px;
                    color: #000000;
                    letter-spacing: 0;
                    padding: 0 px2vw(48);
                }
            }
        }
    }
    .btn-next {
        margin-top: px2vw(322);
    }
</style>
