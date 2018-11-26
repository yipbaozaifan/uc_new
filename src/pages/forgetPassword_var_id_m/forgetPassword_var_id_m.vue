<template>
    <div id="app">
        <div class="steps-warp">
            <mzprogress :steps="useStep" :actived="2" size="48" line-length="128"></mzprogress>
        </div>
        <h1 class="title">{{useLang.title_m}}</h1>
        <div class="content content-form">
            <div class="section">
                <p class="tips">{{useLang.idTips}}</p>
            </div>
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.accountHolder_m" :type="'text'" :label="useLang.accountLabel" v-model="cardNumber" @finished="handleBlur" ref="idInput" @changeinp="handleChange"></mzinput>
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
        <div class="mask" v-show="showModal">
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
                <p class="modal-tips modal-tips-ot">{{useModal.timeout}}</p>
            </div>
        </mz-modal>
    </div>
</template>

<script>
import mzprogress from '../../components/progress/progress_m.vue';
import btn from '../../components/button/button_m.vue';
import mzinput from '../../components/input/input_m.vue';
import mzModal from '../../components/mzModal/mzModal_m.vue';
import Axios from 'axios';
import { getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_var_id, forgetPwdStep, modalLang } from '../../assets/lang.js';

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
      languageObject: forgetPwd_var_id,
      steps: forgetPwdStep,
      cardNumber: '',
      canSubmit: true,
      account: '',
      message: '',
      showModal: false,
      wrong: false,
      overTime: false,
      modalLangObject: modalLang,
    }
  },
  methods: {
    closeModal() {
        this.showModal = false;
    },
    submit() {
        if (!this.canSubmit) {
            return;
        }
        if(this.wrong) {
            return;
        }
        // 提交验证码
        if (!this.varID(this.cardNumber)) {
            this.$refs.idInput.showInputTips(this.useLang.errorIdNum);
            this.wrong = true;
            return;
        } else {
            this.canSubmit = false;
            Axios.post('/uc/system/webjsp/forgetpwd/isValidIdNumber', {
                account: this.account,
                idNumber: this.cardNumber,
            }).then((res) => {
                if(!res.data) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = location.origin + '/forgetpwd';
                    }, 2000);
                    return;
                }
                if (res.data.code==="200") {
                    if (res.data.value.result) {
                        location.href = '/uc/system/webjsp/forgetpwd/toResetPwd?account=' + this.account;
                    } else {
                        // 显示提示
                        //this.message = res.data.value.tips;
                        //this.showModal = true;
                        this.$refs.idInput.showInputTips(res.data.value.tips);
                        this.canSubmit = true;
                    }
                } else {
                    if ( res.data.code === "500" ) {
                        this.message = res.data.message;
                        this.showModal = true;
                        this.canSubmit = true;
                    }
                }
            }, (err) => {
                this.message = this.useLang.errorTips;
                this.showModal = true;
                this.canSubmit = true;
            })
        }
    },
    handleBlur() {
        if (!this.varID(this.cardNumber)) {
            this.$refs.idInput.showInputTips(this.useLang.errorIdNum);
            this.wrong = true;
        } 
    },
    varID(id) {
        if(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(id) == false){
            return false;
        } else {
            return true;
        }
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
      this.lang = getParams('lang') || this.getCookie('lang') || 'zh_CN';
  }
}
</script>

<style lang="scss">
    @import '../../assets/base_m.scss';
    .content-form {
        .section {
            .bar-input, .bar-question {
                width: 100%;
                display: inline-block;  
                vertical-align: middle;
                height: px2vw(156);
                padding: 0 px2vw(48);
                padding-top: px2vw(72);
                box-sizing: border-box;
            }
            .tips {
                font-size: px2vw(36);
            }
        }
    }
</style>
