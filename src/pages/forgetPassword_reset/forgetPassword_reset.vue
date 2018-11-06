<template>
    <div id="app">
        <mzheader :link="headerLink"></mzheader>
        <h1 class="title">{{useLang.title}}</h1>
        <mzprogress :steps="useStep" :actived="3"></mzprogress>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.resetHolder" :type="'password'" :label="useLang.resetLabel" v-model="resetPwd" @finished="handleBlur(resetPwd, 'reset')" ref="reset" @changeinp="handleChange"></mzinput>
                </div>
                <a class="link"></a>
            </div>
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.repeatHolder" :type="'password'" :label="useLang.repeatLabel" v-model="varResetPwd" @finished="handleBlur(varResetPwd, 'repeat')" ref="repeat" @changeinp="handleChange"></mzinput>
                </div>
                <a class="link"></a>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="next"></btn>
            </div>
        </div>
        <div class="mask" v-show="showModal" @click="closeModal">
        </div>
        <mz-modal :title="useLang.modalTitle" v-show="showModal" @close="closeModal">
            <div class="modal-main" >
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <btn :type="'blue'" :text="useLang.modalBtn" @clicked="closeModal"></btn>
                    </div>
                </div>
            </div>
        </mz-modal>
        <mzfooter :now-lang="nowLang" :lang-menu-item="langMenuItem" @translate="translate"></mzfooter>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import mzprogress from '../../components/progress/progress.vue';
import btn from '../../components/button/button.vue';
import mzinput from '../../components/input/input.vue';
import mzModal from '../../components/mzModal/mzModal.vue';
import Axios from 'axios';
import inputVue from '../../components/input/input.vue';
import { getData, getParams } from '../../assets/utils.js';
import mzfooter from '../../components/footer/footer.vue';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_reset, forgetPwdStep } from '../../assets/lang.js'; 

export default {
  name: 'app',
  components: {
    mzheader,
    mzprogress,
    btn,
    mzinput,
    mzModal,
    mzfooter
  },
  mixins:[globalMethods],
  data() {
    return {
      message:"",
      showModal: false,
      resetPwd: '',
      varResetPwd: '',
      account: '',
      resetInpType: 'password',
      repeatInpType: 'password',
      tokenKey: '',
      wrong: false,
      hasSubmit: false,
      languageObject: forgetPwd_reset,
      steps: forgetPwdStep,
    }
  },
  methods: {
    next() {
        if (this.hasSubmit) { // 防止重复提交
            return;
        }

        if (this.wrong) {
            return;
        }

        if (this.resetPwd === "" || this.resetPwd.length > 16 || this.resetPwd.length < 8) {
            this.$refs.reset.showInputTips('密码应为8~16个字符，区分大小写,至少包含两种类型');
            this.wrong = true;
            return;
        }

        if (this.varResetPwd === "" || this.varResetPwd.length > 16 || this.varResetPwd.length < 8) {
            this.$refs.repeat.showInputTips('请重新输入密码');
            this.wrong = true;
            return;
        }

        if (this.resetPwd !== this.varResetPwd) {
            this.message = "两次输入的密码不一致";
            this.showModal = true;
            return;
        } 
        let kk = cryPP.generateMix();
        let resetPwd = cryPP.excutePP(this.resetPwd, kk);
        let repeatPwd = cryPP.excutePP(this.varResetPwd, kk);
        this.hasSubmit = true;
        Axios.post('/uc/system/webjsp/forgetpwd/resetPwd', {
            account: this.account,
            form_resubmit_token_key: this.tokenKey,
            resetPassword: resetPwd,
            repeatPassword: repeatPwd,
        },{
            headers: {
                'CryKK-Mix': kk,
            }
        }).then((res) => {
            const result = getData(res.data);
            if (result == null) {
                this.message = res.data.message;
                this.showModal = true;
                return Axios.post('/security/resubmit/token/get');
            } else {
                location.href = res.data.value.url;
            }
        }).then((res) => {
            this.hasSubmit = false;
            this.tokenKey = res.data.value;
        })
    },
    handleBlur(pwd, target) {
        if (pwd === "" || pwd.length > 16 || pwd.length < 8) {
            this.$refs[target].showInputTips('密码应为8~16个字符，区分大小写,至少包含两种类型');
            this.wrong = true;
        }
    },
    closeModal() {
        this.showModal = false;
        this.message = "";
    },
    handleChange() {
        if (this.wrong) {
            this.wrong = false;
        } else {
            return
        }
    },
  },
  mounted() {
      this.account = getParams('account');
      this.lang = getParams('lang') || 'zh_CN';
      Axios.post('/security/resubmit/token/get').then((res) => {
          this.tokenKey = res.data.value;
      }).catch((err) => {
          this.showModal = true;
          this.message = "网络错误"
      })
  }
}
</script>

<style lang="scss">
@import '../../assets/base.scss';
    .content-form {
        .section {
            .bar-input {
                width: 433px;
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
</style>
