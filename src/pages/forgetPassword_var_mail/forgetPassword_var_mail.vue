<template>
    <div id="app">
        <mzheader :link="headerLink"></mzheader>
        <h1 class="title">{{useLang.title}}</h1>
        <mzprogress :steps="useStep" :actived="2" size="126"></mzprogress>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.accountHolder" :type="'email'" :label="useLang.accountLabel" @finished="handleBlur" v-model="inputedMail" ref="mailInput" @changeinp="handleChange" ></mzinput>
                </div>
                <a class="link" v-if="hasPhone=='y'" @click="changeWay">{{useLang.exchange}}</a>
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
                    <mzinput :placeholder="useLang.varCodeHolder" :type="'phoneCode'" :label="useLang.varCodeLabel" ref="varinput" @send="handleSend" :maxlen="6" v-model="varCode" @resend="handleResend" :get-state="useInput.getState" :resend="useInput.resend"></mzinput>
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
        <div class="mask" v-show="showModal" >
        </div>
        <mz-modal :title="useModal.title" v-show="showModal" @close="closeModal">
            <div class="modal-main" v-show="showSend && !overTime">
                <p class="modal-tips">{{useLang.sendTips[0]}}</p>
                <p class="modal-tips">{{inputedMail}}</p>
                <p class="modal-tips">{{useLang.sendTips[1]}}</p>
                <p class="modal-tips">{{useLang.sendTips[2]}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <btn :type="'blue'" :text="useModal.okBtn" @clicked="closeModal"></btn>
                    </div>
                </div>
            </div>
            <div class="modal-main" v-show="showTips && !overTime">
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
import mzModal from '../../components/mzModal/mzModal.vue';
import axios from 'axios';
import { getData, getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import mzfooter from '../../components/footer/footer.vue';
import { forgetPwd_var_mail, forgetPwdStep, modalLang, inputLang } from '../../assets/lang.js';

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
      languageObject: forgetPwd_var_mail,
      steps: forgetPwdStep,
      inputedMail: '',
      account: '',
      showModal: false,
      varCode: '',
      canSubmit: true,
      message: '',
      showSend: false,
      showTips: false,
      wrong: false,
      toPhone: '',
      hasPhone: '',
      sent: false,
      overTime: false,
      modalLangObject: modalLang,
      inputLangObject: inputLang,
    }
  },
  methods: {
    submit() {
        // 提交验证码
        if (this.wrong) {
            return;
        }
        if (!this.canSubmit) {
            return
        }
        if (this.inputedMail === "" || !/^[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.inputedMail)) {
            this.$refs.mailInput.showInputTips(this.useLang.mailEmpty);
            return;
        }
        if (this.varCode === "") {
            this.$refs.varinput.showInputTips(this.useLang.CodeEmptyTips);
            return;
        }
        this.canSubmit = false;
        this.varEmail().then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = location.origin + '/forgetpwd';
                }, 2000);
                return;
            }
            if (res.data.code === "200") {
                if (!res.data.value) {
                    this.$refs.mailInput.showInputTips(this.useLang.wrongEmail);
                    this.wrong = true;
                    this.canSubmit = true;
                    return Promise.reject(res.data.message);
                } else {
                    return axios.post('/uc/system/webjsp/forgetpwd/isValidEmailVCode', {
                        account: this.account,
                        email: this.inputedMail,
                        vcode: this.varCode,
                        vCodeTypeValue: 8
                    })
                }
                
            } else {
                this.message = res.data.message;
                this.showModal = true;
                this.showTips = true;
                this.canSubmit = true;
                return Promise.reject(res.data.message);
            }
        }).then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = location.origin + '/forgetpwd';
                }, 2000)
                return;
            }
            //const result = getData(res.data);
            if (res.data.code != "200") {
                if (res.data.code == "19999") {
                    this.$refs.varinput.showInputTips(res.data.message);
                } else {
                    this.message = res.data.message;
                    this.showModal = true;
                    this.showTips = true;
                }
                this.canSubmit = true;
            } else {
                location.href = res.data.value.url;
            }
        }, (err) => {
            console.log(err);
        }).catch((err) => {
            this.canSubmit = true;
            this.message = this.useLang.errorTips;
            this.showModal = true;
            this.showTips = true;
        })
    },
    
    handleBlur(value) {
        setTimeout(() => {
            if (this.wrong) {
                return;
            }
            if (this.inputedMail === "" || !/^[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.inputedMail)) {
                this.$refs.mailInput.showInputTips(this.useLang.mailEmpty);
                return;
            }
            this.varEmail().then((res) => {
                if(!res.data) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = location.origin + '/forgetpwd';
                    }, 2000);
                    return;
                }
                if (res.data.code === "200") {
                    if (!res.data.value) {
                        this.$refs.mailInput.showInputTips(this.useLang.wrongEmail);
                        this.wrong = true;
                    } else {
                        this.$refs.varinput.allowSend();
                    }
                    
                } else {
                    this.message = res.data.message;
                    this.showModal = true;
                    this.showTips = true;
                }
            }, (err) => {
                this.message = this.useLang.errorTips;
                this.showTips = true;
                this.showModal = true;
            });
        }, 100);
    },
    changeWay() {
        if(this.inputedMail) {
            localStorage.setItem('mail', this.inputedMail);
        }
        if (this.sent) {
            localStorage.setItem('mailLeftSec', this.$refs.varinput.waitTime);
            localStorage.setItem('mailSent', this.sent);
        }
        location.href = this.toPhone;
    },
    handleChange() {
        if (this.wrong) {
            this.wrong = false;
        } else {
            return
        }
    },
    varEmail() {
        // 判断输入邮箱是否为绑定的邮箱
        return axios.get(`/uc/system/webjsp/member/isMyEmail?account=${this.account}&email=${this.inputedMail}`)
    },
    closeModal() {
        this.showModal = false;
        this.showSend = false;
        this.showTips = false;
    },
    handleResend() {
        this.sent = false;
    },
    handleSend() {
        //this.$refs.varinput.changeState('get');
        if (this.wrong) {
            return;
        }
        this.varEmail().then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = location.origin + '/forgetpwd';
                }, 2000);
                return;
            }
            if (res.data.code === "200") {
                if (!res.data.value) {
                    this.$refs.mailInput.showInputTips(this.useLang.wrongEmail);
                    this.wrong = true;
                    return Promise.reject(res.data.message);
                } else {
                    return axios.post('/uc/system/vcode/sendEmailVcode', {
                        email: this.inputedMail,
                        vCodeTypeValue: "8",
                        account: this.account
                    })
                }
            } else {
                this.message = res.data.message;
                this.showModal = true;
                this.showTips = true;
                return Promise.reject(res.data.message);
            }
        }).then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = location.origin + '/forgetpwd';
                }, 2000);
                return;
            }
            if (res.data.code !== "200") {
                this.message = res.data.message;
                this.showModal = true;
                this.showTips = true;
            } else {
                this.$refs.varinput.changeState();
                this.showModal = true;
                this.showSend = true;
                this.sent = true;
            }
        }, (err) => {
            console.log(err);
        }).catch((err) => {
            console.log(err);
        })
    },
  },
  mounted() {
      this.account = getParams('account');
      this.lang = getParams('lang') || this.getCookie('lang') || 'zh_CN';
      if (!(this.lang == 'zh_CN')) {
          document.title = 'Retrieve password'
      }
      this.hasPhone = getParams('hasPhone') || 'n';

      if (getParams('fromPhone')) {
            this.sent = localStorage.getItem('mailSent') || false;
            if (localStorage.getItem('mail')) {
                this.$refs.varinput.allowSend();
                if (this.sent) {
                    localStorage.removeItem('mailSent');
                    this.$refs.varinput.changeState(localStorage.getItem('mailLeftSec'));
                    localStorage.removeItem('mailLeftSec');
                }
                this.inputedMail = localStorage.getItem('mail') || '';
                this.$refs.mailInput.inputValue = localStorage.getItem('mail') || '';
                localStorage.removeItem('mail');
            }
      } else {
          localStorage.removeItem('mailSent');
          localStorage.removeItem('mail');
          localStorage.removeItem('mailLeftSec');
          localStorage.removeItem('sent');
          localStorage.removeItem('phone');
          localStorage.removeItem('leftSec');
          localStorage.removeItem('cycode');
      }
      if (this.hasPhone == 'y') {
          this.toPhone = `/uc/system/webjsp/forgetpwd/toPhone?account=${this.account}&lang=${this.lang}&hasEmail=y&fromMail=y`;
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
            .link {
                height: 36px;
                line-height: 36px;
                vertical-align: top;
            }
        }
    }
</style>
