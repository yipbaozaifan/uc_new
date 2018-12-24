<template>
    <div id="app" class="complaint_select_type">
        <div class="steps-warp">
            <mzprogress :steps="steps" :actived="2" size="58" line-length="188"></mzprogress>
        </div>
        <h1 class="title">信息验证</h1>
        <div class="main">
            <div class="tips-bar">
                <p class="complaint-text">请填写账号主人的实名信息，全部资料仅用于账号的身份验证</p>
                <p class="complaint-text">不真实的资料同样会导致申诉不过，请您认真填写</p>
            </div>
            <div class="content content-form">
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入您的真实姓名" label="真实姓名：" v-model="name" ref="nameInput"></mzinput>
                    </div>
                </div>
                <div class="section">
                    <div class="selection">
                        <div class="select-content" :class="{
                            'error': typeTips,
                        }" @click="openSelector">
                            <span class="label select-label" v-show="!choosenType">证件类型</span>
                            <span class="label select-label choosen" v-show="choosenType">{{choosenTypeName}}</span>
                        </div>
                    </div>
                    <p class="tips tips-type" v-show="typeTips">{{typeTips}}</p>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入证件号码" label="证件号码：" v-model="idNum" ref="idInput"></mzinput>
                    </div>
                </div>
                <div class="section">
                    <div class="upload-pic">
                        <div class="upload-bar" :class="{
                            'error': uploadTips
                        }">
                            <span class="label upload-label">证件照片</span>
                            <el-upload
                                class="upload-btn"
                                action="https://i.flyme.cn/uc/system/webjsp/resetpwd/uploadIdentifyPhoto"
                                name="file"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <span>上传</span>
                            </el-upload>
                        </div>
                    </div>
                    <p class="tips upload-tips" v-show="uploadTips">{{uploadTips}}</p>
                </div>
                <div class="photo-example">
                    <p class="example-tips">
                        请上传手持本人证证件的彩色照片一张，格式 jpg 或 png，大小 不超过 10MB，请确保人物面部和证件信息清晰无遮挡
                    </p>
                    <div class="example-photo">
                        <h3 class="photo-title">照片示例</h3>
                        <img src="./assets/example.png" alt="">
                    </div>
                    <div class="preview-photo">
                        <h3 class="photo-title">缩略图片</h3>
                        <div class="show-pic">
                            <img v-if="choosenPic" :src="choosenPic" class="avatar">
                            <i v-else class="avatar-uploader-icon">暂未上传</i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <span class="btn-next">
                <btn :type="'blue'" :text="'下一步'" @clicked="next"></btn>
            </span>
        </div>
        <div class="mask" v-show="showModal" @clicked="closeSelector" @touchmove.prevent.stop>
        </div>
        <mz-modal :title="'提示'" v-show="showModal" @close="closeModal">
            <div class="modal-main" v-show="!overTime && !showSelector">
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <a @click="closeModal">确定</a>
                    </div>
                </div>
            </div>
            <div class="modal-main" v-show="overTime">
                <p class="modal-tips modal-tips-ot">此页面已超时</p>
            </div>
            <div class="modal-main selector" v-show="showSelector" @touchmove.prevent.stop>
                <h3 class="selector-head">请选择证件类型</h3>
                <div class="selector-list">
                    <div class="selector-item" v-for="(item, index) in idCardTypes" :key="index" @click="handleSelect(item)" :class="{
                        'last': index == (idCardTypes.length-1)
                    }">
                        <div class="item-name">
                            {{item.label}}
                        </div>
                    </div>
                </div>
            </div>
        </mz-modal>
    </div>
</template>

<script>
import mzprogress from '../../components/progress/progress_m.vue';
import btn from '../../components/button/button_m.vue';
import mzinput from '../../components/input/input_m.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal_m.vue';
import { getParams } from '../../assets/utils.js';

