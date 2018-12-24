<template>
    <div id="app" class="complaint_select_type">
        <mzheader link="https://www.meizu.com/"></mzheader>
        <h1 class="title">账号申诉</h1>
        <mzprogress :steps="steps" :actived="1" size="96" line-length="600"></mzprogress>
        <div v-if="changePhone" class="bar bar-text">
            <p class="complaint-text">重置安全手机</p>
            <p class="complaint-text-gray">重置安全手机后，账号将绑定此手机号码，并可作为账号进行登录</p>
        </div>
        <div class="content content-form reset-phone" v-if="changePhone">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入手机号'" type="account" label="手机号码：" v-model="phone" ref="phoneInput" @finished="handleBlur" :maxlen="11" @changeinp="handleChange"></mzinput>
                </div>
                <a class="link"></a>
            </div>
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入验证码'" type="phoneCode" :label="'验证码：'" v-model="varCode" ref="kapkeyInput" :maxlen="6" @send="handleSend"></mzinput>
                </div>
                <a class="link"></a>
            </div>
        </div>
        <div class="content content-form" v-else>
            <div class="section">
                <div class="checkbox-bar">
                    <mz-checkbox
                        v-model="resetQuestions"
                        :label="'清除密保'"
                    ></mz-checkbox>
                    <p class="option-desc">清除账号原有密保并重置密码</p>
                </div>
            </div>
            <div class="section">
                <div class="checkbox-bar">
                    <mz-checkbox
                    v-model="resetPhone"
                    :label="'重置安全手机'"
                    ></mz-checkbox>
                    <p class="option-desc">重新绑定账号安全手机并重置密码</p>
                </div>
            </div>
            <div class="section">
                <div class="checkbox-bar">
                    <mz-checkbox
                    v-model="otherReason"
                    :label="'其他原因 :'"
                    ></mz-checkbox>
                    <div class="extra" :class="{
                        'error': showExtraTips
                    }">
                        <input type="text" v-model="reason" placeholder="如账号被盗，密保信息被修改" :disabled="!otherReason" @input="handleInput">
                    </div>
                    <p v-show="showExtraTips" class="extra-tips">{{extraTips}}</p>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <span class="btn-back" v-if="changePhone">
                <btn :type="'white'" :text="'上一步'" @clicked="back"></btn>
            </span>
            <span class="btn-next" :class="{'long-btn': !changePhone}">
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
                <p class="modal-tips modal-tips-ot">此页面已失效</p>
            </div>
        </mz-modal>
        <mzfooter now-lang="简体中文" lang-menu-item="简体中文"></mzfooter>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import mzprogress from '../../components/progress/progress.vue';
