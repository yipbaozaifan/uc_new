<template>
    <div id="app">
        <mzheader :link="headerLink"></mzheader>
        <h1 class="title">{{useLang.title}}</h1>
        <mzprogress :steps="useStep" :actived="1" size="126"></mzprogress>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.accountHolder" :type="'account'" :label="useLang.accountLabel" v-model="account" ref="accountInput"></mzinput>
                </div>
                <a class="link"></a>
            </div>
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="useLang.varCodeHolder" :type="'imgCode'" :label="useLang.varCodeLabel" v-model="varCode" ref="kapkeyInput"></mzinput>
                </div>
                <a class="link"></a>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="next"></btn>
            </div>
            <a href="https://i.flyme.cn/appeal" class="link">{{useLang.complaintLink}}</a>
        </div>
        <div class="mask" v-show="showModal">
        </div>
        <mz-modal :title="useLang.modalTitle" v-show="showModal" @close="closeModal">
            <div class="modal-main" >
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
import mzfooter from '../../components/footer/footer.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal.vue';
import { getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_index, forgetPwdStep } from '../../assets/lang.js';

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
      account: '',
      varCode: '',
      showModal: false,
      message: '',
      languageObject: forgetPwd_index,
      steps: forgetPwdStep,
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
            this.$refs.accountInput.showInputTips('请输入flyme账号');
            return;
        }
        if (this.varCode === '') {
            this.$refs.kapkeyInput.showInputTips('请输入验证码');
            return;
        }
        let data = {
            kapkey: this.varCode,
            account: account,
        }
        axios.post('/uc/system/webjsp/forgetpwd/checkAccount', data).then((res) => {
            if (res.data.code !== "200") {
                this.showModal = true;
                this.message = res.data.message;
                this.$refs.kapkeyInput.getImageKey();
            } else {
                location.href = res.data.value;
            }
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
    @import '../../assets/base.scss';
    .title {
        text-align: center;
        width: auto;
    }
    .content-form {
        .section {
            .bar-input {
                width: 433px;
                display: inline-block;
                vertical-align: middle;
            }
            .link {
                width: 110px;
            }
        }
    }
    .modal-tips {
        opacity: 0.4;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0;
        text-align: center;
        line-height: 19px;
        width: 317px;
        margin: 0 auto;
    }
    .modal-btn-container {
        width: 100%;
        margin-top: 50px;
        .modal-btn {
            width: 140px;
            margin: 0 auto;
        }
    }
</style>
