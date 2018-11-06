<template>
    <div id="app">
        <mzheader></mzheader>
        <h1 class="title">账号申诉</h1>
        <mzprogress :steps="steps" :actived="4" size="96" line-length="600"></mzprogress>
        <div class="main">
            <div class="content content-form">
                <div class="section">
                    <h3 class="section-sub-title">重置密码</h3>
                    <p class="section-tips">重置密码将会在申诉成功后启用，请留意申诉短信通知</p>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入新密码" label="重置密码：" v-model="resetPwd" ref="resetInput" :type="'password'"></mzinput>
                        <a class="addInputBtn"></a>
                        <a class="reduceInputBtn"></a>
                    </div>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请确认输入的密码" label="确认密码：" v-model="repeatPwd" ref="repeatInput" :type="'password'"></mzinput>
                        <a class="reduceInputBtn"></a>
                        <a class="addInputBtn"></a>
                    </div>
                </div>
            </div>
            <div class="content content-form">
                <div class="section">
                    <h3 class="section-sub-title">申诉结果通知</h3>
                    <p class="section-tips">申诉将在3个工作日内完成，并将结果发送至改手机号</p>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入接收手机号" label="结果通知：" v-model="phone" ref="phoneInput" type="account"></mzinput>
                        <a class="addInputBtn"></a>
                        <a class="reduceInputBtn"></a>
                    </div>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入验证码" label="验证码：" v-model="varCode" ref="varInput" :type="'imgCode'"></mzinput>
                        <a class="reduceInputBtn"></a>
                        <a class="addInputBtn"></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <span class="btn-back">
                <btn :type="'white'" :text="'上一步'" @clicked="back"></btn>
            </span>
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
        <mzfooter now-lang="简体中文" lang-menu-item="简体中文"></mzfooter>
    </div>
</template>

<script>
import mzheader from '../../components/header/header.vue';
import mzprogress from '../../components/progress/progress.vue';
import btn from '../../components/button/button.vue';
import mzinput from '../../components/input/input.vue';
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
    mzfooter,
    mzinput
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
      phone: '',
      varCode: '',
      resetPwd: '',
      showModal: false,
      message: '',
      repeatPwd: '',
    }
  },
  methods: {
    back() {
        
    },
    next() {
        
    },
    closeModal() {
        this.showModal = false;
        this.message = "";
    },
    uploadPic() {
        this.$refs.picupload.click();
    },
    reload() {
        
    },
  },
  mounted() {
      this.account = getParams('account');
  }
}
</script>

<style lang="scss">
    @import '../../assets/base.scss';
        .title {
            text-align: center;
        }
        .main {
            width: 660px;
            margin: 0 auto;
            .tips-bar{
                margin-left: 50px;
                margin-top: 60px;
                p {
                    font-family: MicrosoftYaHei;
                    font-size: 16px;
                    color: #000000;
                    letter-spacing: 0;
                    line-height: 24px;
                }
            }
            .content-form {
                margin-top: 40px;
                &.used-phone-data {
                    margin-top: 100px;
                }
                .section {
                    width: 100%;
                    text-align: left;
                    .section-sub-title {
                        font-family: MicrosoftYaHei;
                        font-size: 20px;
                        color: #000000;
                        letter-spacing: 0;
                        width: 450px;
                        margin: 0 auto;
                        margin-bottom: 6px;
                    }
                    .section-tips {
                        width: 450px;
                        margin: 0 auto;
                        opacity: 0.4;
                        font-family: MicrosoftYaHei;
                        font-size: 14px;
                        color: #000000;
                    }
                    .phone-type-tips {
                        width: 268px;
                        margin-left: 195px;
                        margin-top: 8px;
                        p {
                            opacity: 0.4;
                            font-family: MicrosoftYaHei;
                            font-size: 14px;
                            color: #000000;
                            letter-spacing: 0;
                            line-height: 24px;
                        }
                    }
                    .forgoten-content {
                        margin-left: 185px;
                        font-size: 14px;
                        opacity: 0.4;
                        margin-top: 8px;
                    }
                    .bar-input {
                        width: 576px;
                        margin: 0 auto;
                    }
                    .selection {
                        font-size: 0px;
                        cursor: pointer;
                        
                        .select-label {
                            vertical-align: middle;
                            display: inline-block;
                            font-size: 16px;
                        }
                        .select-content {
                            font-size: 14px;
                            line-height: 36px;
                            background: #FFFFFF;
                            border: 1px solid rgba(0,0,0,0.15);
                            border-radius: 4px;
                            display: inline-block;
                            width: 290px;
                            vertical-align: middle;
                            height: 34px;
                            .selected-value {
                                margin-left: 10px;
                            }
                            .arrow {
                                width: 10px;
                                height: 6px;
                                float: right;
                                margin-right: 16px;
                                margin-top: 16px;
                            }
                        }
                    } 
                    .upload-pic {
                        .upload-label {
                            display: inline-block;
                            vertical-align: top;
                        }
                        .upload-bar {
                            display: inline-block;
                            .re-upload {
                                display: inline-block;
                                margin-top: 8px;
                                color: #387AFF;
                                font-size: 16px;
                                cursor: pointer;
                            }
                            .upload-btn {
                                display: block;
                                vertical-align: top;
                                width: 132px;
                                height: 132px;
                                background: #FFFFFF;
                                border: 1px solid rgba(0,0,0,0.15);
                                border-radius: 4px;
                                position: relative;
                                cursor: pointer;
                                .upload-portrait {
                                    display: inline-block;
                                    height: 34px;
                                    width: 2px;
                                    background: #D8D8D8;
                                    border-radius: 8px;
                                    position: absolute;
                                    left: 65px;
                                    top: 49px;
                                }
                                .upload-crosswise {
                                    display: inline-block;
                                    height: 2px;
                                    width: 34px;
                                    background: #D8D8D8;
                                    border-radius: 8px;
                                    position: absolute;
                                    left: 49px;
                                    top: 65px;
                                }
                            }
                        }
                        .upload-original {
                            display: none;
                        }
                    }
                }
            }
            .photo-example {
                width: 30%;
                float: right;
                margin-top: 40px;
                .example-photo {
                    margin-bottom: 22px;
                    width: 132px;
                    height: 132px;
                    img {
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .example-tips {
                    li {
                        white-space: nowrap;
                        margin-bottom: 10px;
                        opacity: 0.4;
                        font-family: MicrosoftYaHei;
                        font-size: 14px;
                        color: #000000;
                        letter-spacing: 0;
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
</style>
