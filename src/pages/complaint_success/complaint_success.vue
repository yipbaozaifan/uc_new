<template>
    <div id="app">
        <mzheader></mzheader>
        <h1 class="title">账号申诉</h1>
        <mzprogress :steps="steps" :actived="4" size="96" line-length="600"></mzprogress>
        <div class="main">
            <div class="content content-form">
                <div class="section">
                    <div class="success-container">
                        <img src="./assets/success.png" alt="">
                        <p class="success-title">申诉材料提交成功</p>
                        <p class="success-text">结果将在3个工作日内完成，请留意手机短信</p>
                    </div>
                </div>
            </div>
        </div>
        <mzfooter now-lang="简体中文" lang-menu-item="简体中文"></mzfooter>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import mzprogress from '../../components/progress/progress.vue';
import btn from '../../components/button/button.vue';
import mzfooter from '../../components/footer/footer.vue';
import { getParams } from '../../assets/utils.js';

export default {
  name: 'app',
  components: {
    mzheader,
    mzprogress,
    btn,
    mzfooter,
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
    }
  },
  methods: {

  },
  mounted() {
      this.account = getParams('account');
  }
}
</script>

<style lang="scss">
    @import '../../assets/base.scss';
    .content-form {
        .section {
            width: 100%;
            text-align: center;
            margin: 0 auto;
            margin-bottom: 20px;
            .success-container {
                text-align: center;
                img {
                    width: 337px;
                }
                .success-title {
                    font-size: 20px;
                    color: #000000;
                    margin-top: 21px;
                    margin-bottom: 6px;
                    letter-spacing: 0;
                }
                .success-text {
                    opacity: 0.4;
                    font-size: 14px;
                    color: #000000;
                    letter-spacing: 0;
                }
            }
        }
    }
</style>
