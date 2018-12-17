<template>
    <div id="app">
        <h1 class="title">账号申诉</h1>
        <p class="complaint-text-gray">我们会人工审核你提交的信息，并在三个工作日内将结果发送到安全手机，请尽可能多地提供以下资料，资料越充足，申诉通过的成功率则越高</p>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入手机号/用户名'" :type="'account'" v-model="account" ref="accountInput"></mzinput>
                </div>
            </div>
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入验证码'" :type="'imgCode'" v-model="varCode" ref="kapkeyInput" :maxlen="6"></mzinput>
                </div>
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
                        <a @click="closeModal">确定</a>
                    </div>
                </div>
            </div>
        </mz-modal>
    </div>
</template>

<script>
import btn from '../../components/button/button_m.vue';
import mzinput from '../../components/input/input_m.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal_m.vue';

export default {
  name: 'app',
  components: {
    btn,
    mzinput,
    mzModal,
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
        axios.post('/uc/system/webjsp/resetpwd/checkAccount', data).then((res) => {
            if (res.data.code !== "200") {
                if (res.data.code == "403002") {
                    this.$refs.kapkeyInput.showInputTips(res.data.message);
                } else {
                    this.$refs.accountInput.showInputTips(res.data.message);
                }
                this.$refs.kapkeyInput.getImageKey();
            } else {
                location.replace('/complaint/step2?account=' + res.data.value.account)
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
    @import '../../assets/base_m.scss';
     .complaint-text {
            &-gray{
                font-size: 14px;
                color: #000000;
                opacity: 0.6;
                width: px2vw(948);
                margin: 0 auto;
                margin-top: 2px;
                line-height: px2vw(54);
            }
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
</style>
