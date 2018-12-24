<template>
    <div id="app" class="complaint_select_type">
        <mzheader link="https://www.meizu.com/"></mzheader>
        <h1 class="title">账号申诉</h1>
        <mzprogress :steps="steps" :actived="2" size="96" line-length="600"></mzprogress>
        <div class="main">
            <div class="tips-bar">
                <p class="complaint-text">请填写账号主人的实名信息，全部资料仅用于账号的身份验证</p>
                <p class="complaint-text">不真实的资料同样会导致申诉不过，请您认真填写</p>
            </div>
            <div class="photo-example">
                <h3 class="example-title">照片示例:</h3>
                <div class="example-photo">
                    <img src="./assets/example.png" alt="">
                </div>
                <ul class="example-tips">
                    <li class="example-tips-item">1.本人手持自己的证件照</li>
                    <li class="example-tips-item">2.请确保人物面部清晰</li>
                    <li class="example-tips-item">3.请确保证件信息清晰可识别，不可遮挡或加模糊</li>
                    <li class="example-tips-item">4.格式为jpg、jpeg、png或bmp，大小不超过10M</li>
                </ul>
            </div>
            <div class="content content-form">
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入您的真实姓名" label="真实姓名：" v-model="name" ref="nameInput"></mzinput>
                    </div>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <div class="selection">
                            <span class="select-label">证件类型：</span>
                            <div class="select-content" :class="{
                                'error': typeTips,
                            }">
                                <el-select v-model="choosenType" placeholder="请选择证件类型" @change="typeTips = ''">
                                    <el-option
                                        v-for="item in idCardTypes"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <p class="tips tips-type" v-show="typeTips">{{typeTips}}</p>
                    </div>
                </div>
                <div class="section">
                    <div class="bar bar-input">
                        <mzinput placeholder="请输入证件号码" label="证件号码：" v-model="idNum" ref="idInput"></mzinput>
                    </div>
                </div>
                <div class="section">
                    <div class="upload-pic">
                        <span class="upload-label">证件照片：</span>
                        <div class="upload-bar">
                            <el-upload
                                class="upload-btn"
                                :class="{
                                    'error': uploadTips
                                }"
                                action="https://i.flyme.cn/uc/system/webjsp/resetpwd/uploadIdentifyPhoto"
                                name="file"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="choosenPic" :src="choosenPic" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                        <p class="tips upload-tips" v-show="uploadTips">{{uploadTips}}</p>
                    </div>

                </div>
            </div>
        </div>
        <div class="content content-btn">
            <span class="btn-next">
                <btn :type="'blue'" :text="'下一步'" @clicked="next"></btn>
            </span>
        </div>
        <div class="mask" v-show="showModal">
        </div>
        <mz-modal :title="'提示'" v-show="showModal" @close="closeModal">
            <div class="modal-main" v-show="!overTime">
                <p class="modal-tips">{{message}}</p>
                <div class="modal-btn-container">
                    <div class="modal-btn">
                        <btn :type="'blue'" :text="'确定'" @clicked="closeModal"></btn>
                    </div>
                </div>
            </div>
            <div class="modal-main" v-show="overTime">
                <p class="modal-tips modal-tips-ot">此页面已超时</p>
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
      resetId: '',
      name: '',
      idNum: '',
      showModal: false,
      message: '',
      showValue: '请选择证件类型',
      choosenType: '',
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
                location.replace(`/appeal/step4?account=${this.account}&resetId=${res.data.value.resetId}`)
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
                        location.href = location.origin + '/appeal/step1';
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
    handleAvatarSuccess(res, file) {
        if( res.code == 200 ) {
            this.choosenPic = URL.createObjectURL(file.raw);
            this.photoPath = res.value;
            this.uploadTips = '';
        } else {
            this.uploadTips = "上传失败";
        }
        
    },
    beforeAvatarUpload(file) {
        const isPic = /(jpg|jpeg|png|bmp)$/.test(file.type)
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isPic) {
          this.uploadTips = "文件格式不正确";
        }
        if (!isLt10M) {
          this.uploadTips = '上传头像图片大小不能超过10MB';
        }
        return isPic && isLt10M;
    }
  },
  mounted() {
      this.account = getParams('account') || "";
      this.resetId = getParams('resetId') || "";
      if (!this.resetId || !this.account) {
          location.replace('/appeal')
      }
  }
}
</script>

<style lang="scss">
    @import '../../assets/base.scss';
    .complaint_select_type {
        .title {
            text-align: center;
        }
        .tips-input {
            margin-left: 80px !important; 
        }
        .main {
            width: 660px;
            margin: 0 auto;
            .tips-bar{
                margin-left: 50px;
                margin-top: 60px;
                p {
                    font-size: 16px;
                    color: #000000;
                    letter-spacing: 0;
                    line-height: 24px;
                }
            }
            .content-form {
                margin-top: 40px;
                width: 70%;
                min-height: 266px;
                .section {
                    width: 100%;
                    text-align: left;
                    margin-left: 50px;
                    .tips {
                        font-size: 12px;
                        color: #DE3131;
                        margin-top: 10px;
                        text-align: left;
                        margin-left: 90px;
                    }
                    .selection {
                        font-size: 0px;
                        cursor: pointer;
                        .select-label {
                            display: inline-block;
                            font-size: 16px;
                        }
                        .select-content {
                            width: 290px;
                            display: inline-block;
                            .el-select {
                                width: 290px;
                                &:hover {
                                    .el-input__inner {
                                        border-color: #cccccc;
                                    }
                                }
                                .el-input__inner {
                                    height: 36px;
                                    color: #000000;
                                    border-color: #cccccc;
                                    &::placeholder {
                                        color: #000000;
                                    }
                                    &:focus {
                                        border-color: #cccccc;
                                    }
                                }
                            }
                            &.error {
                                .el-select{
                                    .el-input__inner {
                                        border-color: #DE3131;
                                    }
                                }   
                            }
                        }
                    } 
                    .label-input {
                        width: auto;
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
                                &.error {
                                    border-color: #DE3131;
                                }
                                .avatar-uploader-icon {
                                    display: inline-block;
                                    font-size: 34px;
                                    color: #d8d8d8;
                                    width: 132px;
                                    height: 132px;
                                    line-height: 132px;
                                }
                                .avatar{
                                    width: 132px;
                                    height: 132px;
                                    border-radius: 4px;
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
                .example-title {
                    margin-bottom: 6px;
                }
                .example-photo {
                    margin-bottom: 22px;
                    width: 132px;
                    height: 132px;
                    img {
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        border: 1px solid rgba(0,0,0,0.15);
                    border-radius: 4px;
                    }
                }
                .example-tips {
                    li {
                        white-space: nowrap;
                        margin-bottom: 10px;
                        opacity: 0.4;
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
                width: 290px;
                margin-top: 0;  
            }
            .btn-back {
                margin-right: 12px;
            }
        }
    }
</style>
