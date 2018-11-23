<template>
    <div id="app">
        <mzheader :link="headerLink"></mzheader>
        <h1 class="title">{{useLang.title}}</h1>
        <mzprogress :steps="useStep" :actived="2" size="126"></mzprogress>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.accountHolder" type="account" :label="useLang.accountLabel" @finished="handleBlur" v-model="inputedPhone" ref="phoneInput" @changeinp="handleChange" :maxlen="11"></mzinput>
                </div>
                <a class="link" v-if="hasEmail == 'y'" @click="changeWay">{{useLang.exchange}}</a>
                <a class="link" v-else></a>
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
                <a class="link"></a>
            </div>
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
                        <btn :type="'blue'" :text="useModal.okBtn" @clicked="closeModal"></btn>
                    </div>
                </div>
            </div>
            <div class="modal-main" v-show="overTime">
                <p class="modal-tips modal-tips-ot">{{useModal.timeout}}</p>
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
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal.vue';
import { getData, getParams } from '../../assets/utils.js';
import mzfooter from '../../components/footer/footer.vue';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_var_phone, forgetPwdStep, modalLang, inputLang } from '../../assets/lang.js';

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
        const phoneReg = /^[0-9]*$/;
        if (this.wrong) {
            return;
        }
        if (this.inputedPhone === "") {
            this.$refs.phoneInput.showInputTips(this.useLang.phoneEmpty);
            return;
        }
        if (!phoneReg.test(this.inputedPhone)) {
            this.$refs.phoneInput.showInputTips(this.useLang.notNumber);
            this.wrong = true;
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
                    location.href = location.host + '/forgetpwd';
                }, 2000);
                return;
            }
            if (res.data.code === "200") {
                if (!res.data.value) {
                    this.$refs.phoneInput.showInputTips(this.useLang.wrongPhone);
                    this.wrong = true;
                    return Promise.reject(this.useLang.wrongPhone);
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
                this.$refs.phoneInput.showInputTips(res.data.message);
                this.wrong = true;
                return Promise.reject('server error');
            }
        }).then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = location.host + '/forgetpwd';
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
            this.message = this.useLang.errorTips;
            this.showModal = true;
        });
    },
    closeModal() {
        this.showModal = false;
    },
    handleBlur() {
        const phoneReg = /^[0-9]*$/;
        setTimeout(() => {
            if (this.wrong) {
                return;
            }
            if (this.inputedPhone === '') {
                return;
            }
            if (!phoneReg.test(this.inputedPhone)) {
                this.$refs.phoneInput.showInputTips(this.useLang.notNumber);
                this.wrong = true;
                return;
            }
            this.varPhone().then((res) => {
                if(!res.data) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = location.host + '/forgetpwd';
                    }, 2000);
                    return;
                }
                if (res.data.code === "200") {
                    if (!res.data.value) {
                        this.$refs.phoneInput.showInputTips(this.useLang.wrongPhone);
                        this.wrong = true;
                    } else {
                        this.$refs.varinput.allowSend();
                    }
                } else {
                    this.$refs.phoneInput.showInputTips(res.data.message);
                    this.wrong = true;
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
        const that = this;
        const phoneReg = /^[0-9]*$/;
        if (!phoneReg.test(this.inputedPhone)) {
            this.$refs.phoneInput.showInputTips(this.useLang.notNumber);
            this.wrong = true;
            return;
        }
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
                    location.href = location.host + '/forgetpwd';
                }, 2000);
                return;
            }
            if (res.data.code === "200") {
                if (!res.data.value) {
                    this.$refs.phoneInput.showInputTips(this.useLang.wrongPhone);
                    this.wrong = true;
                } else {
                    return axios.post('/uc/system/vcode/action/sendSmsVCode', data)
                }
                
            } else {
                this.$refs.phoneInput.showInputTips(res.data.message);
                this.wrong = true;
                return Promise.reject(res.data.message);
            }   
        }).then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = location.host + '/forgetpwd';
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
          this.toMail = `/uc/system/webjsp/forgetpwd/toMail?account=${this.account}&lang=${this.lang}&hasPhone=y&fromPhone=y`;
      }
      
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
