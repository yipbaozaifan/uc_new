<template>
    <div id="app">
        <div class="steps-warp">
            <mzprogress :steps="useStep" :actived="1" size="58" line-length="128"></mzprogress>
        </div>
        <h1 class="title">{{useLang.title_m}}</h1>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.accountHolder" :type="'account'" :label="useLang.accountLabel" v-model="account" ref="accountInput"></mzinput>
                </div>
            </div>
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.varCodeHolder" :type="'imgCode'" :label="useLang.varCodeLabel" v-model="varCode" ref="kapkeyInput" :maxlen="6"></mzinput>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="next"></btn>
            </div>
            <a href="https://i.flyme.cn/appeal" class="link" target="_Blank">{{useLang.complaintLink}}</a>
        </div>
        <div class="mask" v-show="showModal">
        </div>
        <mz-modal :title="useModal.title" v-show="showModal" @close="closeModal">
            <div class="modal-main" >
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <a @click="closeModal">{{useModal.okBtn}}</a>
                    </div>
                </div>
            </div>
        </mz-modal>
    </div>
</template>

<script>
import mzprogress from '../../components/progress/progress_m.vue';
import btn from '../../components/button/button_m.vue';
import mzinput from '../../components/input/input_m.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal_m.vue';
import { getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_index, forgetPwdStep, modalLang } from '../../assets/lang.js';

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
      account: '',
      varCode: '',
      showModal: false,
      message: '',
      languageObject: forgetPwd_index,
      steps: forgetPwdStep,
      modalLangObject: modalLang,
    }
  },
  methods: {
    next() {
        let account;
        if (this.$refs.accountInput.showCode) {
            account = '00'+this.$refs.accountInput.countryCode.code+':'+this.account;
        } else {
            account = this.account;
        }
        if (account === '') {
            this.$refs.accountInput.showInputTips(this.useLang.AccountEmptyTips);
            return;
        }
        if (account )
        if (this.varCode === '') {
            this.$refs.kapkeyInput.showInputTips(this.useLang.CodeEmptyTips);
            return;
        }
        let data = {
            kapkey: this.varCode,
            account: account,
        }
        axios.post('/uc/system/webjsp/forgetpwd/checkAccount', data).then((res) => {
            if (res.data.code !== "200") {
                if (res.data.code == "403002") {
                    this.$refs.kapkeyInput.showInputTips(res.data.message);
                } else {
                    this.$refs.accountInput.showInputTips(res.data.message);
                }
                this.$refs.kapkeyInput.getImageKey();
                this.varCode = "";
            } else {
                location.href = res.data.value;
            }
        }, (err) => {
            this.showModal = true;
            this.message = useLang.errorTips;
            this.$refs.kapkeyInput.getImageKey();
        })
    },
    closeModal() {
        this.showModal = false;
        this.message = "";
    },
  },
  mounted() {
      this.$refs.kapkeyInput.getImageKey();
      this.lang = getParams('lang') || 'zh_CN';
  }
}
</script>

<style lang="scss">
    @import '../../assets/base_m.scss';
    .title {
        text-align: center;
        width: auto;
    }
    .content-form {
        .section {
            .bar-input {
                width: 100%;
                height: px2vw(156);
                padding: 0 px2vw(48);
                padding-top: px2vw(72);
                box-sizing: border-box;
            }
        }
    }
    .btn-next {
        margin-top: px2vw(548);
    }
</style>
