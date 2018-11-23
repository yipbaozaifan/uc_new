<template>
    <div id="app">
        <mzheader :link="headerLink"></mzheader>
        <h1 class="title">{{useLang.title}}</h1>
        <mzprogress :steps="useStep" :actived="2" size="126"></mzprogress>
        <div class="content content-form">
            <div class="section">
                <p class="tips">{{useLang.contactTips}}</p>
            </div>
            <div class="section">
                <div class="contact-container">
                    <span class="contact-item" v-for="(item,index) in contactList" :key="index" @click="choosen(index)" :class="{'choosen': choosenName.indexOf(index) > -1}">{{item}}</span>
                </div>
                <div class="container replace-container">
                    <a @click="replaceList" class="replace" v-show="leftCount > 0">{{useLang.changeList+' ('+leftCount + useLang.times}}</a>
                    <a class="replace forbid" v-show="leftCount <= 0">{{useLang.changeList+' (0)'}}</a>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next" @click="handleSubmit">
                <btn :type="choosenName.length == 3?'blue':'gray'" :text="useLang.btn"></btn>
            </div>
            <a href="https://i.flyme.cn/appeal" class="link" target="_Blank" v-if="lang!=='en_US'">{{useLang.complaintLink}}</a>
        </div> 
        <div class="mask" v-show="showModal">
        </div>
        <mz-modal :title="useLang.modalTitle" v-show="showModal" @close="closeModal">
            <div class="modal-main" v-show="!overTime">
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <btn :type="'blue'" :text="useLang.modalBtn" @clicked="closeModal"></btn>
                    </div>
                </div>
            </div>
            <div class="modal-main" v-show="overTime">
                <p class="modal-tips modal-tips-ot">{{useModal.timeout}}</p>
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
import mzModal from '../../components/mzModal/mzModal.vue';
import Axios from 'axios';
import mzfooter from '../../components/footer/footer.vue';
import { getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_var_contact, forgetPwdStep, modalLang } from '../../assets/lang.js';

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
      languageObject: forgetPwd_var_contact,
      steps: forgetPwdStep,
      contactList: [],
      choosenName:[],
      account: '',
      leftCount: 10,
      leftMatch: 5,
      message:"",
      showModal: false,
      hasSubmit: false,
      overTime: false,
      modalLangObject: modalLang,
    }
  },
  methods: {
    closeModal() {
        if (this.leftMatch <= 0) {
            location.href = "/uc/system/webjsp/contact/toFailContact?account=" + this.account;
        }
        this.showModal = false;
    },
    handleSubmit() {
        // 提交联系人列表
        if (this.hasSubmit) {
            return
        }
        if (this.choosenName.length<3) {
            //this.message = "请你选择三个与你有关联的联系人";
            //this.showModal = true;
            return;
        }

        if (this.leftMatch <= 0) {
            this.message = this.useLang.noChances;
            this.showModal = true;
            return
        }

        let choosenContact = '';
        for (let i=0; i<this.choosenName.length; i++) {
            choosenContact += this.contactList[this.choosenName[i]]+',';
        }
        this.hasSubmit = true;
        Axios.post('/uc/system/webjsp/forgetpwd/isValidUserContact', {
            account: this.account,
            contactNames: choosenContact.slice(0, -1),
        }).then((res) => {
            if (res.data.code === "403010") {
                location.href = "/uc/system/webjsp/contact/toFailContact?account=" + this.account;
            }
            if (res.data.code === "200") {
                if (res.data.value.result) {
                    this.leftMatch = res.data.value.leftCount;
                    location.href = '/uc/system/webjsp/forgetpwd/toResetPwd?account=' + this.account;
                } else {
                    this.message = res.data.value.tips;
                    this.leftMatch = res.data.value.leftCount;
                    this.showModal = true;
                    this.hasSubmit = false;
                }
            } else {
                if (!res.data) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = location.host + '/forgetpwd';
                    }, 2000)
                    return;
                }
                this.message = res.data.message;
                this.showModal = true;
                this.hasSubmit = false;
            }
        })
    },
    choosen(index) {
        if (this.choosenName.indexOf(index) > -1) {
            let temp = this.choosenName.indexOf(index);
            this.choosenName.splice(temp, 1);
        } else {
            if (this.choosenName.length < 3) {
                this.choosenName.push(index);
            } 
        }
    },
    getContactList() {
        /*if (this.account === 0) {
            location.href = '/uc/system/webjsp/forgetpwd/fail_contact?account=' + this.account;
        }*/
        return Axios.post('/uc/system/webjsp/forgetpwd/listContactByAccount', {
            account: this.account
        });
    },
    replaceList() {
        // 清空已选，重新获取
        this.choosenName = [];
        this.getContactList().then((res) => {
            if(!res.data) {
                this.showModal = true;
                this.overTime = true;
                setTimeout(() => {
                    location.href = location.host + '/forgetpwd';;
                }, 2000);
                return;
            }
          if (res.data.code === "200") {
              this.contactList = res.data.value.contacts;
              this.leftCount = res.data.value.leftCount;
          } else {
              if (res.data.code === "403010") {
                  location.href = "/uc/system/webjsp/contact/toFailContact?account=" + this.account;
              } else {
                  this.message = res.data.message;
                  this.showModal = true; 
              }
          }
      }, (err) => {
          this.message = this.useLang.errorTips
          this.showModal = true;
      });
    },
  },
  mounted() {
      this.account = getParams('account');
      this.lang = getParams('lang') || this.getCookie('lang') || 'zh_CN';
      this.replaceList();
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
            .tips {
                font-size: 14px;
            }
            .replace-container {
                width: 600px;
                margin: 0 auto;
                .replace {
                    cursor: pointer;
                    float: right;
                    margin-right: 22px;
                    color: #387aff;
                    &.forbid {
                        color: #cccccc;
                    }
                }
            }
            
            .contact-container {
                width: 600px;
                margin: 0 auto;
                .contact-item {
                    display: inline-block;
                    width: 120px;
                    height: 36px;
                    line-height: 36px;
                    border-radius: 4px;
                    margin: 0 11px;
                    margin-bottom: 22px;
                    border: 1px #cccccc solid;
                    cursor: pointer;
                    white-space: nowrap;
                    overflow: hidden;
                    &.choosen {
                        background-color: #387aff;
                        border: 1px #387aff solid;
                        color: #ffffff;
                    }
                }
            }
        }
    }
</style>
