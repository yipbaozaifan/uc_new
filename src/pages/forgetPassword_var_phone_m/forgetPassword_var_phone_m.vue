<template>
    <div id="app">
        <div class="steps-warp">
            <mzprogress :steps="useStep" :actived="2" size="58" line-length="128"></mzprogress>
        </div>
        <h1 class="title">{{useLang.title_m}}</h1>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.accountHolder" type="account" :label="useLang.accountLabel" @finished="handleBlur" v-model="inputedPhone" ref="phoneInput" @changeinp="handleChange" :maxlen="11"></mzinput>
                </div>
            </div>
            <!--<div class="section" v-show="!phoneInput">
                <div class="bar bar-tips">
                    <p class="text-tips">验证码已发送至 +{{inputedPhone}}</p>
                    <a class="change-phone" @click="handleChange">更改验证手机</a>
                </div>
            </div>-->
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.varCodeHolder" :type="'phoneCode'" :label="useLang.varCodeLabel" ref="varinput" @send="handleSend" v-model="varCode" :maxlen="6" @resend="handleResend" :get-state="useInput.getState" :resend="useInput.resend"></mzinput>
                </div>
            </div>
            <a class="link" v-if="hasEmail == 'y'" @click="changeWay">{{useLang.exchange}}</a>
            <a class="link" v-else></a>
        </div>
        
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="submit"></btn>
            </div>
            <a href="https://i.flyme.cn/appeal" class="link" target="_Blank" v-if="lang!=='en_US'">{{useLang.complaintLink}}</a>
        </div>
        <div class="mask" v-show="showModal" @click="closeModal">
        </div>
        <mz-modal :title="useModal.title" v-show="showModal" @close="closeModal">
            <div class="modal-main" v-show="!overTime">
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <a @click="closeModal">{{useModal.okBtn}}</a>
                    </div>
                </div>
            </div>
            <div class="modal-main" v-show="overTime">
                <p class="modal-tips modal-tips-ot">{{useModal.timeout}}</p>
            </div>
        </mz-modal>
    </div>
</template>

<script>
import mzprogress from '../../components/progress/progress_m.vue';
import btn from '../../components/button/button_m.vue';
import mzinput from '../../components/input/input_m.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal_m.vue';
import { getData, getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_var_phone, forgetPwdStep, modalLang, inputLang } from '../../assets/lang.js';

