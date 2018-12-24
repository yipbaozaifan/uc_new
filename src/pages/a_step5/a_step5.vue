<template>
    <div id="app">
        <mzheader></mzheader>
        <h1 class="title">账号申诉</h1>
        <mzprogress :steps="steps" :actived="4" size="96" line-length="600"></mzprogress>
        <div class="main" v-show="!complaintSuccess">
            <div class="content content-form">
                <div class="section">
                    <h3 class="section-sub-title">重置密码</h3>
                    <p class="section-tips">重置密码将会在申诉成功后启用，请留意申诉短信通知</p>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入新密码" label="重置密码：" v-model="resetPwd" ref="resetInput" :type="'password'"></mzinput>
                    </div>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请确认输入的密码" label="确认密码：" v-model="repeatPwd" ref="repeatInput" :type="'password'"></mzinput>
                    </div>
                </div>
            </div>
            <div class="content content-form">
                <div class="section">
                    <h3 class="section-sub-title">申诉结果通知</h3>
                    <p class="section-tips">申诉将在3个工作日内完成，并将结果发送至该手机号</p>
                </div>
                <div class="section">
                    <div class="bar bar-input" v-if="changePhoneType">
                        <span class="label-input">结果通知：</span>
                        <span>{{originPhone}}</span>
                        <a class="changePhoneBtn" @click="handleChangePhone">更换接收手机号</a>
                    </div>
                    <div class="bar bar-input" v-else>
                        <mzinput placeholder="请输入接收手机号" label="结果通知：" v-model="phone" ref="phoneInput" type="account" @finished="handleBlur" @changeinp="handleChange" :maxlen="11"></mzinput>
                    </div>
                </div>
                <div class="section" v-if="!changePhoneType">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入验证码" label="验证码：" v-model="varCode" ref="varInput" :type="'phoneCode'" @send="handleSend" :maxlen="6"></mzinput>
                    </div>
                </div>
            </div>
        </div>
        <div class="main" v-show="complaintSuccess" style="margin-top:104px">
            <div class="content content-form">
                <div class="section">
                    <div class="success-container">
                        <img src="./assets/success.png" alt="">
                        <p class="success-title">申诉材料提交成功</p>
                        <p class="success-text">结果将在3个工作日内完成，请留意手机短信</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="content content-btn" v-show="!complaintSuccess">
            <span class="btn-next">
                <btn :type="'blue'" :text="'下一步'" @clicked="next"></btn>
            </span>
        </div>
        <div class="mask" v-show="showModal">
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
                <p class="modal-tips modal-tips-ot">此页面已超时</p>
            </div>
        </mz-modal>
        <mzfooter now-lang="简体中文" lang-menu-item="简体中文"></mzfooter>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import mzprogress from '../../components/progress/progress.vue';
import btn from '../../components/button/button.vue';
import mzinput from '../../components/input/input.vue';
import mzCheckbox from '../../components/checkbox/mzCheckbox.vue';
import mzfooter from '../../components/footer/footer.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal.vue';
import { getParams } from '../../assets/utils.js';

