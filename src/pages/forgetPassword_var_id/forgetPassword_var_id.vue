<template>
    <div id="app">
        <mzheader :link="headerLink"></mzheader>
        <h1 class="title">{{useLang.title}}</h1>
        <mzprogress :steps="useStep" :actived="2" size="126"></mzprogress>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.accountHolder" :type="'text'" :label="useLang.accountLabel" v-model="cardNumber" @finished="handleBlur" ref="idInput" @changeinp="handleChange"></mzinput>
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
                        <btn :type="'blue'" :text="useLang.modalBtn" @clicked="closeModal"></btn>
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
import Axios from 'axios';
import mzfooter from '../../components/footer/footer.vue';
import { getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_var_id, forgetPwdStep, modalLang } from '../../assets/lang.js';

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
    @import '../../assets/base.scss';
    .content-form {
        .section {
            .bar-input, .bar-question {
                width: 433px;
                display: inline-block;  
                vertical-align: middle;
            }
        }
    }
</style>
