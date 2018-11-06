<template>
    <div id="app" class="complaint_select_type">
        <mzheader></mzheader>
        <h1 class="title">账号申诉</h1>
        <mzprogress :steps="steps" :actived="1" size="96" line-length="600"></mzprogress>
        <div class="content content-form">
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
                    <div class="extra">
                        <input type="text" v-model="reason" placeholder="如账号被盗，密保信息被修改" :disabled="!otherReason" @input="handleInput">
                        <!--<span v-show="showExtraTips" class="extra-tips">{{extraTips}}</span>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <span class="btn-next">
                <btn :type="'blue'" :text="'下一步'" @clicked="next"></btn>
            </span>
        </div>
        <div class="mask" v-show="showModal">
        </div>
        <mz-modal :title="'提示'" v-show="showModal" @close="closeModal">
            <div class="modal-main" >
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <btn :type="'blue'" :text="'确定'" @clicked="closeModal"></btn>
                    </div>
                </div>
            </div>
        </mz-modal>
        <mzfooter></mzfooter>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import mzprogress from '../../components/progress/progress.vue';
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
    mzfooter
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
      extraTips: ''
    }
  },
  methods: {
    next() {
        
        axios.post('https://i.flyme.cn/uc/system/webjsp/resetpwd/new', {
            account: this.account,
            vCodeTypeValue: 22,
            clearSecurityQuestion: this.resetQuestions ? 1 : 0,
            clearSecurityPhone: this.resetPhone ? 1 : 0,
            otherReason: reason,
            resetPassword: 1,
        }).then((res) => {
            if(res.data.code == 200) {
                location.replace('/complaint/complaint_var_id?resetId=' + res.data.value.resetId)
            } else {
                this.showModal = true;
                this.message = res.data.message || "未知错误，请重试";
            }
        }, (err) => {
            this.showModal = true;
            this.message = "网络错误，请重试";
        })
    },
    handleInput() {
        this.showExtraTips = false;
        this.extraTips = "";
    },
    closeModal() {
        this.showModal = false;
        this.message = "";
    }
  },
  mounted() {
      this.account = getParams('account');
  }
}
</script>

<style lang="scss">
    @import '../../assets/base.scss';
    .complaint_select_type {
        .title {
            text-align: center;
        }
        .content-form {
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
                .option-desc {
                    opacity: 0.4;
                    font-weight: 500;
                    font-family: MicrosoftYaHei;
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
                    .extra-tips {
                        font-size: 14px;
                        color: #DE3131;
                        margin-top: 10px;
                    }
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
            .btn-back {
                margin-right: 12px;
            }
        }
    }
</style>
