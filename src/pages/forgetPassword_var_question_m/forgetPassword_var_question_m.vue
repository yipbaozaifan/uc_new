<template>
    <div id="app">
        <div class="steps-warp">
            <mzprogress :steps="useStep" :actived="2" size="48" line-length="128"></mzprogress>
        </div>
        <h1 class="title">{{useLang.title_m}}</h1>
        <div class="content content-form">
            <div v-for="(item, index) in question" :key="index">
                <div class="section section-question">
                    <div class="bar bar-question">
                        <span class="label-question">{{useLang.questionLabel}}{{index + 1}}：</span>
                        <span class="question">{{item.desc}}</span>
                    </div>
                </div>
                <div class="section section-answer">
                    <div class="bar bar-input">
                        <mzinput :placeholder="useLang.answerHolder" :type="'answer'" :label="useLang.answerLabel" v-model="answer[index]" ref="answers"></mzinput>
                    </div>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <div class="btn-next">
                <btn :type="'blue'" :text="useLang.btn" @clicked="submit"></btn>
            </div>
            <a href="https://i.flyme.cn/appeal" class="link" target="_Blank" v-if="lang!=='en_US'">{{useLang.complaintLink}}</a>
        </div>
        <div class="mask" v-show="showModal" @click="closeModal">
        </div>
        <mz-modal :title="useModal.title" v-show="showModal" @close="closeModal">
            <div class="modal-main" v-show="!overTime">
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <a @click="closeModal">{{useModal.okBtn}}</a>
                    </div>
                </div>
            </div>
            <div class="modal-main" v-show="overTime">
                <p class="modal-tips modal-tips-ot">{{useModal.timeout}}</p>
            </div>
        </mz-modal>
    </div>
</template>

<script>
import mzprogress from '../../components/progress/progress_m.vue';
import btn from '../../components/button/button_m.vue';
import mzinput from '../../components/input/input_m.vue';
import mzModal from '../../components/mzModal/mzModal_m.vue';
import Axios from 'axios';
import { getData, getParams } from '../../assets/utils.js';
import globalMethods from '../../assets/mixin.js';
import { forgetPwd_var_question, forgetPwdStep, modalLang } from '../../assets/lang.js';

export default {
  name: 'app',
  components: {
    mzprogress,
    btn,
    mzinput,
    mzModal,
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
      modalLangObject: modalLang,
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
                this.$refs.answers[item].showInputTips(this.useLang.answerHolder);
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
                        location.href = 'https://i.flyme.cn/forgetpwd?lang='+ that.lang;
                    }, 2000);
                    return;
                }
                const result = getData(res.data)
                if (result == null) {
                    this.$refs.answers[0].showInputTips(res.data.message);
                    this.$refs.answers[1].showInputTips(res.data.message);
                    this.canSubmit = true;
                    //this.showModal = true;
                    //this.message = res.data.message;
                }
                if(result){
                    location.href = res.data.value.url; 
                }
            }, (err) => {
                this.canSubmit = true;
                this.message = this.useLang.errorTips;
                this.showModal = true;
                this.showTips = true;
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
            this.$refs.answer[index].showInputTips(this.useLang.answerHolder);
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
          if(!res.data) {
            this.showModal = true;
            this.overTime = true;
            setTimeout(() => {
                location.href = 'https://i.flyme.cn/forgetpwd?lang='+ that.lang;
            }, 2000);
            return;
          }
          if (res.data.value === null) {
              return Promise.reject('no question')
          }
          this.question = res.data.value;
          for (let i = 0; i < this.question.length; i++) {
              this.answer[i] = "";
          }
      }, (err) => {
          this.showModal = true;
          this.message = this.useLang.errorTips;
      }).catch((err) => {
          this.showModal = true;
          this.message = err;
      });
  }
}
</script>

<style lang="scss">
    @import '../../assets/base_m.scss';
    .content-form {
        .section {
            &.section-question {
                margin-bottom: 0;
            }
            .bar-input, .bar-question {
                width: 100%;
                padding: 0 px2vw(48);
                padding-top: px2vw(72);
                display: inline-block;  
                vertical-align: middle;
                box-sizing: border-box;
            }
            .bar-input {
                height: px2vw(156);
            }
            .bar-question {
                line-height: 24px;
                text-align: left;
                font-size: 0;
                .label-question {
                    display: inline-block;
                    text-align: right;
                    vertical-align: top;
                    font-size: 16px;
                }
                .question {
                    display: inline-block;
                    text-align: left;
                    vertical-align: top;
                    font-size: 16px;
                }
            }
        }
    }
    .btn-next {
        margin-top: px2vw(338);
    }
</style>
