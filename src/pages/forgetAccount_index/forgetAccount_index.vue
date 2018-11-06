<template>
    <div id="app">
        <mzheader></mzheader>
        <h1 class="title">忘记账号</h1>
        <div class="content content-form">
            <div class="section">
                <div class="container way-container">
                    <i class="logo way-logo way-byphone"></i>
                    <div class="way-main">
                        <p class="way-name">通过曾用手机号找回</p>
                        <p class="way-desc">通过最近一年曾经绑定过的手机号进行验证</p>
                    </div>
                    <div class="bar btn-bar">
                        <btn :type="'white'" :text="'进入'" @clicked="goto"></btn>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="container way-container">
                    <i class="logo way-logo way-bymail"></i>
                    <div class="way-main">
                        <p class="way-name">通过曾用邮箱找回</p>
                        <p class="way-desc">通过最近一年曾经绑定过的邮箱进行验证</p>
                    </div>
                    <div class="bar btn-bar">
                        <btn :type="'white'" :text="'进入'" @clicked="goto"></btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import btn from '../../components/button/button.vue';

export default {
  name: 'app',
  components: {
    mzheader,
    btn
  },
  data() {
      return {
      
      }
  },
  methods: {
      goto() {
          
      }
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
            .way-container {
                width: 645px;
                margin: 0 auto;
                height: 94px;
                background: #FFFFFF;
                border: 1px solid rgba(0,0,0,0.20);
                border-radius: 4px;
                text-align: left;
                vertical-align: middle;
                &::before {
                    content: '';
                    height: 94px;
                    display: inline-block;
                    vertical-align: middle;
                }
                .way-logo {
                    display: inline-block;
                    vertical-align: middle;
                    width: 60px;
                    height: 60px;
                    background-size: 100% 100%;
                    &.way-byphone {
                        background-image: url(./assets/phone.png);
                    }
                    &.way-bymail {
                        background-image: url(./assets/email.png);
                    }
                }
                .way-main {
                    vertical-align: middle;
                    display: inline-block;
                }
                .btn-bar {
                    width: 112px;
                    vertical-align: middle;
                    display: inline-block;
                }
            }
        }
    }
</style>
