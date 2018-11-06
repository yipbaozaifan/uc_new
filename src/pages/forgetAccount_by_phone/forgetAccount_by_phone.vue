<template>
    <div id="app">
        <mzheader></mzheader>
        <h1 class="title">修改登录密码</h1>
        <mzprogress :steps="steps" :actived="2"></mzprogress>
        <div class="content content-form">
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入手机号'" :type="'account'" :label="'手机号：'" @finished="handleBlur"></mzinput>
                </div>
                <a href="" class="link"></a>
            </div>
            <!--<div class="section" v-show="!phoneInput">
                <div class="bar bar-tips">
                    <p class="text-tips">验证码已发送至 +{{inputedPhone}}</p>
                    <a class="change-phone" @click="handleChange">更改验证手机</a>
                </div>
            </div>-->
            <div class="section">
                <div class="bar bar-input">
                    <mzinput :placeholder="'请输入验证码'" :type="'phoneCode'" :label="'验证码：'" ref="varinput" @send="handleSend"></mzinput>
                </div>
                <a href="" class="link"></a>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="'下一页'" @clicked="submit"></btn>
            </div>
            <a href="" class="link">无法收到验证码</a>
        </div>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import mzprogress from '../../components/progress/progress.vue';
import btn from '../../components/button/button.vue';
import mzinput from '../../components/input/input.vue';

export default {
  name: 'app',
  components: {
    mzheader,
    mzprogress,
    btn,
    mzinput,
  },
  data() {
    return {
      steps: [
        {
          name: '输入账号',
        },
        {
          name: '验证',
        },
        {
          name: '重置密码',
        },
      ],
      inputedPhone: '',
      account: '',
    }
  },
  methods: {
    submit() {
        // 提交验证码
    },
    handleBlur(value) {
        console.log('验证手机号',value);
        if (this.varPhone()) {
            this.$refs.varinput.allowSend();
        }
    },
    varPhone() {
        // 判断输入手机号是否为绑定的手机
        return true;
    },
    handleSend() {
        // 获取验证码
        console.log('获取验证码')
        this.$refs.varinput.changeState();
    },
    getParam(name) {

    }
  },
  mounted() {
      //this.$refs.varinput.changeState('get');
      console.log(this.route);
  }
}
</script>

<style lang="scss">
    .title {
        margin: 0px auto;
        height: 35px;
        margin-top: 55px;
        overflow: hidden;
        width: 158px;
        font-size: 26px;
        color: #010101;
    }
    .content-form {
        .section {
            width: 100%;
            text-align: center;
            margin: 0 auto;
            margin-bottom: 20px;
            .bar-input {
                width: 360px;
                display: inline-block;  
                vertical-align: middle;
            }
            .link {
                margin-left: 20px;
                width: 64px;
            }
            .text-tips {
                font-size: 17px;
                width: 360px;
                margin: 0 auto;
                display: inline-block;
                text-align: right;
            }
            .change-phone{
                margin-left: 10px;
            }
        }
    }
    .btn-next {
        width: 200px;
        margin: 0 auto;
    }
    .link {
        display: inline-block;
        vertical-align: middle;
        color: #387aff;
    }
    .content-btn {
        text-align: center;
    }
</style>
