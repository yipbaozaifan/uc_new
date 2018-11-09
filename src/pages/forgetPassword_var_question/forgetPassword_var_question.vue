<template>
    <div id="app">
        <mzheader :link="headerLink"></mzheader>
        <h1 class="title">{{useLang.title}}</h1>
        <mzprogress :steps="useStep" :actived="2" size="126"></mzprogress>
        <div class="content content-form">
            <div v-for="(item, index) in question" :key="index">
                <div class="section section-question">
                    <div class="bar bar-question">
                        <span class="label-question">{{useLang.questionLabel}}{{index + 1}}：</span>
                        <span class="question">{{item.desc}}</span>
                    </div>
                    <a class="link"></a>
                </div>
                <div class="section section-answer">
                    <div class="bar bar-input">
                        <mzinput :placeholder="useLang.answerHolder" :type="'answer'" :label="useLang.answerLabel" v-model="answer[index]" ref="answers"></mzinput>
                    </div>
                    <a class="link"></a>
                </div>
            </div>
            <!--<div class="section" v-show="!phoneInput">
                <div class="bar bar-tips">
                    <p class="text-tips">验证码已发送至 +{{inputedPhone}}</p>
                    <a class="change-phone" @click="handleChange">更改验证手机</a>
                </div>
            </div>-->
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="submit"></btn>
            </div>
            <a href="https://i.flyme.cn/appeal" class="link" target="_Blank">{{useLang.complaintLink}}</a>
        </div>
        <div class="mask" v-show="showModal" @click="closeModal">
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
                <p class="modal-tips modal-tips-ot">此页面已失效</p>
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
import { getData, getParams } from '../../assets/utils.js';
import mzfooter from '../../components/footer/footer.vue';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_var_question, forgetPwdStep } from '../../assets/lang.js';

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
      languageObject: forgetPwd_var_question,
      steps: forgetPwdStep,
      inputedPhone: '',
      question:[{desc:''},{desc:''}],
      answer: [],
      canSubmit: true,
      account: '',
      showModal: false,
      message: '',
      overTime: false,
    }
  },
  methods: {
    closeModal() {
        this.showModal = false;
    },
    submit() {
        // 提交密保答案
        const that = this;
        let emptyIndex = [];
        if (!this.canSubmit) {
            return;
        }
        for (let i= 0; i<this.answer.length; i++) {
            if (this.answer[i] === "") {
                emptyIndex.push(i);
            }
        }
        if (emptyIndex.length>0) {
            emptyIndex.forEach((item)=>{
                this.$refs.answers[item].showInputTips('请输入密保答案');
            })
            return
        } else {
            this.canSubmit = false;
            Axios.post('/uc/system/webjsp/forgetpwd/isValidUserAnswer', {
                account: this.account,
                questionCode1: this.question[0].value,
                questionCode2: this.question[1].value,
                answer1: this.answer[0],
                answer2: this.answer[1],
            }).then((res) => {
                if(!res.data) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = 'https://i.flyme.cn/forgetpwd';
                    }, 2000);
                    return;
                }
                const result = getData(res.data)
                if (result == null) {
                    this.canSubmit = true;
                    this.showModal = true;
                    this.message = res.data.message;
                }
                if(result){
                    location.href = res.data.value.url; 
                }
            });
        }
    },
    getQuestionList() {
        return Axios.post('/uc/system/question/listByAccount', {
            account: this.account,
        })
    },
    handleBlur(index) {
        // 检测是有有空答案
        if (answer[index] === "") {
            this.$refs.answer[index].showInputTips('请输入密保答案');
        }
    },
  },
  mounted() {
      //this.$refs.varinput.changeState('get');
      this.account = getParams('account');
      this.lang = getParams('lang') || 'zh_CN';
      let to = getParams('to');
      if(to == 'phone'){
    	  this.toUrl = '/uc/system/webjsp/forgetpwd/toPhone';
      }else if(to == 'email'){
    	  this.toUrl = '/uc/system/webjsp/forgetpwd/toMail';
      }
      this.getQuestionList().then((res) => {
          if (res.data.value === null) {
              return Promise.reject('no question')
          }
          this.question = res.data.value;
          for (let i = 0; i < this.question.length; i++) {
              this.answer[i] = "";
          }
      }, (err) => {
          this.showModal = true;
          this.message = '网络错误，请稍后重试';
      }).catch((err) => {
          this.showModal = true;
          this.message = err;
      });
  }
}
</script>

<style lang="scss">
    @import '../../assets/base.scss';
    .content-form {
        .section {
            &.section-question {
                margin-bottom: 12px;
            }
            .bar-input, .bar-question {
                width: 433px;
                display: inline-block;  
                vertical-align: middle;
            }
            .bar-question {
                line-height: 24px;
                text-align: left;
                font-size: 0;
                .label-question {
                    display: inline-block;
                    text-align: right;
                    vertical-align: top;
                    width: 143px;
                    font-size: 16px;
                }
                .question {
                    display: inline-block;
                    width: 290px;
                    text-align: left;
                    vertical-align: top;
                    font-size: 16px;
                }
            }
        }
    }
</style>
