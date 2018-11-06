<template>
    <div id="app" class="complaint_select_type">
        <mzheader></mzheader>
        <h1 class="title">账号申诉</h1>
        <mzprogress :steps="steps" :actived="2" size="96" line-length="600"></mzprogress>
        <div class="main">
            <div class="tips-bar">
                <p class="complaint-text">请填写帐号主人的实名信息，全部资料仅用于帐号的身份验证</p>
                <p class="complaint-text">不真实的资料同样会导致申诉不过，请您认真填写</p>
            </div>
            <div class="photo-example">
                <h3 class="example-title">照片实例:</h3>
                <div class="example-photo">
                    <img src="" alt="">
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
                            <div class="select-content">
                                <el-select v-model="choosenType" placeholder="请选择证件类型" >
                                </el-select>
                            </div>
                        </div>
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
                                action="https://jsonplaceholder.typicode.com/posts/"
                                name="file"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="choosenPic" :src="choosenPic" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
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
        <mzfooter ></mzfooter>
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
      name: '',
      idNum: '',
      showModal: false,
      message: '',
      showValue: '请选择证件类型',
      choosenType: '',
      idCardTypes: [

      ],
      hasUpload: false,
      choosenPic: '',
    }
  },
  methods: {
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
    handleAvatarSuccess(res, file) {
        this.choosenPic = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload() {
        
    }
  },
  mounted() {
      this.account = getParams('account');
  }
}
</script>

<style lang="scss">
    @import '../../assets/base.scss';
    .complaint_select_type {
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
                width: 70%;
                min-height: 266px;
                .section {
                    width: 100%;
                    text-align: left;
                    margin-left: 50px;
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
                                .el-input__inner {
                                    height: 36px;
                                    color: #000000;
                                    &::placeholder {
                                        color: #000000;
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
    }
</style>
