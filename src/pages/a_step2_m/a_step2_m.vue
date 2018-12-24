<template>
    <div id="app" class="complaint_select_type">
        <div class="steps-warp">
            <mzprogress :steps="steps" :actived="1" size="58" line-length="188"></mzprogress>
        </div>
        <h1 class="title" v-show="!changePhone">选择申诉类型</h1>
        <div v-if="changePhone" class="bar bar-text">
            <p class="complaint-text">重置安全手机</p>
        </div>
        <div class="content content-form reset-phone" v-if="changePhone">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入手机号'" type="account" v-model="phone" ref="phoneInput" @finished="handleBlur" :maxlen="11" @changeinp="handleChange"></mzinput>
                </div>
            </div>
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入验证码'" type="phoneCode"  v-model="varCode" ref="kapkeyInput" :maxlen="6" @send="handleSend"></mzinput>
                </div>
            </div>
        </div>
        <div class="content content-form" v-else>
                <div class="checkbox-bar">
                    <div class="checkbox-option">
                        <p class="option-name">清除密保</p>
                        <p class="option-desc">清除账号原有密保并重置密码</p>
                    </div>
                    <mz-checkbox
                        v-model="resetQuestions"
                        circle
                    >
                    </mz-checkbox>
                </div>
                <div class="checkbox-bar">
                    <div class="checkbox-option">
                        <p class="option-name">重置安全手机</p>
                        <p class="option-desc">重新绑定账号安全手机并重置密码</p>
                    </div>
                    <mz-checkbox
                        v-model="resetPhone"
                        circle
                    >
                    </mz-checkbox>
                </div>
        </div>
        <div class="content content-form" v-show="!changePhone">
            <div class="section">
                <div class="section-title">
                    <p>其他原因</p>
                </div>
                <div class="extra">
                    <input type="text" v-model="reason" placeholder="如账号被盗，密保信息被修改" @input="handleInput">
                    <!--<span v-show="showExtraTips" class="extra-tips">{{extraTips}}</span>-->                    
                </div>
            </div>
        </div>
        <div class="content content-btn" :class="{
            'changePhone': changePhone
        }">
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
                        <a @click="closeModal">确定</a>
                    </div>
                </div>
            </div>
            <div class="modal-main" v-show="overTime">
                <p class="modal-tips modal-tips-ot">此页面已失效</p>
            </div>
        </mz-modal>
    </div>
</template>

<script>
import mzprogress from '../../components/progress/progress_m.vue';
import mzinput from '../../components/input/input_m.vue';
import btn from '../../components/button/button_m.vue';
import mzCheckbox from '../../components/checkbox/mzCheckbox.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal_m.vue';
import { getParams } from '../../assets/utils.js';

export default {
  name: 'app',
  components: {
    mzprogress,
    btn,
    mzCheckbox,
    mzModal,
    mzinput,
  },
  data() {
    return {
      steps: [
        {
          name: '申诉类型',
        },
        {
          name: '身份信息',
        },
        {
          name: '申诉材料',
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
            if (this.resetPhone) { // 选择了重置手机 跳转到输入安全手机页面
                this.changePhone = true;
                return;
            }
            // 没选择重置手机
            axios.post('https://i.flyme.cn/uc/system/webjsp/resetpwd/new', data).then((res) => {
                if(res.data.code == 200) {
                    location.replace(`/complaint/step3?account=${this.account}&resetId=${res.data.value.resetId}`);
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
                    location.replace(`/complaint/step3?account=${this.account}&resetId=${res.data.value.resetId}`);
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
                            location.href = location.origin + '/complaint';
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
                            location.href = location.origin + '/complaint';
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
                        location.href = location.origin + '/complaint';
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
          location.replace('/complaint')
      }
  }
}
</script>

<style lang="scss">
    @import '../../assets/base_m.scss';
    .footer {
        z-index: 2;
    }
    .modal {
        position: fixed !important;
    }
    .mask {
        position: fixed;
    }
    .complaint_select_type {
        .mz_checkbox {
            vertical-align: middle;
            float: right;
        }
        .title {
            text-align: center;
        }
        .bar-text {
            margin-top: px2vw(126);
            .complaint-text {
                font-size: 18px;
                color: #000000;
                letter-spacing: 0;
                line-height: px2vw(63);
                margin: 0 auto;
                font-weight: 600;
                text-align: center;
            }
        }
        
        .content-form {
            &.reset-phone {
                margin-top: px2vw(60);
            }
            .checkbox-bar {
                text-align: left;
                height: px2vw(216);
                padding: px2vw(54) px2vw(48);
                box-sizing: border-box;
                .checkbox-option {
                    display: inline-block;
                    vertical-align: middle;
                    .option-desc {
                        opacity: 0.4;
                        font-weight: 500;
                        font-size: 12px;
                        margin-top: px2vw(9);
                    }
                    .option-name {
                        font-weight: 500;
                        font-size: 16px;
                    }
                }
            }
            .section {
                font-size: 20px;
                color: #000000;
                font-weight: 600;
                margin-left: auto;
                margin-right: auto;
                .bar-input {
                    width:100%;
                    display: inline-block;  
                    vertical-align: middle;
                    height: px2vw(156);
                    padding: 0 px2vw(48);
                    padding-top: px2vw(72);
                    box-sizing: border-box;
                }
                
                .section-title {
                    font-size: 12px;
                    background-color: #f2f2f2;
                    height: px2vw(108);
                    line-height: px2vw(108);
                    padding: 0 px2vw(48);
                    text-align: left;
                    p {
                        opacity: 0.4;
                    }
                }
                .extra {
                    width: px2vw(984);
                    border: none;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    margin: 0 auto;
                    margin-top: px2vw(72);
                    padding-bottom: px2vw(27);
                    input {
                        border: none;
                        width: 100%;
                        font-size: 16px;
                        line-height: 20px;
                        height: 20px;
                        vertical-align: bottom;
                        display: inline-block;
                        &:disabled {
                            background-color: #ffffff;
                        }
                    }   
                    .extra-tips {
                        font-size: 14px;
                        color: #DE3131;
                        margin-top: 10px;
                    }
                }
            }
        }
        .content-btn {
            margin-top: px2vw(449);
            &.changePhone {
                margin-top: px2vw(794);
            }
            .btn-back,.btn-next {
                display: inline-block;
                width: px2vw(396);
                margin-top: 0;  
            }
            .btn-next {
                &.long-btn {
                    width: px2vw(720);
                }
            }
            .btn-back {
                margin-right: 12px;
            }
        }
    }
</style>