import mzinput from '../../components/input/input_c.vue';
import btn from '../../components/button/button.vue';
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
    mzinput,
  },
  watch: {
      otherReason(newValue, oldValue) {
          if (!newValue) {
              this.showExtraTips = false;
              this.extraTips = "";
          }
      }
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
      account: '',
      resetQuestions: false,
      varCode: '',
      showModal: false,
      message: '',
      resetPhone: false,
      otherReason: false,
      reason: '',
      showExtraTips: false,
      extraTips: '',
      phone:'',
      changePhone: false,
      wrong: false,
      overTime: false,
      varPhoneFlag: false,
    }
  },
  methods: {
    back() {
        this.changePhone = false;
    },
    next() {
        console.log(this.wrong);
        let data = {
            account: this.account,
            vCodeTypeValue: 22,
            clearSecurityQuestion: this.resetQuestions ? 1 : 0,
            clearSecurityPhone: this.resetPhone ? 1 : 0,
            otherReason: this.reason,
            resetPassword: 1,
        };
        const phoneReg = /^[0-9]*$/;
        if (!this.changePhone){ // 选择类型
            if (this.otherReason && this.reason.length < 10) {
                this.extraTips = "其他原因不得少于10个字符";
                this.showExtraTips = true;
                return;
            }
            if (this.resetPhone) { // 选择了重置手机 跳转到输入安全手机页面
                this.changePhone = true;
                return;
            }
            // 没选择重置手机
            axios.post('https://i.flyme.cn/uc/system/webjsp/resetpwd/new', data).then((res) => {
                if(res.data.code == 200) {
                    location.replace(`/appeal/step3?account=${this.account}&resetId=${res.data.value.resetId}`);
                } else {
                    
                    this.showModal = true;
                    this.message = res.data.message || "未知错误，请重试";
                }
            }, (err) => {
                this.showModal = true;
                this.message = "网络错误，请重试";
            })
        } else { // 重置手机号页面
            if (this.wrong) {
                return;
            }
            if (this.phone == "") {
                this.$refs.phoneInput.showInputTips('手机号不能为空');
                this.wrong = true;
                return;
            }
            if (!phoneReg.test(this.phone)) {
                this.$refs.phoneInput.showInputTips('请输入纯数字手机号');
                this.wrong = true;
                return;
            }
            if (this.varCode === "") {
                this.$refs.kapkeyInput.showInputTips('验证码不能为空');
                return;
            }
            data['phone'] = this.phone;
            data['cycode'] = this.$refs.phoneInput.countryCode.code;
            data['vcode'] = this.varCode;
            axios.post('https://i.flyme.cn/uc/system/webjsp/resetpwd/new', data).then((res) => {
                if (!res.data) {
                    return Promise.reject(0);
                }
                if(res.data.code == 200) {
                    location.replace(`/appeal/step3?account=${this.account}&resetId=${res.data.value.resetId}`);
                } else {
                    if (res.data.code == 200000) {
                        this.$refs.kapkeyInput.showInputTips(res.data.message);
                        return Promise.reject(1); 
                    } else {
                        this.showModal = true;
                        this.message = res.data.message || "未知错误，请重试";
                        return Promise.reject(1); 
                    }
                    
                }
            }).catch((err) => {
                if (err == 0) { // 页面超时错误
                    if (!this.overTime) {
                        this.showModal = true;
                        this.overTime = true;
                        setTimeout(() => {
                            location.href = location.origin + '/appeal';
                        }, 2000);
                    }
                } else if (err == 1) { // 已经处理的错误
                    console.log(err);
                } else { // 网络错误
                    this.message = "网络错误，请重试";
                    this.showModal = true;
                }
            })
        }
    },
    handleInput() {
        this.showExtraTips = false;
        this.extraTips = "";
    },
    closeModal() {
        this.showModal = false;
        this.message = "";
    },
    handleBlur() { // 离开电话输入框时判断电话是否合法
            const phoneReg = /^[0-9]*$/;
            if (this.wrong) {
                return;
            }
            if (this.phone === '') {
                return;
            }
            if (!phoneReg.test(this.phone)) {
                return;
            }
            this.varPhone().then((res) => {
                if(!res.data) {
                    if (!this.overTime) {
                        this.showModal = true;
                        this.overTime = true;
                        setTimeout(() => {
                            location.href = location.origin + '/appeal';
                        }, 2000);
                        return;
                    }
                }
                if (res.data.code == "200" && res.data.value) {
                    this.$refs.kapkeyInput.allowSend();
                } else {
                    this.$refs.phoneInput.showInputTips(res.data.message || '错误的手机号码');
                    this.wrong = true;
                }
            }, (err) => {
                this.message = "网络错误，请重试";
                this.showModal = true;
            })
    },
    handleSend() {
        const phoneReg = /^[0-9]*$/;
        if (this.wrong) {
            return;
        }
        if (this.phone === '') {
            this.$refs.phoneInput.showInputTips('请先输入手机号');
            this.wrong = true;
            return;
        }
        if (!phoneReg.test(this.phone)) {
            this.$refs.phoneInput.showInputTips('请输入纯数字手机号');
            this.wrong = true;
            return;
        }
        axios.post('/uc/system/vcode/action/sendSmsVCode', {
            phone: '00' + this.$refs.phoneInput.countryCode.code + ':' + this.phone,
            vCodeTypeValue: 22,
            account: this.account
        }).then((res) => {
            if(!res.data) {
                return Promise.reject(0);
            }
            if (res.data.code == "200") {
                this.$refs.kapkeyInput.changeState();
                this.sent = true;
                return Promise.reject(1);
            } else {
                this.message = res.data.message;
                this.showModal = true;
                return Promise.reject(1);
            }
        }).catch((err) => {
            if (err == 0) { // 页面超时错误
                if (!this.overTime) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = location.origin + '/appeal';
                    }, 2000);
                }
            } else if (err == 1) { // 已经处理的错误
                console.log(err);
            } else { // 网络错误
                this.message = "网络错误，请重试";
                this.showModal = true;
            }
        })
        /*this.varPhone().then((res) => {
            if(!res.data) {
                if (!this.overTime) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = location.origin + '/appeal/step1';
                    }, 2000);
                    return;
                }
            }
            if (res.data.code == "200" && res.data.value) {
                return axios.post('/uc/system/vcode/sendCgiSmsVCode', {
                    phone: '00' + this.$refs.phoneInput.countryCode.code + ':' + this.phone,
                    vCodeTypeValue: 22
                })
            } else {
                this.$refs.phoneInput.showInputTips(res.data.message || '错误的手机号码');
                this.wrong = true;
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
            if (res.data.code == "200") {
                this.$refs.kapkeyInput.changeState();
                this.sent = true;
            } else {
                this.message = res.data.message;
                this.showModal = true;
            }
        })*/
    },
    handleChange(varPhone) {
        if (this.wrong) {
            this.wrong = false;
            this.$refs.kapkeyInput.invalid = true;
            if (varPhone) { 
                this.handleBlur()
            }
        } else {
            this.$refs.kapkeyInput.invalid = true;
            if (varPhone) { 
                this.handleBlur()
            }
            return
        }
    },
    varPhone() {
        let phone = '00' + this.$refs.phoneInput.countryCode.code + ':' + this.phone;
        return axios.get(`/uc/system/webjsp/resetpwd/checkSecurityPhone?phone=${phone}&account=${this.account}`);
    }
  },
  mounted() {
      this.account = getParams('account') || "";
      if (!this.account) {
          location.replace('/appeal')
      }
  }
}
</script>

