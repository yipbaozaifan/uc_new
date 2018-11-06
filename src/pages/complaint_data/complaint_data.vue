<template>
    <div id="app">
        <mzheader></mzheader>
        <h1 class="title">账号申诉</h1>
        <mzprogress :steps="steps" :actived="3" size="96" line-length="600"></mzprogress>
        <div class="main" v-show="nowStep === 1">
            <div class="tips-bar">
                <p class="complaint-text">为了账号安全，请尽量多提供账号使用资料以帮助我们判断你是号码主人，而非盗号者</p>
                <p class="complaint-text">即使你对某些答案不确定，也可提供你认为正确的答案</p>
            </div>
            <div class="content content-form">
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入曾经用过的昵称" label="曾用昵称：" v-model="nicknames[0]" ref="nicknameInput"></mzinput>
                        <a class="addInputBtn"></a>
                        <a class="reduceInputBtn"></a>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox
                        v-model="forgotNickname"
                        :label="'忘记昵称:'"
                        ></mz-checkbox>
                    </div>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入曾经用过的邮箱" label="曾用邮箱：" v-model="emails[0]" ref="idInput"></mzinput>
                        <a class="reduceInputBtn"></a>
                        <a class="addInputBtn"></a>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox
                        v-model="forgotMail"
                        :label="'忘记邮箱:'"
                        ></mz-checkbox>
                    </div>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入曾经用过的邮箱" label="曾用手机：" v-model="phones[0]" ref="idInput"></mzinput>
                        <a class="reduceInputBtn"></a>
                        <a class="addInputBtn"></a>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox
                        v-model="forgotPhone"
                        :label="'忘记手机:'"
                        ></mz-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <div class="main" v-show="nowStep === 2">
            <div class="content content-form used-phone-data">
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入登陆过该手机的手机型号" label="手机型号：" v-model="nicknames[0]" ref="phoneTypeInput"></mzinput>
                        <a class="addInputBtn"></a>
                        <a class="reduceInputBtn"></a>
                    </div>
                    <div class="phone-type-tips">
                        <p>可在“设置>关于手机”中，或手机保修书、包装盒上查看。如 MEIZU 16</p>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox
                        v-model="forgotNickname"
                        :label="'未曾登陆过手机'"
                        ></mz-checkbox>
                    </div>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入登陆过该手机的序列号" label="手机序列号：" v-model="phones[0]" ref="phoneIdInput"></mzinput>
                        <a class="reduceInputBtn"></a>
                        <a class="addInputBtn"></a>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox
                        v-model="forgotPhone"
                        :label="'找不到序列号'"
                        ></mz-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <div class="main" v-show="nowStep === 3">
            <div class="content content-form">
                <div class="section">
                    <span class="select-label">账号注册时间：</span>
                    <div class="date-picker">
                        <el-date-picker
                            v-model="RegTime"
                            type="date"
                            placeholder="选择注册日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="section">
                    <span class="select-label">注册地：</span>
                    <div class="select-content">
                        <el-select v-model="RegLand[0]" placeholder="请选择省份">
                        </el-select>
                    </div>
                    <div class="select-content">
                        <el-select v-model="RegLand[1]" placeholder="请选择城市">
                        </el-select>
                    </div>
                </div>
                <div class="section">
                    <span class="select-label">常用地：</span>
                    <div class="select-content">
                        <el-select v-model="UsedLand[0]" placeholder="请选择省份">
                        </el-select>
                    </div>
                    <div class="select-content">
                        <el-select v-model="UsedLand[1]" placeholder="请选择城市">
                        </el-select>
                    </div>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <span class="select-label">曾用密码：</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <span class="btn-back">
                <btn :type="'white'" :text="'上一步'" @clicked="back(nowStep)"></btn>
            </span>
            <span class="btn-next">
                <btn :type="'blue'" :text="'下一步'" @clicked="next(nowStep)"></btn>
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
      nowStep: 3,
      account: '',
      nicknames: [''],
      emails: [''],
      phones: [''],
      showModal: false,
      message: '',
      showValue: '请选择证件类型',
      choosenType: '请选择证件类型',
      idCardTypes: [

      ],
      forgotNickname: false,
      forgotMail: false,
      forgotPhone: false,
      hasUpload: false,
      choosenPic: null,
      RegTime: '',
      showUsedPwd: '',
      RegLand: ['',''],
      UsedLand: ['', ''],
    }
  },
  methods: {
    back(steps) {
        if (steps > 1) {
            steps -- ;
        }
    },
    next(steps) {
        if (steps < 3) {
            steps ++ ;
        }
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
                    .select-content {
                        width: 140px;
                        display: inline-block;
                    }
                    .date-picker {
                        width: 292px;
                        display: inline-block;
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
