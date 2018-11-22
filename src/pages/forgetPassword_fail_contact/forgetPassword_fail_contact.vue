<template>
    <div id="app">
        <mzheader :link="headerLink"></mzheader>
        <h1 class="title">{{useLang.title}}</h1>
        <mzprogress :steps="useStep" :actived="2" size="126"></mzprogress>
        <div class="content content-form">
            <div class="section">
                <div class="fail-container">
                    <img src="./assets/fail.png" alt="">
                    <p class="fail-title">{{useLang.failTitle}}</p>
                    <p class="fail-text">{{useLang.failText}}</p>
                </div>
            </div>
        </div>
        <div class="content content-btn" v-if="lang!=='en_US'">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="next"></btn>
            </div>
        </div>
        <mzfooter :now-lang="nowLang" :lang-menu-item="langMenuItem" @translate="translate" ></mzfooter>
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
import { forgetPwd_fail_contact, forgetPwdStep } from '../../assets/lang.js';

export default {
  name: 'app',
  components: {
    mzheader,
    mzprogress,
    btn,
    mzfooter,
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
    @import '../../assets/base.scss';
    .content-form {
        .section {
            width: 100%;
            text-align: center;
            margin: 0 auto;
            margin-bottom: 20px;
            .fail-container {
                text-align: center;
                img {
                    width: 337px;
                }
                .fail-title {
                    font-family: MicrosoftYaHei;
                    font-size: 20px;
                    color: #000000;
                    margin-top: 21px;
                    margin-bottom: 6px;
                    letter-spacing: 0;
                }
                .fail-text {
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