<style lang="scss">
    @import '../../assets/base.scss';
    .complaint_select_type {
        .title {
            text-align: center;
        }
        .bar-text {
            margin-top: 74px;
            .complaint-text {
                font-size: 16px;
                color: #000000;
                letter-spacing: 0;
                line-height: 24px;
                width: 518px;
                margin: 0 auto;
                font-weight: 600;
                &-gray{
                    font-size: 14px;
                    color: #999999;
                    width: 518px;
                    margin: 0 auto;
                }
            }
        }
        .footer {
            z-index: 501;
        }
        .content-form {
            &.reset-phone {
                margin-top: 34px;
            }
            .section {
                font-size: 20px;
                color: #000000;
                font-weight: 600;
                width: 600px;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: 30px;
                .checkbox-bar {
                    text-align: left;
                    margin-left: 180px; 
                    height: 42px;
                }
                .bar-input {
                    width: 433px;
                    display: inline-block;
                    vertical-align: middle;
                }
                .option-desc {
                    opacity: 0.4;
                    font-weight: 500;
                    font-size: 14px;
                    margin-left: 26px;
                }
                .extra {
                    display: inline-block;
                    padding-left: 6px;
                    width: 230px;
                    border: 1px solid #CCCCCC;
                    border-radius: 4px;
                    padding: 9px 15px;
                    height: 20px;
                    input {
                        border: none;
                        width: 100%;
                        font-size: 14px;
                        line-height: 20px;
                        height: 20px;
                        &:disabled {
                            background-color: #ffffff;
                        }
                    }  
                    &.error {
                        border-color: #DE3131;
                    } 
                }
                .extra-tips {
                    font-size: 14px;
                    color: #DE3131;
                    margin-top: 6px;
                    margin-left: 137px;
                }
            }
        }
        .content-btn {
            margin-top: 99px;
            .btn-back,.btn-next {
                display: inline-block;
                width: 140px;
                margin-top: 0;  
            }
            .btn-next {
                &.long-btn {
                    width: 288px;
                }
            }
            .btn-back {
                margin-right: 12px;
            }
        }
    }
</style>