export default {
  name: 'app',
  components: {
    mzprogress,
    btn,
    mzModal,
    mzinput
  },
  data() {
    return {
      steps: [
        {
          name: '申诉类型',
        },
        {
          name: '身份信息',
        },
        {
          name: '申诉材料',
        },
        {
          name: '重置密码',
        },
      ],
      account: '',
      resetId: '',
      name: '',
      idNum: '',
      showModal: false,
      message: '',
      showValue: '请选择证件类型',
      choosenType: '',
      choosenTypeName: '',
      idCardTypes: [
          {
              value: 'id',
              label: '身份证'
          },
          {
              value: 'hongkong_and_macao_pass',
              label: '往来内地通行证'
          },
          {
              value: 'taiwan_pass',
              label: '台胞证'
          },
          {
              value: 'passport',
              label: '护照'
          },
      ],
      hasUpload: false,
      choosenPic: '',
      photoPath: '',
      overTime: false,
      typeTips: '',
      uploadTips: '',
      showSelector: false,
    }
  },
  methods: {
    next() {
        const idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (this.name == "") {
            this.$refs.nameInput.showInputTips('请输入真实姓名');
            return ;
        }
        if (this.choosenType == "") {
            this.typeTips = "请选择证件类型";
            return;
        }
        if (this.idNum == "") {
            this.$refs.idInput.showInputTips('请输入证件号码');
            return;
        }
        if (this.choosenType == "id" && !idReg.test(this.idNum)) {
            this.$refs.idInput.showInputTips('请输入正确的身份证号');
            return;
        }
        if (this.photoPath == ""){
            this.uploadTips = "请先上传图片";
            return;
        }
        const data = {
            realName: this.name,
            idType: this.choosenType,
            idNumber: this.idNum,
            idPhotoPath: this.photoPath,
            resetId: this.resetId,
        }
        axios.post('/uc/system/webjsp/resetpwd/addIdentifyInfo', data).then((res) => {
            if (res.data.code == 200) {
                location.replace(`/complaint/step4?account=${this.account}&resetId=${res.data.value.resetId}`)
            } else {
                if (res.data.message == "非法操作") {
                    return Promise.reject(0);
                } else if (res.data.code == 200016) {
                    this.$refs.idInput.showInputTips('身份信息不符');
                    return Promise.reject(1);
                } else {
                    this.message = res.data.message || "未知错误，请重试";
                    this.showModal = true;
                    return Promise.reject(1);
                }
            }
        }).catch((err) => {
            if (err == 0) { // 页面超时错误
                if (!this.overTime) {
                    this.showModal = true;
                    this.overTime = true;
                    setTimeout(() => {
                        location.href = location.origin + '/complaint/step1';
                    }, 2000);
                }
            } else if (err == 1) { // 已经处理的错误
                console.log(err);
            } else { // 网络错误
                this.message = "网络错误，请重试";
                this.showModal = true;
            }
        })
    },
    closeModal() {
        this.showModal = false;
        this.message = "";
    },
    closeSelector() {
        if (this.showSelector) {
            this.showModal = false;
            this.showSelector = false;
        }
    },
    handleAvatarSuccess(res, file) {
        if( res.code == 200 ) {
            this.choosenPic = URL.createObjectURL(file.raw);
            this.photoPath = res.value;
            this.uploadTips = '';
        } else {
            this.uploadTips = "上传失败";
        }
        
    },
    openSelector() {
        this.showModal = true;
        this.showSelector = true;
    },
    handleSelect(item) {
        this.choosenType = item.value;
        this.choosenTypeName = item.label;
        this.typeTips = '';
        this.closeSelector();
    },
    beforeAvatarUpload(file) {
        const isPic = /(jpg|jpeg|png|bmp)$/.test(file.type)
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isPic) {
          this.message = '文件格式不正确';
          this.showModal = true;
        }
        if (!isLt10M) {
          this.message = '上传头像图片大小不能超过10MB';
          this.showModal = true;
        }
        return isPic && isLt10M;
    }
  },
  mounted() {
      this.account = getParams('account') || "";
      this.resetId = getParams('resetId') || "";
      if (!this.resetId || !this.account) {
          location.replace('/complaint')
      }
  }
}
</script>

