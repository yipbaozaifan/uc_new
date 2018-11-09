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
                <a class="link" v-if="hasEmail == 'y'" @click="changeWay">通过邮箱验证</a>
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
                    <mzinput :placeholder="useLang.varCodeHolder" :type="'phoneCode'" :label="useLang.varCodeLabel" ref="varinput" @send="handleSend" v-model="varCode" :maxlen="6" @resend="handleResend"></mzinput>
                </div>
                <a class="link"></a>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="submit"></btn>
            </div>
            <a href="https://i.flyme.cn/appeal" class="link" target="_Blank">{{useLang.complaintLink}}</a>
        </div>
        <div class="mask" v-show="showModal" @click="closeModal">
        </div>
        <mz-modal :title="'提示'" v-show="showModal" @close="closeModal">
            <div class="modal-main" v-show="!overTime">
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <btn :type="'blue'" :text="'确定'" @clicked="closeModal"></btn>
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
import mzheader from '../../components/header/header.vue';
import mzprogress from '../../components/progress/progress.vue';
import btn from '../../components/button/button.vue';
import mzinput from '../../components/input/input.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal.vue';
import { getData, getParams } from '../../assets/utils.js';
import mzfooter from '../../components/footer/footer.vue';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_var_phone, forgetPwdStep } from '../../assets/lang.js';

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
            this.$refs.phoneInput.showInputTips('请输入正确的手机号');
            return;
        }
        if (this.varCode === "") {
            this.$refs.varinput.showInputTips('请输入验证码');
            return;
        }
        this.varPhone().then((res) => {
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
                    location.href = 'https://i.flyme.cn/forgetpwd';
                }, 2000)
                return;
            }
            if (res.data.code !== "200") {
                this.message = res.data.message;
                this.showModal = true;
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
      this.lang = getParams('lang') || 'zh_CN';
      this.hasEmail = getParams('hasEmail') || 'n';

      if (getParams('fromMail')) {
            this.sent = localStorage.getItem('sent') || false;
            this.$refs.varinput.allowSend();
            if (this.sent) {
                localStorage.removeItem('sent');
                this.$refs.varinput.changeState(localStorage.getItem('leftSec'));
                localStorage.removeItem('leftSec');
            }
            
            if (localStorage.getItem('cycode')) {
                this.$refs.phoneInput.countryCode.code = localStorage.getItem('cycode');
                localStorage.removeItem('cycode');
            }

            if (localStorage.getItem('phone')) {
                this.inputedPhone = localStorage.getItem('phone') || '';
                this.$refs.phoneInput.inputValue = localStorage.getItem('phone') || '';
                localStorage.removeItem('phone');
                if (/^\d{6,}/.test(this.$refs.phoneInput.inputValue) && !/\D+/.test(this.$refs.phoneInput.inputValue)) {
                    this.$refs.phoneInput.showCode = true;
                }
            }
      } else {
          localStorage.removeItem('sent');
          localStorage.removeItem('phone');
          localStorage.removeItem('leftSec');
          localStorage.removeItem('cycode');
      }
      
      if (this.hasEmail == 'y') {
          this.toMail = `https://i.flyme.cn/uc/system/webjsp/forgetpwd/toMail?account=${this.account}&lang=${this.lang}&hasPhone=y&fromPhone=y`;
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
