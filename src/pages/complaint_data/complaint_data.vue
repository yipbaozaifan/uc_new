<template>
    <div id="app">
        <mzheader></mzheader>
        <h1 class="title">账号申诉</h1>
        <mzprogress :steps="steps" :actived="3" size="96" line-length="600"></mzprogress>
        <div class="main step1" v-show="nowStep === 1">
            <div class="tips-bar">
                <p class="complaint-text">为了账号安全，请尽量多提供账号使用资料以帮助我们判断你是号码主人，而非盗号者</p>
                <p class="complaint-text">即使你对某些答案不确定，也可提供你认为正确的答案</p>
            </div>
            <div class="content content-form">
                <div class="section">
                    <span class="label-input">曾用昵称：</span>
                    <div class="content input-content">
                        <div class="bar bar-input" v-for="(item, index) in nicknames" :key="index" :class="{
                            'last-input': index == (nicknames.length-1),
                        }">
                            <div class="outer-input">
                                <input type="text" placeholder="请输入曾用昵称" v-model="nicknames[index]" :disabled="forgotNickname">
                            </div>
                            <div class="operations">
                                <span class="op add" @click="handleAdd('nickname')" v-show="nicknames[index]">+</span>
                                <span class="op sub" @click="handleSub(index, 'nickname')" v-show="index > 0">-</span>
                            </div>
                        </div>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox
                        v-model="forgotNickname"
                        :label="'忘记昵称'"
                        @change="handleForgot('nickname')"
                        ></mz-checkbox>
                    </div>
                </div>
                <div class="section">
                    <span class="label-input">曾用邮箱：</span>
                    <div class="content input-content">
                        <div class="bar bar-input" v-for="(item, index) in emails" :key="index" :class="{
                            'last-input': index == (emails.length-1),
                        }">
                            <div class="outer-input">
                                <input type="text" placeholder="请输入曾用邮箱" v-model="emails[index]" :disabled="forgotMail">
                            </div>
                            <div class="operations">
                                <span class="op add" @click="handleAdd('email')" v-show="emails[index]">+</span>
                                <span class="op sub" @click="handleSub(index, 'email')" v-show="index > 0">-</span>
                            </div>
                        </div>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox
                        v-model="forgotMail"
                        :label="'忘记邮箱'"
                        @change="handleForgot('email')"
                        ></mz-checkbox>
                    </div>
                </div>
                <div class="section">
                    <span class="label-input">曾用手机：</span>
                    <div class="content input-content">
                        <div class="bar bar-input" v-for="(item, index) in phones" :key="index" :class="{
                            'last-input': index == (phones.length-1),
                        }">
                            <div class="outer-input">
                                <input type="text" placeholder="请输入曾用手机" v-model="phones[index]" :disabled="forgotPhone">
                            </div>
                            <div class="operations">
                                <span class="op add" @click="handleAdd('phones')" v-show="phones[index]">+</span>
                                <span class="op sub" @click="handleSub(index, 'phones')" v-show="index > 0">-</span>
                            </div>
                        </div>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox v-model="forgotPhone" :label="'忘记手机'" @change="handleForgot('phones')"
                        ></mz-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <div class="main step2" v-show="nowStep === 2">
            <div class="content content-form used-phone-data">
                <div class="group" v-for="(item, index) in usedPhoneType" :key="index">
                    <div class="section">
                        <div class="bar bar-input">
                            <mzinput placeholder="请输入登陆过该手机的手机型号" label="手机型号：" v-model="item.phoneType" ref="phoneTypeInput"></mzinput>
                            <a class="addInputBtn"></a>
                            <a class="reduceInputBtn"></a>
                        </div>
                        <div class="phone-type-tips" v-show="index == 0">
                            <p>可在“设置>关于手机”中，或手机保修书、包装盒上查看。如 MEIZU 16</p>
                        </div>
                        <div class="forgoten-content">
                            <mz-checkbox v-model="forgotNickname" :label="'未曾登陆过手机'"
                            ></mz-checkbox>
                        </div>
                    </div>
                    <div class="section">
                        <div class="bar bar-input">
                            <mzinput placeholder="请输入登陆过该手机的序列号" label="手机序列号：" v-model="item.phoneId" ref="phoneIdInput"></mzinput>
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
                    <div class="operation">
                        <span class="op add" @click="handleAdd('phoneType')" v-show="item.phoneType || item.phoneId">+</span>
                        <span class="op sub" @click="handleSub(index, 'phoneType')" v-show="index > 0">-</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="main step3" v-show="nowStep === 3">
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
                    <span class="select-label">曾用密码：</span>
                    <div class="content input-content">
                        <div class="bar bar-input" v-for="(item, index) in usedPassword" :key="index">
                            <div class="outer-input">
                                <input type="text" placeholder="请输入曾用密码" v-model="usedPassword[index]">
                            </div>
                            <div class="operations">
                                <span class="op add" @click="addUsedPwd" v-show="usedPassword[index]">+</span>
                                <span class="op sub" @click="subUsedPwd(index)" v-show="index > 0">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <span class="btn-back" v-show="nowStep != 1">
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
      nowStep: 2,
      account: '',
      nicknames: [''],
      emails: [''],
      phones: [''],
      usedPassword: [''],
      showModal: false,
      message: '',
      usedPhoneType:[
          {
              phoneType: '',
              phoneId: '',
          }
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
            this.nowStep -- ;
        }
    },
    next(steps) {
        if (steps < 3) {
            this.nowStep ++ ;
        } else {
            // 提交表单
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
    addUsedPwd() {
        this.usedPassword.push('');
    },
    subUsedPwd(index) {
        this.usedPassword.splice(index,1);
    },
    handleAdd(type) {
        switch(type) {
            case 'nickname': {
                this.nicknames.push('');
                break;
            }
            case 'email': {
                this.emails.push('');
                break;
            }
            case 'phones': {
                this.phones.push('');
                break;
            }
            case 'phoneType': {
                this.usedPhoneType.push({
                    phoneType: '',
                    phoneId: ''
                });
                break;
            }
        }
    },
    handleSub(index, type) {
        switch(type) {
            case 'nickname': {
                this.nicknames.splice(index,1);
                break;
            }
            case 'email': {
                this.emails.splice(index,1);
                break;
            }
            case 'phones': {
                this.phones.splice(index,1);
                break;
            }
            case 'phoneType': {
                this.usedPhoneType.splice(index,1);
                break;
            }
        }
    },
    handleForgot(type) {
        console.log(type);
        switch(type) {
            case 'nickname': {
                this.nicknames=[''];
                break;
            }
            case 'email': {
                this.emails=[''];
                break;
            }
            case 'phones': {
                this.phones=[''];
                break;
            }
            case 'phoneType': {
                break;
            }
            case 'phoneId': {
                break;
            }
        }
    }
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
            &.step1 {
                .content-form {
                    margin-top: 40px;
                }
            }
            .content-form {
                &.used-phone-data {
                    margin-top: 100px;
                    .operation {
                        float: right;
                    }
                }
                .section {
                    width: 100%;
                    text-align: left;
                    .select-label, .label-input {
                        display: inline-block;
                        width: 190px;
                        text-align: right;
                    }
                    .select-content {
                        width: 140px;
                        display: inline-block;
                    }
                    .input-content {
                        display: inline-block;
                        width: auto;
                        .bar-input {
                            margin-bottom: 20px;
                            &.last-input {
                                margin-bottom: 0;
                            }
                            .outer-input {
                                width: 256px;
                                border: 1px solid rgba(0,0,0,0.15);
                                border-radius: 5px;
                                display: inline-block;
                                padding: 9px 14px;
                                height: 20px;
                                vertical-align: middle;
                                input {
                                    font-size:14px;
                                    line-height: 20px;
                                    height: 20px;
                                    display: inline-block;
                                }
                            }
                            .operations {
                                display: inline-block;
                                margin-left: 10px;
                                vertical-align: middle;
                                .op {
                                    display: inline-block;
                                    width: 26px;
                                    height: 26px;
                                    &.add {
                                        margin-right: 6px;
                                    }
                                }
                            }
                        }
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
                        margin-left: 195px;
                        font-size: 14px;
                        opacity: 0.4;
                        margin-top: 8px;
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
            margin-top: 80px;
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