export default {
  name: 'app',
  components: {
    mzprogress,
    btn,
    mzinput,
    mzModal,
  },
  mixins: [globalMethods],
  data() {
    return {
      languageObject: forgetPwd_var_phone,
      steps: forgetPwdStep,
      inputedPhone: '',
      account: '',
      showModal: false,
      varCode: '',
      kapkey: '',
      canSubmit: false,
      message: '',
      wrong: false,
      toMail: '',
      hasEmail: '',
      sent: false,
      overTime: false,
      modalLangObject: modalLang,
      inputLangObject: inputLang,
    }
  },
  methods: {
    submit() {
        // 提交验证码
        let phone = '00' + this.$refs.phoneInput.countryCode.code + ':' + this.inputedPhone;
        if (this.wrong) {
            return;
        }
        if (this.inputedPhone === "") {
            this.$refs.phoneInput.showInputTips(this.useLang.phoneEmpty);
            return;
        }
        if (this.varCode === "") {
            this.$refs.varinput.showInputTips(this.useLang.CodeEmptyTips);
            return;
        }
        this.varPhone().then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = 'https://i.flyme.cn/forgetpwd?lang='+ that.lang;
                }, 2000);
                return;
            }
            if (res.data.code === "200") {
                if (!res.data.value) {
                    this.$refs.phoneInput.showInputTips('输入手机号与绑定手机号不一致');
                    this.wrong = true;
                    return Promise.reject('输入手机号与绑定手机号不一致');
                } else {
                    return axios.post('/uc/system/webjsp/forgetpwd/isValidSmsVCode', {
                        account: this.account,
                        hasEmail: this.hasEmail,
                        phone: phone,
                        vcode: this.varCode,
                        vCodeTypeValue: 9
                    })
                }
            } else {
                this.message = res.data.message;
                this.showModal = true;
                return Promise.reject('server error');
            }
        }).then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = 'https://i.flyme.cn/forgetpwd?lang='+ that.lang;
                }, 2000)
                return;
            }
            if (res.data.code !== "200") {
                if (res.data.code == "200000") {
                    this.$refs.varinput.showInputTips(res.data.message);
                } else {
                    this.message = res.data.message;
                    this.showModal = true;
                }
            } else {
                location.href = res.data.value.url;
            }
        }, (err) => {
            console.log(err);
        }).catch((err) => {
            this.message = "网络错误，请稍后再试";
            this.showModal = true;
        });
    },
    closeModal() {
        this.showModal = false;
    },
    handleBlur() {
        setTimeout(() => {
            if (this.wrong) {
                return;
            }
            if (this.inputedPhone === '') {
                return;
            }
            this.varPhone().then((res) => {
                if(!res.data) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = 'https://i.flyme.cn/forgetpwd?lang='+ that.lang;
                    }, 2000);
                    return;
                }
                if (res.data.code === "200") {
                    if (!res.data.value) {
                        this.$refs.phoneInput.showInputTips('输入手机号与绑定手机号不一致');
                        this.wrong = true;
                    } else {
                        this.$refs.varinput.allowSend();
                    }
                } else {
                    this.message = res.data.message;
                    this.showModal = true;
                }
            }, (err) => {
                console.log(err);
            })
        }, 100);
    },
    changeWay() {
        if(this.inputedPhone) {
            localStorage.setItem('cycode', this.$refs.phoneInput.countryCode.code);
            localStorage.setItem('phone', this.inputedPhone);
        }
        if (this.sent) {
            localStorage.setItem('leftSec', this.$refs.varinput.waitTime);
            localStorage.setItem('sent', this.sent);
        }
        location.href = this.toMail;
    },
    handleChange(varPhone) {
        if (this.wrong) {
            this.wrong = false;
            if (varPhone) {
                this.handleBlur()
            }
        } else {
            return
        }
    },
    varPhone() { 
        let phone = '00' + this.$refs.phoneInput.countryCode.code + ':' + this.inputedPhone;
        return axios.get(`/uc/system/webjsp/member/isMyPhone?account=${this.account}&phone=${phone}`)
    },
    handleSend() {
        // 获取验证码 需要作二次验证
        let data = {
            vCodeTypeValue: 9,
            phone: '00' + this.$refs.phoneInput.countryCode.code + ':' + this.inputedPhone,
            account: this.account
        }
        this.varPhone().then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = 'https://i.flyme.cn/forgetpwd?lang='+ that.lang;
                }, 2000);
                return;
            }
            if (res.data.code === "200") {
                if (!res.data.value) {
                    this.$refs.phoneInput.showInputTips('输入手机号与绑定手机号不一致');
                    this.wrong = true;
                } else {
                    return axios.post('/uc/system/vcode/action/sendSmsVCode', data)
                }
                
            } else {
                this.message = res.data.message;
                this.showModal = true;
                return Promise.reject(res.data.message);
            }   
        }).then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = 'https://i.flyme.cn/forgetpwd?lang='+ that.lang;
                }, 2000);
                return;
            }
            if (res.data.code === "200") {
                this.$refs.varinput.changeState();
                this.sent = true;
            } else {
                this.message = res.data.message;
                this.showModal = true;
            }
        }, (err) => {
            console.log(err);
        }).catch((err) => {
            console.log(err);
        });
        //this.$refs.varinput.changeState();
    },
    handleResend() {
        this.sent = false;
    },
    closeCycodeList() {
        this.$refs.phoneInput.changeCycode = false;
    }
  },
  mounted() {
      //this.$refs.varinput.changeState('get');
      this.account = getParams('account');
      this.lang = getParams('lang') || this.getCookie('lang') || 'zh_CN';
      this.hasEmail = getParams('hasEmail') || 'n';

      if (getParams('fromMail')) {
            this.sent = localStorage.getItem('sent') || false;
            if (localStorage.getItem('phone')) {
                this.$refs.varinput.allowSend();
                this.inputedPhone = localStorage.getItem('phone') || '';
                this.$refs.phoneInput.inputValue = localStorage.getItem('phone') || '';
                localStorage.removeItem('phone');
                
                if (/^\d{6,}/.test(this.$refs.phoneInput.inputValue) && !/\D+/.test(this.$refs.phoneInput.inputValue)) {
                    this.$refs.phoneInput.showCode = true;
                }

                if (localStorage.getItem('cycode')) {
                    this.$refs.phoneInput.countryCode.code = localStorage.getItem('cycode');
                    localStorage.removeItem('cycode');
                }

                if (this.sent) {
                    localStorage.removeItem('sent');
                    this.$refs.varinput.changeState(localStorage.getItem('leftSec'));
                    localStorage.removeItem('leftSec');
                }
            }
      } else {
          localStorage.removeItem('sent');
          localStorage.removeItem('phone');
          localStorage.removeItem('leftSec');
          localStorage.removeItem('cycode');
          localStorage.removeItem('mailSent');
          localStorage.removeItem('mail');
          localStorage.removeItem('mailLeftSec');
      }
      
      if (this.hasEmail == 'y') {
          this.toMail = `https://i.flyme.cn/uc/system/webjsp/forgetpwd/toMail?account=${this.account}&lang=${this.lang}&hasPhone=y&fromPhone=y`;
      }
      
  }
}
</script>

<style lang="scss">
    @import '../../assets/base_m.scss';
    .content-form {
        .section {
            .bar-input {
                width:100%;
                display: inline-block;  
                vertical-align: middle;
                height: px2vw(156);
                padding: 0 px2vw(48);
                padding-top: px2vw(72);
                box-sizing: border-box;
            }
        }
        .link {
            font-size: px2vw(42);
            float: right;
            margin-right: px2vw(48);
        }
    }
    .btn-next {
        margin-top: px2vw(548);
    }
</style>
