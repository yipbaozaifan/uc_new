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
                <a class="link"></a>
            </div>
            <!--<div class="section" v-show="!phoneInput">
                <div class="bar bar-tips">
                    <p class="text-tips">验证码已发送至 +{{inputedPhone}}</p>
                    <a class="change-phone" @click="handleChange">更改验证手机</a>
                </div>
            </div>-->
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.varCodeHolder" :type="'phoneCode'" :label="useLang.varCodeLabel" ref="varinput" @send="handleSend" :maxlen="6" v-model="varCode"></mzinput>
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
        <mz-modal :title="useLang.modalTitle" v-show="showModal" @close="closeModal">
            <div class="modal-main" v-show="showSend">
                <p class="modal-tips">验证码已发往邮箱 {{inputedMail}}</p>
                <p class="modal-tips">请前往查看并将验证码填写在输入框</p>
                <p class="modal-tips">（30分钟内有效）</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <btn :type="'blue'" :text="useLang.modalBtn" @clicked="closeModal"></btn>
                    </div>
                </div>
            </div>

            <div class="modal-main" v-show="showTips">
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
import axios from 'axios';
import { getData, getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import mzfooter from '../../components/footer/footer.vue';
import { forgetPwd_var_mail, forgetPwdStep } from '../../assets/lang.js';

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
        if (this.inputedMail === "" || !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.inputedMail)) {
            this.$refs.mailInput.showInputTips('请输入正确的邮箱');
            return;
        }
        if (this.varCode === "") {
            this.$refs.varinput.showInputTips('请输入验证码');
            return;
        }
        this.canSubmit = false;
        this.varEmail().then((res) => {
            if (res.data.code === "200") {
                if (!res.data.value) {
                    this.$refs.mailInput.showInputTips('你输入的不是预设邮箱');
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
            const result = getData(res.data);
            if (result == null) {
                this.canSubmit = true;
                this.message = res.data.message;
                this.showModal = true;
                this.showTips = true;
            }
            if (result) {
                location.href = res.data.value.url;
            }
        }, (err) => {
            console.log(err);
        }).catch((err) => {
            this.canSubmit = true;
            this.message = '网络错误，请稍后再试';
            this.showModal = true;
            this.showTips = true;
        })
    },
    
    handleBlur(value) {
        setTimeout(() => {
            if (this.wrong) {
                return;
            }
            if (this.inputedMail === "" || !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.inputedMail)) {
                this.$refs.mailInput.showInputTips('请输入正确的邮箱');
                return;
            }
            this.varEmail().then((res) => {
                if (res.data.code === "200") {
                    if (!res.data.value) {
                        this.$refs.mailInput.showInputTips('输入邮箱与绑定的邮箱不一致');
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
                this.message = '网络错误，请重试';
                this.showModal = true;
            });
        }, 100);
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
    handleSend() {
        //this.$refs.varinput.changeState('get');
        if (this.wrong) {
            return;
        }
        this.varEmail().then((res) => {
            if (res.data.code === "200") {
                if (!res.data.value) {
                    this.$refs.mailInput.showInputTips('你输入的不是预设邮箱');
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
            if (res.data.code !== "200") {
                this.message = res.data.message;
                this.showModal = true;
                this.showTips = true;
            } else {
                this.$refs.varinput.changeState();
                this.showModal = true;
                this.showSend = true;
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
      this.lang = getParams('lang') || 'zh_CN'; 
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