export default {
  name: 'app',
  components: {
    mzheader,
    mzprogress,
    btn,
    mzCheckbox,
    mzModal,
    mzfooter,
    mzinput
  },
  data() {
    return {
      steps: [
        {
          name: '选择申诉类型',
        },
        {
          name: '身份信息',
        },
        {
          name: '填写申诉材料',
        },
        {
          name: '重置密码',
        },
      ],
      resetId: '',
      changePhoneType: false,
      account: '',
      phone: '',
      originPhone: '',
      varCode: '',
      resetPwd: '',
      showModal: false,
      message: '',
      repeatPwd: '',
      wrong: false,
      hasSubmit: false,
      canSubmit: false,
      overTime: false,
      complaintSuccess: false,
      //pwdWrong: false,
    }
  },
  methods: {
    next() {
        const phoneReg = /^[0-9]*$/;
        const pwdReg = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-])|(?=.*?[A-Za-z])(?=.*?[!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-]))[\dA-Za-z!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-]+$/;
        if (this.wrong) {
            return;
        }
        if (this.hasSubmit) {
            return;
        }
    
        if (this.resetPwd == "" || this.resetPwd.length > 16 || this.resetPwd.length < 8) {
            this.$refs.resetInput.showInputTips("密码应为8~16个字符，区分大小写");
            // this.pwdWrong = true;
            return;
        }
        if (!pwdReg.test(this.resetPwd)) {
            this.$refs.resetInput.showInputTips("密码至少包含数字、字母和符号两种类型");
            // this.pwdWrong = true;
            return;
        }
        if (this.resetPwd == this.account) {
            this.$refs.resetInput.showInputTips('密码不能与账号相同');
            // this.pwdWrong = true;
            return;
        }
        if (this.varResetPwd === "") {
            this.$refs.repeatInput.showInputTips('请重新输入密码');
            // this.pwdWrong = true;
            return;
        }
        if (this.resetPwd !== this.repeatPwd) {
            this.$refs.repeatInput.showInputTips('两次输入密码不一致');
            // this.pwdWrong = true;
            return;
        }
        if (!this.changePhoneType) {
            if (this.phone == "") {
                this.$refs.phoneInput.showInputTips('手机号不能为空');
                this.wrong = true;
                return;
            }
            if (!phoneReg.test(this.phone)) {
                this.$refs.phoneInput.showInputTips('请输入合法的手机号');
                this.wrong = true;
                return;
            }
            if (this.varCode == "") {
                this.$refs.varInput.showInputTips('请输入验证码');
                return;
            }
        }
        if (!this.changePhoneType) {
            this.cycode = '+'+this.$refs.phoneInput.countryCode.code;
        }
        const data = {
            newPassword: this.resetPwd,
            notifyPhone: this.changePhoneType ? this.originPhone : this.phone,
            resetId: this.resetId,
            cycode: this.cycode,
            vcode: this.varCode,
        }
        axios.post('/uc/system/webjsp/resetpwd/addNotifyInfo', data).then((res) => {
            if(res.data.code == 200) {
                this.complaintSuccess = true;
                return
            } else if(res.data.message == "非法操作") {
                return Promise.reject(0);
            } else if (res.data.code == 200000) {
                this.$refs.varInput.showInputTips('验证码错误');
                return Promise.reject(1);
            } else {
                this.message = res.data.message || "未知错误，请重试";
                this.showModal = true;
                return Promise.reject(1);
            }
        }).catch((err) => {
            if (err == 0) { // 页面超时错误
                if (!this.overTime) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = location.origin + '/appeal/step1';
                    }, 2000);
                }
            } else if (err == 1) { // 已经处理的错误
                console.log(err);
            } else { // 网络错误
                this.message = "网络错误，请重试";
                this.showModal = true;
            }        
        })

    },
    closeModal() {
        this.showModal = false;
        this.message = "";
    },
    handleChangePhone() {
        this.changePhoneType = false;
    },
    handleChange(varPhone) {
        if (this.wrong) {
            this.wrong = false;
            if (varPhone) { //更改国家码
                this.handleBlur()
            }
        } else {
            return
        }
    },
    handleSend() {
        const that = this;
        const phoneReg = /^[0-9]*$/;
        if (this.wrong) {
            return;
        }
        if (!phoneReg.test(this.phone)) {
            this.$refs.phoneInput.showInputTips('请输入合法的手机号');
            this.wrong = true;
            return;
        }
        let data = {
            vCodeTypeValue: 22,
            phone: '00' + this.$refs.phoneInput.countryCode.code + ':' + this.phone,
            account: this.account,
        }

        axios.post('/uc/system/vcode/action/sendSmsVCode', data).then((res) => {
            console.log(res);
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = location.origin + '/forgetpwd';
                }, 2000);
                return;
            }
            if (res.data.code == "200") {
                this.$refs.varInput.changeState();
            } else {
                this.message = res.data.message;
                this.showModal = true;
            }
        }, (err) => {
            this.message = '网络错误，请重试';
            this.showModal = true;
        })
    },
    handleBlur() {
        const phoneReg = /^[0-9]*$/;
        if (this.wrong) {
            return;
        }
        if (this.phone == '') {
            return;
        }
        if (!phoneReg.test(this.phone)) {
            this.$refs.phoneInput.showInputTips('请输入合法的手机号');
            this.wrong = true;
            return;
        }
        this.$refs.varInput.allowSend();
    }
  },
  mounted() {
      this.account = getParams('account') || "";
      this.originPhone = getParams('phone') || "";
      this.resetId = getParams('resetId') || "";
      this.cycode = getParams('cycode') || "";
      if (!this.resetId || !this.account) {
          location.replace('/appeal');
      }
      if (this.originPhone) {
          this.changePhoneType = true;
      }
  }
}
</script>

