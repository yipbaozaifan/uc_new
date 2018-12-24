<template>
    <div id="app">
        <mzheader link="https://www.meizu.com/"></mzheader>
        <h1 class="title">账号申诉</h1>
        <p class="complaint-text">我们会人工审核你提交的信息，并在三个工作日内将结果发送到安全手机</p>
        <p class="complaint-text">请尽可能多地提供以下资料，资料越充足，申诉通过的成功率则越高</p>
        <p class="complaint-text-gray">需要的信息：账号信息、使用历史、手机设备信息、身份证件信息、手持身份证照片</p>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入手机号/用户名'" :type="'account'" :label="'Flyme 账号：'" v-model="account" ref="accountInput"></mzinput>
                </div>
                <a class="link"></a>
            </div>
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入验证码'" :type="'imgCode'" :label="'验证码：'" v-model="varCode" ref="kapkeyInput" :maxlen="6"></mzinput>
                </div>
                <a class="link"></a>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="'下一步'" @clicked="next"></btn>
            </div>
        </div>
        <div class="mask" v-show="showModal">
        </div>
        <mz-modal title="提示" v-show="showModal" @close="closeModal">
            <div class="modal-main" >
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <btn type="blue" text="确定" @clicked="closeModal"></btn>
                    </div>
                </div>
            </div>
        </mz-modal>
        <mzfooter now-lang="简体中文" lang-menu-item="简体中文"></mzfooter>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import btn from '../../components/button/button.vue';
import mzinput from '../../components/input/input.vue';
import mzfooter from '../../components/footer/footer.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal.vue';

export default {
  name: 'app',
  components: {
    mzheader,
    btn,
    mzinput,
    mzModal,
    mzfooter
  },
  data() {
    return {
      account: '',
      varCode: '',
      showModal: false,
      message: '',
    }
  },
  methods: {
    next() {
        let account;
        if (this.$refs.accountInput.showCode) {
            account = '00'+this.$refs.accountInput.countryCode.code+":"+this.account.trim();
        } else {
            account = this.account.trim();
        }
        if (account === '') {
            this.$refs.accountInput.showInputTips('请输入账号');
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
        axios.post('/uc/system/webjsp/resetpwd/checkAccount', data).then((res) => {
            if (res.data.code !== "200") {
                if (res.data.code == "403002") {
                    this.$refs.kapkeyInput.showInputTips(res.data.message);
                } else {
                    this.$refs.accountInput.showInputTips(res.data.message);
                }
                this.$refs.kapkeyInput.getImageKey();
            } else {
                location.replace('/appeal/step2?account=' + res.data.value.account)
            }
        }, (err) => {
            this.showModal = true;
            this.message = '网络错误，请重试';
            this.$refs.kapkeyInput.getImageKey();
        })
    },
    closeModal() {
        this.showModal = false;
        this.message = "";
    }
  },
  mounted() {
      this.$refs.kapkeyInput.getImageKey();
  }
}
</script>

<style lang="scss">
    @import '../../assets/base.scss';
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
                margin-top: 8px;
            }
        }
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