<style lang="scss">
    @import '../../assets/base_m.scss';
    .complaint_select_type {
        .title {
            text-align: center;
        }
        .main {
            margin: 0 auto;
            .tips-bar{
                padding: px2vw(48);
                box-sizing: border-box;
                p {
                    opacity: 0.6;
                    font-size: 12px;
                    color: #000000;
                    letter-spacing: 0;
                    line-height: px2vw(54);
                }
            }
            .content-form {
                .section {
                    width: 100%;
                    text-align: left;
                    .bar-input {
                        height: px2vw(156);
                        padding: 0 px2vw(48);
                        padding-top: px2vw(72);
                        box-sizing: border-box;
                    }
                    .tips {
                        font-size: 12px;
                        color: #DE3131;
                        text-align: left;
                        &.tips-type, &.upload-tips {
                            margin-top: 6px;
                            padding: 0 px2vw(48);
                        }
                    }
                    .selection {
                        font-size: 0px;
                        cursor: pointer;
                        padding: 0 px2vw(48);
                        box-sizing: border-box;
                        height: px2vw(156);
                        .select-content {
                            height: 100%;
                            line-height: px2vw(156);
                            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                            &.error {
                                border-color: #DE3131;
                            }
                        }
                        .select-label {
                            display: inline-block;
                            font-size: 16px;
                            opacity: 0.4;
                            &.choosen {
                                opacity: 1;
                            }
                        }
                    } 
                    .label-input {
                        width: auto;
                    }
                    .upload-pic {
                        height: px2vw(156);
                        line-height: px2vw(156);
                        padding: 0 px2vw(48);
                        .upload-label {
                            display: inline-block;
                            vertical-align: top;
                        }
                        .upload-bar {
                            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                            .upload-btn {
                                float: right;
                                margin-top: px2vw(36);
                                display: inline-block;
                                background: #198DED;
                                width: px2vw(144);
                                height: px2vw(72);
                                font-size: 12px;
                                border-radius: px2vw(72);
                                cursor: pointer;
                                text-align: center;
                                line-height: px2vw(72);
                                span {
                                    color: #fff;
                                }
                            }
                            &.error {
                                border-color: #DE3131;
                            }
                        }
                        .upload-original {
                            display: none;
                        }
                    }
                }
            }
            .photo-example {
                padding: 0 px2vw(48);
                .example-photo{
                    display: inline-block;
                    vertical-align: top;
                    img {
                        display: inline-block;
                        border: 1px solid rgba(0,0,0,0.15);
                        width: px2vw(468);
                        height: px2vw(468);
                    }
                }
                .photo-title {
                    font-size: 12px;
                    margin-bottom: px2vw(21);
                }
                .preview-photo {
                    display: inline-block;
                    vertical-align: top;
                    float: right;
                    .show-pic {
                        width: px2vw(468);
                        height: px2vw(468);
                        border: 1px solid rgba(0,0,0,0.15);
                        position: relative;
                        text-align: center;
                        background: rgba(0,0,0,0.03);
                        cursor: pointer;
                        .avatar-uploader-icon {
                            display: inline-block;
                            font-size: 34px;
                            opacity: 0.2;
                            font-size: 12px;
                            color: #000000;
                            width: px2vw(468);
                            height: px2vw(468);
                            line-height: px2vw(468);
                        }
                        .avatar{
                            width: px2vw(468);
                            height: px2vw(468);
                        }
                    }
                }
                .example-tips {
                    opacity: 0.4;
                    font-size: 12px;
                    color: #000000;
                    letter-spacing: 0;
                    margin-bottom: px2vw(39);
                    line-height: px2vw(46);
                }
            }
        }
        .content-btn {
            margin-top: px2vw(39);
            .btn-back,.btn-next {
                display: inline-block;
                width: px2vw(720);
                margin-top: 0;  
            }
            .btn-back {
                margin-right: 12px;
            }
        }
        .modal {
            position: fixed !important;
            margin-top: 0;
            transform: translateY(-50%)
        }
        .mask {
            position: fixed;
        }
        .selector {
            padding: px2vw(48);
            .selector-head {
                opacity: 0.4;
                font-size: 14px;
            }
            .selector-item {
                height: px2vw(168);
                line-height: px2vw(168);
                font-size: 16px;
                border-bottom: 1px solid rgba(0,0,0,0.10);
                &.last {
                    border: none;
                }
            }
        }
    }
</style>