<style lang="scss">
    @import '../../assets/base.scss';
        .title {
            text-align: center;
        }
        .footer {
            z-index: 501;
        }
        .main {
            width: 660px;
            margin: 0 auto;
            .tips-bar{
                margin-left: 50px;
                margin-top: 60px;
                p {
                    font-family: MicrosoftYaHei;
                    font-size: 16px;
                    color: #000000;
                    letter-spacing: 0;
                    line-height: 24px;
                }
            }
            .content-form {
                margin-top: 40px;
                &.used-phone-data {
                    margin-top: 100px;
                }
                .section {
                    width: 100%;
                    text-align: left;
                    .success-container {
                        text-align: center;
                        img {
                            width: 337px;
                        }
                        .success-title {
                            font-size: 20px;
                            color: #000000;
                            margin-top: 21px;
                            margin-bottom: 6px;
                            letter-spacing: 0;
                        }
                        .success-text {
                            opacity: 0.4;
                            font-size: 14px;
                            color: #000000;
                            letter-spacing: 0;
                        }
                    }
                    .section-sub-title {
                        font-family: MicrosoftYaHei;
                        font-size: 20px;
                        color: #000000;
                        letter-spacing: 0;
                        width: 450px;
                        margin: 0 auto;
                        margin-bottom: 6px;
                    }
                    .section-tips {
                        width: 450px;
                        margin: 0 auto;
                        opacity: 0.4;
                        font-family: MicrosoftYaHei;
                        font-size: 14px;
                        color: #000000;
                    }
                    .phone-type-tips {
                        width: 268px;
                        margin-left: 195px;
                        margin-top: 8px;
                        p {
                            opacity: 0.4;
                            font-family: MicrosoftYaHei;
                            font-size: 14px;
                            color: #000000;
                            letter-spacing: 0;
                            line-height: 24px;
                        }
                    }
                    .forgoten-content {
                        margin-left: 185px;
                        font-size: 14px;
                        opacity: 0.4;
                        margin-top: 8px;
                    }
                    .bar-input {
                        width: 576px;
                        margin: 0 auto;
                        .label-input {
                            text-align: right;
                            display: inline-block;
                            width: 143px;
                            height: 36px;
                            line-height: 36px;
                            font-size: 16px;
                        }
                        .changePhoneBtn {
                            float: right;
                            color: #387AFF;
                            cursor: pointer;
                            height: 36px;
                            line-height: 36px;
                        }
                    }
                    .selection {
                        font-size: 0px;
                        cursor: pointer;
                        
                        .select-label {
                            vertical-align: middle;
                            display: inline-block;
                            font-size: 16px;
                        }
                        .select-content {
                            font-size: 14px;
                            line-height: 36px;
                            background: #FFFFFF;
                            border: 1px solid rgba(0,0,0,0.15);
                            border-radius: 4px;
                            display: inline-block;
                            width: 290px;
                            vertical-align: middle;
                            height: 34px;
                            .selected-value {
                                margin-left: 10px;
                            }
                            .arrow {
                                width: 10px;
                                height: 6px;
                                float: right;
                                margin-right: 16px;
                                margin-top: 16px;
                            }
                        }
                    } 
                }
            }
        }
        .content-btn {
            margin-top: 99px;
            .btn-back,.btn-next {
                display: inline-block;
                width: 288px;
                margin-top: 0;  
            }
            .btn-back {
                margin-right: 12px;
            }
        }
</style>
