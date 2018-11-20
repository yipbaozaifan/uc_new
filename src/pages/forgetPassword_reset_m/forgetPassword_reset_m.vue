<template>
    <div id="app">
        <div class="steps-warp">
            <mzprogress :steps="useStep" :actived="3" size="48" line-length="128"></mzprogress>
        </div>
        <h1 class="title">{{useLang.title}}</h1>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.resetHolder" :type="'password'" :label="useLang.resetLabel" v-model="resetPwd" @finished="handleBlur(resetPwd, 'reset')" ref="reset" @changeinp="handleChange"></mzinput>
                </div>
            </div>
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.repeatHolder" :type="'password'" :label="useLang.repeatLabel" v-model="varResetPwd" @finished="handleBlur(varResetPwd, 'repeat')" ref="repeat" @changeinp="handleChange"></mzinput>
                </div>
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
            <div class="modal-main" v-show="!overTime">
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <a @click="closeModal">{{useLang.modalBtn}}</a>
                    </div>
                </div>
            </div>
            <div class="modal-main" v-show="overTime">
                <p class="modal-tips modal-tips-ot">此页面已失效</p>
            </div>
        </mz-modal>
        <mzfooter :now-lang="nowLang" :lang-menu-item="langMenuItem" @translate="translate"></mzfooter>
    </div>
</template>

<script>
import mzprogress from '../../components/progress/progress_m.vue';
import btn from '../../components/button/button_m.vue';
import mzinput from '../../components/input/input_m.vue';
import mzModal from '../../components/mzModal/mzModal_m.vue';
import Axios from 'axios';
import { getData, getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_reset, forgetPwdStep } from '../../assets/lang.js'; 

export default {
  name: 'app',
  components: {
    mzprogress,
    btn,
    mzinput,
    mzModal,
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
      overTime: false,
    }
  },
  methods: {
    next() {
        const reg = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-])|(?=.*?[A-Za-z])(?=.*?[!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-]))[\dA-Za-z!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-]+$/;
        if (this.hasSubmit) { // 防止重复提交
            return;
        }

        if (this.wrong) {
            return;
        }
        if (this.resetPwd == this.account) {
            this.$refs.reset.showInputTips('密码不能与账号相同');
            this.wrong = true;
            return;
        }
        if (this.resetPwd === "" || this.resetPwd.length > 16 || this.resetPwd.length < 8) {
            this.$refs.reset.showInputTips('密码应为8~16个字符，区分大小写');
        }
        if (!reg.test(this.resetPwd)) {
            this.$refs.reset.showInputTips('密码至少包含数字、字母和符号两种类型');
            this.wrong = true;
            return;
        }

        if (this.varResetPwd === "") {
            this.$refs.repeat.showInputTips('请重新输入密码');
            this.wrong = true;
            return;
        }

        if (this.resetPwd !== this.varResetPwd) {
            this.$refs.repeat.showInputTips('两次输入密码不一致');
            this.wrong = true;
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
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = 'https://i.flyme.cn/forgetpwd';
                }, 2000);
                return;
            }
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
        if(!res.data) {
            this.showModal = true;
            this.overTime = true;
            setTimeout(() => {
                location.href = 'https://i.flyme.cn/forgetpwd';
            }, 2000);
            return;
        }
        this.tokenKey = res.data.value;
      }).catch((err) => {
          this.showModal = true;
          this.message = "网络错误"
      })
  }
}
</script>

<style lang="scss">
@import '../../assets/base_m.scss';
    .content-form {
        .section {
            .bar-input {
                width: 100%;
                display: inline-block;
                vertical-align: middle;
                height: px2vw(156);
                padding: 0 px2vw(48);
                padding-top: px2vw(72);
                box-sizing: border-box;
            }
        }
    }
    .btn-next {
        margin-top: px2vw(548);
    }
</style>
