<template>
    <div id="app">
        <mzheader link="https://www.meizu.com/"></mzheader>
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
                            <div class="outer-input" :class="{
                                'error': nicknameTips[index] != ''
                            }">
                                <input type="text" placeholder="请输入曾经用过的昵称" v-model="nicknames[index]" :disabled="forgotNickname" @input="handleInput('nickname', index)">
                            </div>
                            <div class="operations">
                                <span class="op add" @click="handleAdd('nickname')" v-show="index == 0 && nicknames[index] && nicknames.length < 5">&#xe648;</span>
                                <span class="op sub" @click="handleSub(index, 'nickname')" v-show="index > 0">&#xe60b;</span>
                            </div>
                            <p class="tips tips-input" v-show="nicknameTips[index]">{{nicknameTips[index]}}</p>
                        </div>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox
                        v-model="forgotNickname"
                        :label="'忘记昵称'"
                        ></mz-checkbox>
                    </div>
                </div>
                <div class="section">
                    <span class="label-input">曾用邮箱：</span>
                    <div class="content input-content">
                        <div class="bar bar-input" v-for="(item, index) in emails" :key="index" :class="{
                            'last-input': index == (emails.length-1),
                        }">
                            <div class="outer-input" :class="{
                                'error': emailsTips[index] != ''
                            }">
                                <input type="text" placeholder="请输入曾经用过的邮箱" v-model="emails[index]" :disabled="forgotMail" @input="handleInput('email', index)">
                            </div>
                            <div class="operations">
                                <span class="op add" @click="handleAdd('email')" v-show="index == 0 && emails[index] && emails.length < 5">&#xe648;</span>
                                <span class="op sub" @click="handleSub(index, 'email')" v-show="index > 0">&#xe60b;</span>
                            </div>
                            <p class="tips tips-input" v-show="emailsTips[index]">{{emailsTips[index]}}</p>
                        </div>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox
                        v-model="forgotMail"
                        :label="'未绑定过邮箱'"
                        ></mz-checkbox>
                    </div>
                </div>
                <div class="section">
                    <span class="label-input">曾用手机号：</span>
                    <div class="content input-content">
                        <div class="bar bar-input" v-for="(item, index) in phones" :key="index" :class="{
                            'last-input': index == (phones.length-1),
                        }">
                            <div class="outer-input" :class="{
                                'error': phonesTips[index] != ''
                            }">
                                <input type="text" placeholder="请输入曾经用过的手机号" v-model="phones[index]" :disabled="forgotPhone" @input="handleInput('phones', index)" maxlength="11">
                            </div>
                            <div class="operations">
                                <span class="op add" @click="handleAdd('phones')" v-show="index == 0 && phones[index] && phones.length < 5">&#xe648;</span>
                                <span class="op sub" @click="handleSub(index, 'phones')" v-show="index > 0">&#xe60b;</span>
                            </div>
                            <p class="tips tips-input" v-show="phonesTips[index]">{{phonesTips[index]}}</p>
                        </div>
                    </div>
                    <div class="forgoten-content">
                        <mz-checkbox v-model="forgotPhone" :label="'未绑定过手机号'"
                        ></mz-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <div class="main step2" v-show="nowStep === 2">
            <div class="content content-form used-phone-data">
                <div class="group" v-for="(item, index) in usedPhoneType" :key="index" >
                    <div class="section">
                        <span class="label-input">手机型号：</span>
                        <div class="input-content">
                            <div class="bar bar-input">
                                <div class="outer-input" :class="{
                                    'error': phoneTypeTips[index] != ''
                                }">
                                    <input type="text" placeholder="请输入登录过该账号的手机型号" v-model="item.phoneType" :disabled="noLoginPhone" @input="handleInput('phoneType', index)">
                                </div>
                            </div>
                            <p class="tips tips-input" v-show="phoneTypeTips[index]">{{phoneTypeTips[index]}}</p>
                            <div class="phone-type-tips" v-show="index == 0">
                                <p>可在“设置>关于手机”中，或手机保修书、包装盒上查看。如 MEIZU 16</p>
                            </div>
                            <div class="forgoten-content" v-show="index == 0">
                                <mz-checkbox v-model="noLoginPhone" :label="'未曾登录过手机'"
                                ></mz-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="section" v-show="!noLoginPhone">
                        <span class="label-input">手机序列号：</span>
                        <div class="input-content">
                            <div class="bar bar-input">
                                <div class="outer-input" :class="{
                                    'error': phoneIdTips[index] != ''
                                }">
                                    <input type="text" placeholder="请输入登录手机的序列号" v-model="item.phoneId" ref="phoneIdInput" :disabled="item.noPhoneId" @input="handleInput('phoneId', index)">
                                </div>
                            </div>
                            <p class="tips tips-input" v-show="phoneIdTips[index]">{{phoneIdTips[index]}}</p>
                            <div class="forgoten-content">
                                <mz-checkbox
                                v-model="item.noPhoneId"
                                :label="'找不到序列号'"
                                @change="handleNoPhoneId(index)"
                                ></mz-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="operation" v-show="!noLoginPhone">
                        <span class="op add" @click="handleAdd('phoneType')" v-show="index == 0 && (item.phoneType || item.phoneId) && usedPhoneType.length < 5" >&#xe648;</span>
                        <span class="op sub" @click="handleSub(index, 'phoneType')" v-show="index > 0">&#xe60b;</span>
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
                            placeholder="选择注册日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            @change="handleChangeDate">
                        </el-date-picker>
                    </div>
                    <p class="tips tips-selection" v-show="showRegTimeTips">{{dateTips}}</p>
                </div>
                <div class="section">
                    <span class="select-label">注册地：</span>
                    <div class="select-content">
                        <el-select v-model="RegLand[0]" placeholder="请选择省份" @change="RegLand[1] = ''; showRegLandTips = false;step3Ok[1] = true;">
                            <el-option
                                v-for="(item, index) in CityMap"
                                :key="index"
                                :label="item.pn"
                                :value="index">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="select-content">
                        <el-select v-model="RegLand[1]" placeholder="请选择城市" @change="showRegLandTips = false;step3Ok[1] = true;">
                            <el-option
                                v-for="(item, index) in (CityMap[RegLand[0]] ? CityMap[RegLand[0]].cs : [])"
                                :key="index"
                                :label="item.cn"
                                :value="index">
                            </el-option>
                        </el-select>
                    </div>
                    <p class="tips tips-selection" v-show="showRegLandTips">{{regLandTips}}</p>
                </div>
                <div class="section">
                    <span class="select-label">常用地：</span>
                    <div class="selections-warp">
                        <div class="bar selection-bar" v-for="(item, index) in UsedLand" :key="index" :class="{
                            'mt20': index > 0
                        }">
                            <div class="select-content">
                                <el-select v-model="item.p" placeholder="请选择省份" @change="item.c = ''; showUsedLandTips = false;step3Ok[2] = true;">
                                    <el-option
                                        v-for="(p, i) in CityMap"
                                        :key="i"
                                        :label="p.pn"
                                        :value="i">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="select-content">
                                <el-select v-model="item.c" placeholder="请选择城市" @change="showUsedLandTips = false;step3Ok[2] = true;">
                                    <el-option
                                        v-for="(c, i) in (CityMap[item.p] ? CityMap[item.p].cs : [])"
                                        :key="i"
                                        :label="c.cn"
                                        :value="i">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="operations">
                                <span class="op add" v-show="index == 0 && UsedLand.length < 5" @click="handleAdd('usedLand')">&#xe648;</span>
                                <span class="op sub" v-show="index > 0" @click="handleSub(index, 'usedLand')">&#xe60b;</span>
                            </div>
                            <p class="tips tips-selection" v-show="index == 0 && showUsedLandTips">{{usedLandTips}}</p>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <span class="select-label">曾用密码：</span>
                    <div class="content input-content">
                        <div class="bar bar-input" v-for="(item, index) in usedPassword" :key="index">
                            <div class="outer-input">
                                <input type="password" placeholder="请输入曾用密码" v-model="usedPassword[index]" @input="handleInput('password', index)">
                            </div>
                            <div class="operations">
                                <span class="op add" @click="addUsedPwd" v-show="index == 0 && usedPassword[index] && usedPassword.length < 5">&#xe648;</span>
                                <span class="op sub" @click="subUsedPwd(index)" v-show="index > 0">&#xe60b;</span>
                            </div>
                            <p class="tips tips-input" v-show="passwordTips[index]">{{passwordTips[index]}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content content-btn">
            <span class="btn-back" v-show="nowStep != 1">
                <btn :type="'white'" :text="'上一步'" @clicked="back(nowStep)"></btn>
            </span>
            <span class="btn-next" :class="{'long-btn': nowStep == 1}">
                <btn :type="'blue'" :text="'下一步'" @clicked="next(nowStep)"></btn>
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
  },
  watch: {
      noLoginPhone(newValue, oldValue) {
          if (newValue) {
              this.usedPhoneType = [
                  {
                      phoneType: '',
                      phoneId: '',
                      noPhoneId: false,
                  }
              ];
              this.phoneTypeTips = [''];
              this.phoneIdTips = [''];
              this.step2Ok = true;
          }
      },
      forgotNickname(newValue, oldValue) {
          if (newValue) {
              this.nicknames = [''];
              this.nicknameTips = [''];
              this.step1Ok[0] = true;
          }
      },
      forgotMail(newValue, oldValue) {
          if (newValue) {
              this.emails = [''];
              this.emailsTips = [''];
              this.step1Ok[1] = true;
          }
      },
      forgotPhone(newValue, oldValue) {
          if (newValue) {
              this.phones = [''];
              this.phonesTips = [''];
              this.step1Ok[2] = true;
          }
      }
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
      nowStep: 1,
      account: '',
      nicknames: [''], //曾用昵称
      emails: [''], //曾用邮箱
      phones: [''], //曾用手机
      usedPassword: [''],
      nicknameTips: [''],
      emailsTips: [''],
      phonesTips: [''],
      passwordTips:[''],
      showModal: false,
      message: '',
      usedPhoneType:[
          {
              phoneType: '',
              phoneId: '',
              noPhoneId: false,
          }
      ],
      phoneTypeTips: [''],
      phoneIdTips: [''],
      forgotNickname: false,
      forgotMail: false,
      forgotPhone: false,
      hasUpload: false,
      noLoginPhone: false,
      choosenPic: null,
      RegTime: '',
      showUsedPwd: '',
      RegLand: ['',''],
      CityMap: [
        {
            "cs": [
                {
                    "cid": 1,
                    "cn": "北京市"
                }
            ],
            "pid": 1,
            "pn": "北京市"
        },
        {
            "cs": [
                {
                    "cid": 2,
                    "cn": "天津市"
                }
            ],
            "pid": 2,
            "pn": "天津市"
        },
        {
            "cs": [
                {
                    "cid": 5,
                    "cn": "邯郸市"
                },
                {
                    "cid": 6,
                    "cn": "石家庄市"
                },
                {
                    "cid": 7,
                    "cn": "保定市"
                },
                {
                    "cid": 8,
                    "cn": "张家口市"
                },
                {
                    "cid": 9,
                    "cn": "承德市"
                },
                {
                    "cid": 10,
                    "cn": "唐山市"
                },
                {
                    "cid": 11,
                    "cn": "廊坊市"
                },
                {
                    "cid": 12,
                    "cn": "沧州市"
                },
                {
                    "cid": 13,
                    "cn": "衡水市"
                },
                {
                    "cid": 14,
                    "cn": "邢台市"
                },
                {
                    "cid": 15,
                    "cn": "秦皇岛市"
                }
            ],
            "pid": 3,
            "pn": "河北省"
        },
        {
            "cs": [
                {
                    "cid": 16,
                    "cn": "朔州市"
                },
                {
                    "cid": 17,
                    "cn": "忻州市"
                },
                {
                    "cid": 18,
                    "cn": "太原市"
                },
                {
                    "cid": 19,
                    "cn": "大同市"
                },
                {
                    "cid": 20,
                    "cn": "阳泉市"
                },
                {
                    "cid": 21,
                    "cn": "晋中市"
                },
                {
                    "cid": 22,
                    "cn": "长治市"
                },
                {
                    "cid": 23,
                    "cn": "晋城市"
                },
                {
                    "cid": 24,
                    "cn": "临汾市"
                },
                {
                    "cid": 25,
                    "cn": "吕梁市"
                },
                {
                    "cid": 26,
                    "cn": "运城市"
                }
            ],
            "pid": 4,
            "pn": "山西省"
        },
        {
            "cs": [
                {
                    "cid": 351,
                    "cn": "呼伦贝尔市"
                },
                {
                    "cid": 352,
                    "cn": "呼和浩特市"
                },
                {
                    "cid": 353,
                    "cn": "包头市"
                },
                {
                    "cid": 354,
                    "cn": "乌海市"
                },
                {
                    "cid": 355,
                    "cn": "乌兰察布市"
                },
                {
                    "cid": 356,
                    "cn": "通辽市"
                },
                {
                    "cid": 357,
                    "cn": "赤峰市"
                },
                {
                    "cid": 358,
                    "cn": "鄂尔多斯市"
                },
                {
                    "cid": 359,
                    "cn": "巴彦淖尔市"
                },
                {
                    "cid": 360,
                    "cn": "锡林郭勒盟"
                },
                {
                    "cid": 361,
                    "cn": "兴安盟"
                },
                {
                    "cid": 362,
                    "cn": "阿拉善盟"
                }
            ],
            "pid": 5,
            "pn": "内蒙古自治区"
        },
        {
            "cs": [
                {
                    "cid": 27,
                    "cn": "沈阳市"
                },
                {
                    "cid": 28,
                    "cn": "铁岭市"
                },
                {
                    "cid": 29,
                    "cn": "大连市"
                },
                {
                    "cid": 30,
                    "cn": "鞍山市"
                },
                {
                    "cid": 31,
                    "cn": "抚顺市"
                },
                {
                    "cid": 32,
                    "cn": "本溪市"
                },
                {
                    "cid": 33,
                    "cn": "丹东市"
                },
                {
                    "cid": 34,
                    "cn": "锦州市"
                },
                {
                    "cid": 35,
                    "cn": "营口市"
                },
                {
                    "cid": 36,
                    "cn": "阜新市"
                },
                {
                    "cid": 37,
                    "cn": "辽阳市"
                },
                {
                    "cid": 38,
                    "cn": "朝阳市"
                },
                {
                    "cid": 39,
                    "cn": "盘锦市"
                },
                {
                    "cid": 40,
                    "cn": "葫芦岛市"
                }
            ],
            "pid": 6,
            "pn": "辽宁省"
        },
        {
            "cs": [
                {
                    "cid": 41,
                    "cn": "长春市"
                },
                {
                    "cid": 42,
                    "cn": "吉林市"
                },
                {
                    "cid": 43,
                    "cn": "延边朝鲜族自治州"
                },
                {
                    "cid": 44,
                    "cn": "四平市"
                },
                {
                    "cid": 45,
                    "cn": "通化市"
                },
                {
                    "cid": 46,
                    "cn": "白城市"
                },
                {
                    "cid": 47,
                    "cn": "辽源市"
                },
                {
                    "cid": 48,
                    "cn": "松原市"
                },
                {
                    "cid": 49,
                    "cn": "白山市"
                }
            ],
            "pid": 7,
            "pn": "吉林省"
        },
        {
            "cs": [
                {
                    "cid": 50,
                    "cn": "哈尔滨市"
                },
                {
                    "cid": 51,
                    "cn": "齐齐哈尔市"
                },
                {
                    "cid": 52,
                    "cn": "鸡西市"
                },
                {
                    "cid": 53,
                    "cn": "牡丹江市"
                },
                {
                    "cid": 54,
                    "cn": "七台河市"
                },
                {
                    "cid": 55,
                    "cn": "佳木斯市"
                },
                {
                    "cid": 56,
                    "cn": "鹤岗市"
                },
                {
                    "cid": 57,
                    "cn": "双鸭山市"
                },
                {
                    "cid": 58,
                    "cn": "绥化市"
                },
                {
                    "cid": 59,
                    "cn": "黑河市"
                },
                {
                    "cid": 60,
                    "cn": "大兴安岭地区"
                },
                {
                    "cid": 61,
                    "cn": "伊春市"
                },
                {
                    "cid": 62,
                    "cn": "大庆市"
                }
            ],
            "pid": 8,
            "pn": "黑龙江省"
        },
        {
            "cs": [
                {
                    "cid": 3,
                    "cn": "上海市"
                }
            ],
            "pid": 9,
            "pn": "上海市"
        },
        {
            "cs": [
                {
                    "cid": 63,
                    "cn": "南京市"
                },
                {
                    "cid": 64,
                    "cn": "无锡市"
                },
                {
                    "cid": 65,
                    "cn": "镇江市"
                },
                {
                    "cid": 66,
                    "cn": "苏州市"
                },
                {
                    "cid": 67,
                    "cn": "南通市"
                },
                {
                    "cid": 68,
                    "cn": "扬州市"
                },
                {
                    "cid": 69,
                    "cn": "盐城市"
                },
                {
                    "cid": 70,
                    "cn": "徐州市"
                },
                {
                    "cid": 71,
                    "cn": "淮安市"
                },
                {
                    "cid": 72,
                    "cn": "连云港市"
                },
                {
                    "cid": 73,
                    "cn": "常州市"
                },
                {
                    "cid": 74,
                    "cn": "泰州市"
                },
                {
                    "cid": 75,
                    "cn": "宿迁市"
                }
            ],
            "pid": 10,
            "pn": "江苏省"
        },
        {
            "cs": [
                {
                    "cid": 76,
                    "cn": "舟山市"
                },
                {
                    "cid": 77,
                    "cn": "衢州市"
                },
                {
                    "cid": 78,
                    "cn": "杭州市"
                },
                {
                    "cid": 79,
                    "cn": "湖州市"
                },
                {
                    "cid": 80,
                    "cn": "嘉兴市"
                },
                {
                    "cid": 81,
                    "cn": "宁波市"
                },
                {
                    "cid": 82,
                    "cn": "绍兴市"
                },
                {
                    "cid": 83,
                    "cn": "温州市"
                },
                {
                    "cid": 84,
                    "cn": "丽水市"
                },
                {
                    "cid": 85,
                    "cn": "金华市"
                },
                {
                    "cid": 86,
                    "cn": "台州市"
                }
            ],
            "pid": 11,
            "pn": "浙江省"
        },
        {
            "cs": [
                {
                    "cid": 87,
                    "cn": "合肥市"
                },
                {
                    "cid": 88,
                    "cn": "芜湖市"
                },
                {
                    "cid": 89,
                    "cn": "蚌埠市"
                },
                {
                    "cid": 90,
                    "cn": "淮南市"
                },
                {
                    "cid": 91,
                    "cn": "马鞍山市"
                },
                {
                    "cid": 92,
                    "cn": "淮北市"
                },
                {
                    "cid": 93,
                    "cn": "铜陵市"
                },
                {
                    "cid": 94,
                    "cn": "安庆市"
                },
                {
                    "cid": 95,
                    "cn": "黄山市"
                },
                {
                    "cid": 96,
                    "cn": "滁州市"
                },
                {
                    "cid": 97,
                    "cn": "阜阳市"
                },
                {
                    "cid": 98,
                    "cn": "宿州市"
                },
                {
                    "cid": 99,
                    "cn": "巢湖市"
                },
                {
                    "cid": 100,
                    "cn": "六安市"
                },
                {
                    "cid": 101,
                    "cn": "亳州市"
                },
                {
                    "cid": 102,
                    "cn": "池州市"
                },
                {
                    "cid": 103,
                    "cn": "宣城市"
                }
            ],
            "pid": 12,
            "pn": "安徽省"
        },
        {
            "cs": [
                {
                    "cid": 104,
                    "cn": "福州市"
                },
                {
                    "cid": 105,
                    "cn": "厦门市"
                },
                {
                    "cid": 106,
                    "cn": "宁德市"
                },
                {
                    "cid": 107,
                    "cn": "莆田市"
                },
                {
                    "cid": 108,
                    "cn": "泉州市"
                },
                {
                    "cid": 109,
                    "cn": "漳州市"
                },
                {
                    "cid": 110,
                    "cn": "龙岩市"
                },
                {
                    "cid": 111,
                    "cn": "三明市"
                },
                {
                    "cid": 112,
                    "cn": "南平市"
                }
            ],
            "pid": 13,
            "pn": "福建省"
        },
        {
            "cs": [
                {
                    "cid": 113,
                    "cn": "鹰潭市"
                },
                {
                    "cid": 114,
                    "cn": "新余市"
                },
                {
                    "cid": 115,
                    "cn": "南昌市"
                },
                {
                    "cid": 116,
                    "cn": "九江市"
                },
                {
                    "cid": 117,
                    "cn": "上饶市"
                },
                {
                    "cid": 118,
                    "cn": "抚州市"
                },
                {
                    "cid": 119,
                    "cn": "宜春市"
                },
                {
                    "cid": 120,
                    "cn": "吉安市"
                },
                {
                    "cid": 121,
                    "cn": "赣州市"
                },
                {
                    "cid": 122,
                    "cn": "景德镇市"
                },
                {
                    "cid": 123,
                    "cn": "萍乡市"
                }
            ],
            "pid": 14,
            "pn": "江西省"
        },
        {
            "cs": [
                {
                    "cid": 124,
                    "cn": "菏泽市"
                },
                {
                    "cid": 125,
                    "cn": "济南市"
                },
                {
                    "cid": 126,
                    "cn": "青岛市"
                },
                {
                    "cid": 127,
                    "cn": "淄博市"
                },
                {
                    "cid": 128,
                    "cn": "德州市"
                },
                {
                    "cid": 129,
                    "cn": "烟台市"
                },
                {
                    "cid": 130,
                    "cn": "潍坊市"
                },
                {
                    "cid": 131,
                    "cn": "济宁市"
                },
                {
                    "cid": 132,
                    "cn": "泰安市"
                },
                {
                    "cid": 133,
                    "cn": "临沂市"
                },
                {
                    "cid": 134,
                    "cn": "滨州市"
                },
                {
                    "cid": 135,
                    "cn": "东营市"
                },
                {
                    "cid": 136,
                    "cn": "威海市"
                },
                {
                    "cid": 137,
                    "cn": "枣庄市"
                },
                {
                    "cid": 138,
                    "cn": "日照市"
                },
                {
                    "cid": 139,
                    "cn": "莱芜市"
                },
                {
                    "cid": 140,
                    "cn": "聊城市"
                }
            ],
            "pid": 15,
            "pn": "山东省"
        },
        {
            "cs": [
                {
                    "cid": 141,
                    "cn": "商丘市"
                },
                {
                    "cid": 142,
                    "cn": "郑州市"
                },
                {
                    "cid": 143,
                    "cn": "安阳市"
                },
                {
                    "cid": 144,
                    "cn": "新乡市"
                },
                {
                    "cid": 145,
                    "cn": "许昌市"
                },
                {
                    "cid": 146,
                    "cn": "平顶山市"
                },
                {
                    "cid": 147,
                    "cn": "信阳市"
                },
                {
                    "cid": 148,
                    "cn": "南阳市"
                },
                {
                    "cid": 149,
                    "cn": "开封市"
                },
                {
                    "cid": 150,
                    "cn": "洛阳市"
                },
                {
                    "cid": 151,
                    "cn": "济源市"
                },
                {
                    "cid": 152,
                    "cn": "焦作市"
                },
                {
                    "cid": 153,
                    "cn": "鹤壁市"
                },
                {
                    "cid": 154,
                    "cn": "濮阳市"
                },
                {
                    "cid": 155,
                    "cn": "周口市"
                },
                {
                    "cid": 156,
                    "cn": "漯河市"
                },
                {
                    "cid": 157,
                    "cn": "驻马店市"
                },
                {
                    "cid": 158,
                    "cn": "三门峡市"
                }
            ],
            "pid": 16,
            "pn": "河南省"
        },
        {
            "cs": [
                {
                    "cid": 159,
                    "cn": "武汉市"
                },
                {
                    "cid": 160,
                    "cn": "襄樊市"
                },
                {
                    "cid": 161,
                    "cn": "鄂州市"
                },
                {
                    "cid": 162,
                    "cn": "孝感市"
                },
                {
                    "cid": 163,
                    "cn": "黄冈市"
                },
                {
                    "cid": 164,
                    "cn": "黄石市"
                },
                {
                    "cid": 165,
                    "cn": "咸宁市"
                },
                {
                    "cid": 166,
                    "cn": "荆州市"
                },
                {
                    "cid": 167,
                    "cn": "宜昌市"
                },
                {
                    "cid": 168,
                    "cn": "恩施土家族苗族自治州"
                },
                {
                    "cid": 169,
                    "cn": "神农架林区"
                },
                {
                    "cid": 170,
                    "cn": "十堰市"
                },
                {
                    "cid": 171,
                    "cn": "随州市"
                },
                {
                    "cid": 172,
                    "cn": "荆门市"
                },
                {
                    "cid": 173,
                    "cn": "仙桃市"
                },
                {
                    "cid": 174,
                    "cn": "天门市"
                },
                {
                    "cid": 175,
                    "cn": "潜江市"
                }
            ],
            "pid": 17,
            "pn": "湖北省"
        },
        {
            "cs": [
                {
                    "cid": 176,
                    "cn": "岳阳市"
                },
                {
                    "cid": 177,
                    "cn": "长沙市"
                },
                {
                    "cid": 178,
                    "cn": "湘潭市"
                },
                {
                    "cid": 179,
                    "cn": "株洲市"
                },
                {
                    "cid": 180,
                    "cn": "衡阳市"
                },
                {
                    "cid": 181,
                    "cn": "郴州市"
                },
                {
                    "cid": 182,
                    "cn": "常德市"
                },
                {
                    "cid": 183,
                    "cn": "益阳市"
                },
                {
                    "cid": 184,
                    "cn": "娄底市"
                },
                {
                    "cid": 185,
                    "cn": "邵阳市"
                },
                {
                    "cid": 186,
                    "cn": "湘西土家族苗族自治州"
                },
                {
                    "cid": 187,
                    "cn": "张家界市"
                },
                {
                    "cid": 188,
                    "cn": "怀化市"
                },
                {
                    "cid": 189,
                    "cn": "永州市"
                }
            ],
            "pid": 18,
            "pn": "湖南省"
        },
        {
            "cs": [
                {
                    "cid": 190,
                    "cn": "广州市"
                },
                {
                    "cid": 191,
                    "cn": "汕尾市"
                },
                {
                    "cid": 192,
                    "cn": "阳江市"
                },
                {
                    "cid": 193,
                    "cn": "揭阳市"
                },
                {
                    "cid": 194,
                    "cn": "茂名市"
                },
                {
                    "cid": 195,
                    "cn": "惠州市"
                },
                {
                    "cid": 196,
                    "cn": "江门市"
                },
                {
                    "cid": 197,
                    "cn": "韶关市"
                },
                {
                    "cid": 198,
                    "cn": "梅州市"
                },
                {
                    "cid": 199,
                    "cn": "汕头市"
                },
                {
                    "cid": 200,
                    "cn": "深圳市"
                },
                {
                    "cid": 201,
                    "cn": "珠海市"
                },
                {
                    "cid": 202,
                    "cn": "佛山市"
                },
                {
                    "cid": 203,
                    "cn": "肇庆市"
                },
                {
                    "cid": 204,
                    "cn": "湛江市"
                },
                {
                    "cid": 205,
                    "cn": "中山市"
                },
                {
                    "cid": 206,
                    "cn": "河源市"
                },
                {
                    "cid": 207,
                    "cn": "清远市"
                },
                {
                    "cid": 208,
                    "cn": "云浮市"
                },
                {
                    "cid": 209,
                    "cn": "潮州市"
                },
                {
                    "cid": 210,
                    "cn": "东莞市"
                }
            ],
            "pid": 19,
            "pn": "广东省"
        },
        {
            "cs": [
                {
                    "cid": 255,
                    "cn": "海口市"
                },
                {
                    "cid": 256,
                    "cn": "三亚市"
                },
                {
                    "cid": 257,
                    "cn": "五指山市"
                },
                {
                    "cid": 258,
                    "cn": "琼海市"
                },
                {
                    "cid": 259,
                    "cn": "儋州市"
                },
                {
                    "cid": 260,
                    "cn": "文昌市"
                },
                {
                    "cid": 261,
                    "cn": "万宁市"
                },
                {
                    "cid": 262,
                    "cn": "东方市"
                },
                {
                    "cid": 263,
                    "cn": "澄迈县"
                },
                {
                    "cid": 264,
                    "cn": "定安县"
                },
                {
                    "cid": 265,
                    "cn": "屯昌县"
                },
                {
                    "cid": 266,
                    "cn": "临高县"
                },
                {
                    "cid": 267,
                    "cn": "白沙黎族自治县"
                },
                {
                    "cid": 268,
                    "cn": "昌江黎族自治县"
                },
                {
                    "cid": 269,
                    "cn": "乐东黎族自治县"
                },
                {
                    "cid": 270,
                    "cn": "陵水黎族自治县"
                },
                {
                    "cid": 271,
                    "cn": "保亭黎族苗族自治县"
                },
                {
                    "cid": 272,
                    "cn": "琼中黎族苗族自治县"
                }
            ],
            "pid": 20,
            "pn": "海南省"
        },
        {
            "cs": [
                {
                    "cid": 307,
                    "cn": "防城港市"
                },
                {
                    "cid": 308,
                    "cn": "南宁市"
                },
                {
                    "cid": 309,
                    "cn": "崇左市"
                },
                {
                    "cid": 310,
                    "cn": "来宾市"
                },
                {
                    "cid": 311,
                    "cn": "柳州市"
                },
                {
                    "cid": 312,
                    "cn": "桂林市"
                },
                {
                    "cid": 313,
                    "cn": "梧州市"
                },
                {
                    "cid": 314,
                    "cn": "贺州市"
                },
                {
                    "cid": 315,
                    "cn": "贵港市"
                },
                {
                    "cid": 316,
                    "cn": "玉林市"
                },
                {
                    "cid": 317,
                    "cn": "百色市"
                },
                {
                    "cid": 318,
                    "cn": "钦州市"
                },
                {
                    "cid": 319,
                    "cn": "河池市"
                },
                {
                    "cid": 320,
                    "cn": "北海市"
                }
            ],
            "pid": 21,
            "pn": "广西壮族自治区"
        },
        {
            "cs": [
                {
                    "cid": 211,
                    "cn": "兰州市"
                },
                {
                    "cid": 212,
                    "cn": "金昌市"
                },
                {
                    "cid": 213,
                    "cn": "白银市"
                },
                {
                    "cid": 214,
                    "cn": "天水市"
                },
                {
                    "cid": 215,
                    "cn": "嘉峪关市"
                },
                {
                    "cid": 216,
                    "cn": "武威市"
                },
                {
                    "cid": 217,
                    "cn": "张掖市"
                },
                {
                    "cid": 218,
                    "cn": "平凉市"
                },
                {
                    "cid": 219,
                    "cn": "酒泉市"
                },
                {
                    "cid": 220,
                    "cn": "庆阳市"
                },
                {
                    "cid": 221,
                    "cn": "定西市"
                },
                {
                    "cid": 222,
                    "cn": "陇南市"
                },
                {
                    "cid": 223,
                    "cn": "临夏回族自治州"
                },
                {
                    "cid": 224,
                    "cn": "甘南藏族自治州"
                }
            ],
            "pid": 22,
            "pn": "甘肃省"
        },
        {
            "cs": [
                {
                    "cid": 297,
                    "cn": "西安市"
                },
                {
                    "cid": 298,
                    "cn": "咸阳市"
                },
                {
                    "cid": 299,
                    "cn": "延安市"
                },
                {
                    "cid": 300,
                    "cn": "榆林市"
                },
                {
                    "cid": 301,
                    "cn": "渭南市"
                },
                {
                    "cid": 302,
                    "cn": "商洛市"
                },
                {
                    "cid": 303,
                    "cn": "安康市"
                },
                {
                    "cid": 304,
                    "cn": "汉中市"
                },
                {
                    "cid": 305,
                    "cn": "宝鸡市"
                },
                {
                    "cid": 306,
                    "cn": "铜川市"
                }
            ],
            "pid": 23,
            "pn": "陕西省"
        },
        {
            "cs": [
                {
                    "cid": 333,
                    "cn": "塔城地区"
                },
                {
                    "cid": 334,
                    "cn": "哈密地区"
                },
                {
                    "cid": 335,
                    "cn": "和田地区"
                },
                {
                    "cid": 336,
                    "cn": "阿勒泰地区"
                },
                {
                    "cid": 337,
                    "cn": "克孜勒苏柯尔克孜自治州"
                },
                {
                    "cid": 338,
                    "cn": "博尔塔拉蒙古自治州"
                },
                {
                    "cid": 339,
                    "cn": "克拉玛依市"
                },
                {
                    "cid": 340,
                    "cn": "乌鲁木齐市"
                },
                {
                    "cid": 341,
                    "cn": "石河子市"
                },
                {
                    "cid": 342,
                    "cn": "昌吉回族自治州"
                },
                {
                    "cid": 343,
                    "cn": "五家渠市"
                },
                {
                    "cid": 344,
                    "cn": "吐鲁番地区"
                },
                {
                    "cid": 345,
                    "cn": "巴音郭楞蒙古自治州"
                },
                {
                    "cid": 346,
                    "cn": "阿克苏地区"
                },
                {
                    "cid": 347,
                    "cn": "阿拉尔市"
                },
                {
                    "cid": 348,
                    "cn": "喀什地区"
                },
                {
                    "cid": 349,
                    "cn": "图木舒克市"
                },
                {
                    "cid": 350,
                    "cn": "伊犁哈萨克自治州"
                }
            ],
            "pid": 24,
            "pn": "新疆维吾尔自治区"
        },
        {
            "cs": [
                {
                    "cid": 289,
                    "cn": "海北藏族自治州"
                },
                {
                    "cid": 290,
                    "cn": "西宁市"
                },
                {
                    "cid": 291,
                    "cn": "海东地区"
                },
                {
                    "cid": 292,
                    "cn": "黄南藏族自治州"
                },
                {
                    "cid": 293,
                    "cn": "海南藏族自治州"
                },
                {
                    "cid": 294,
                    "cn": "果洛藏族自治州"
                },
                {
                    "cid": 295,
                    "cn": "玉树藏族自治州"
                },
                {
                    "cid": 296,
                    "cn": "海西蒙古族藏族自治州"
                }
            ],
            "pid": 25,
            "pn": "青海省"
        },
        {
            "cs": [
                {
                    "cid": 328,
                    "cn": "银川市"
                },
                {
                    "cid": 329,
                    "cn": "石嘴山市"
                },
                {
                    "cid": 330,
                    "cn": "吴忠市"
                },
                {
                    "cid": 331,
                    "cn": "固原市"
                },
                {
                    "cid": 332,
                    "cn": "中卫市"
                }
            ],
            "pid": 26,
            "pn": "宁夏回族自治区"
        },
        {
            "cs": [
                {
                    "cid": 4,
                    "cn": "重庆市"
                }
            ],
            "pid": 27,
            "pn": "重庆市"
        },
        {
            "cs": [
                {
                    "cid": 225,
                    "cn": "成都市"
                },
                {
                    "cid": 226,
                    "cn": "攀枝花市"
                },
                {
                    "cid": 227,
                    "cn": "自贡市"
                },
                {
                    "cid": 228,
                    "cn": "绵阳市"
                },
                {
                    "cid": 229,
                    "cn": "南充市"
                },
                {
                    "cid": 230,
                    "cn": "达州市"
                },
                {
                    "cid": 231,
                    "cn": "遂宁市"
                },
                {
                    "cid": 232,
                    "cn": "广安市"
                },
                {
                    "cid": 233,
                    "cn": "巴中市"
                },
                {
                    "cid": 234,
                    "cn": "泸州市"
                },
                {
                    "cid": 235,
                    "cn": "宜宾市"
                },
                {
                    "cid": 236,
                    "cn": "资阳市"
                },
                {
                    "cid": 237,
                    "cn": "内江市"
                },
                {
                    "cid": 238,
                    "cn": "乐山市"
                },
                {
                    "cid": 239,
                    "cn": "眉山市"
                },
                {
                    "cid": 240,
                    "cn": "凉山彝族自治州"
                },
                {
                    "cid": 241,
                    "cn": "雅安市"
                },
                {
                    "cid": 242,
                    "cn": "甘孜藏族自治州"
                },
                {
                    "cid": 243,
                    "cn": "阿坝藏族羌族自治州"
                },
                {
                    "cid": 244,
                    "cn": "德阳市"
                },
                {
                    "cid": 245,
                    "cn": "广元市"
                }
            ],
            "pid": 28,
            "pn": "四川省"
        },
        {
            "cs": [
                {
                    "cid": 246,
                    "cn": "贵阳市"
                },
                {
                    "cid": 247,
                    "cn": "遵义市"
                },
                {
                    "cid": 248,
                    "cn": "安顺市"
                },
                {
                    "cid": 249,
                    "cn": "黔南布依族苗族自治州"
                },
                {
                    "cid": 250,
                    "cn": "黔东南苗族侗族自治州"
                },
                {
                    "cid": 251,
                    "cn": "铜仁地区"
                },
                {
                    "cid": 252,
                    "cn": "毕节地区"
                },
                {
                    "cid": 253,
                    "cn": "六盘水市"
                },
                {
                    "cid": 254,
                    "cn": "黔西南布依族苗族自治州"
                }
            ],
            "pid": 29,
            "pn": "贵州省"
        },
        {
            "cs": [
                {
                    "cid": 273,
                    "cn": "西双版纳傣族自治州"
                },
                {
                    "cid": 274,
                    "cn": "德宏傣族景颇族自治州"
                },
                {
                    "cid": 275,
                    "cn": "昭通市"
                },
                {
                    "cid": 276,
                    "cn": "昆明市"
                },
                {
                    "cid": 277,
                    "cn": "大理白族自治州"
                },
                {
                    "cid": 278,
                    "cn": "红河哈尼族彝族自治州"
                },
                {
                    "cid": 279,
                    "cn": "曲靖市"
                },
                {
                    "cid": 280,
                    "cn": "保山市"
                },
                {
                    "cid": 281,
                    "cn": "文山壮族苗族自治州"
                },
                {
                    "cid": 282,
                    "cn": "玉溪市"
                },
                {
                    "cid": 283,
                    "cn": "楚雄彝族自治州"
                },
                {
                    "cid": 284,
                    "cn": "普洱市"
                },
                {
                    "cid": 285,
                    "cn": "临沧市"
                },
                {
                    "cid": 286,
                    "cn": "怒江傈傈族自治州"
                },
                {
                    "cid": 287,
                    "cn": "迪庆藏族自治州"
                },
                {
                    "cid": 288,
                    "cn": "丽江市"
                }
            ],
            "pid": 30,
            "pn": "云南省"
        },
        {
            "cs": [
                {
                    "cid": 321,
                    "cn": "拉萨市"
                },
                {
                    "cid": 322,
                    "cn": "日喀则地区"
                },
                {
                    "cid": 323,
                    "cn": "山南地区"
                },
                {
                    "cid": 324,
                    "cn": "林芝地区"
                },
                {
                    "cid": 325,
                    "cn": "昌都地区"
                },
                {
                    "cid": 326,
                    "cn": "那曲地区"
                },
                {
                    "cid": 327,
                    "cn": "阿里地区"
                }
            ],
            "pid": 31,
            "pn": "西藏自治区"
        },
        {
            "cs": [
                {
                    "cid": 363,
                    "cn": "台北市"
                },
                {
                    "cid": 364,
                    "cn": "高雄市"
                },
                {
                    "cid": 365,
                    "cn": "基隆市"
                },
                {
                    "cid": 366,
                    "cn": "台中市"
                },
                {
                    "cid": 367,
                    "cn": "台南市"
                },
                {
                    "cid": 368,
                    "cn": "新竹市"
                },
                {
                    "cid": 369,
                    "cn": "嘉义市"
                }
            ],
            "pid": 32,
            "pn": "台湾省"
        },
        {
            "cs": [
                {
                    "cid": 370,
                    "cn": "澳门特别行政区"
                }
            ],
            "pid": 33,
            "pn": "澳门特别行政区"
        },
        {
            "cs": [
                {
                    "cid": 371,
                    "cn": "香港特别行政区"
                }
            ],
            "pid": 34,
            "pn": "香港特别行政区"
        }
      ],
      UsedLand: [{
          p: '',
          c: ''
      }],
      dateTips: '',
      regLandTips: '',
      usedLandTips: '',
      showRegTimeTips: false,
      showRegLandTips: false,
      showUsedLandTips: false,
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() < new Date(1990,0,1);
          },
      },
      step1Ok: [true, true, true],
      step2Ok: true,
      step3Ok: [true, true, true, true],
      resetId: "",
      overTime: false,
    }
  },
  methods: {
    back(steps) {
        if (steps > 1) {
            this.nowStep -- ;
        }
    },
    next(steps) {
        const mailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        const phoneReg = /^[0-9]*$/;
        const pwdReg = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-])|(?=.*?[A-Za-z])(?=.*?[!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-]))[\dA-Za-z!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-]+$/;
        const nickReg = /^[.a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        const phoneTypeReg = /^[.a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        const phoneIdReg = /^[0-9a-zA-Z]+$/;
        if (steps < 3) {
            if (this.nowStep == 1) {
                if (!this.forgotNickname) {
                    let nickFlag = false;
                    let nickResult = 1;
                    for (let i=0;i<this.nicknames.length;i++) {
                        if (this.nicknames[i]!="") {
                            nickFlag = true;
                            if (this.getLen(this.nicknames[i])<2 || this.getLen(this.nicknames[i])>32) {
                                this.$set(this.nicknameTips, i, "昵称应为2-32位中英文、数字、下划线字符");
                                nickResult = 2;
                            } else if (!nickReg.test(this.nicknames[i])){
                                this.$set(this.nicknameTips, i, "昵称应为2-32位中英文、数字、下划线字符");
                                nickResult = 2;
                            }
                        }
                    }
                    if (!nickFlag) {
                        this.$set(this.nicknameTips, 0, '请输入曾用昵称');
                        nickResult = 0;
                    }
                    //let checkResult = this.checkInput('nickname', this.nicknames, this.nicknameTips);
                    if (nickResult != 1) {
                        this.step1Ok[0] = false;
                        //this.nickFlag = false;
                    } else {
                        this.step1Ok[0] = true;
                    }
                }
                if (!this.forgotMail) {
                    let checkResult = this.checkInput('email', this.emails, this.emailsTips, mailReg);
                    if (checkResult != 1) {
                        this.step1Ok[1] = false;
                        //this.emailFlag = false;
                    } else {
                        this.step1Ok[1] = true;
                    }
                }
                if (!this.forgotPhone) {
                    let checkResult = this.checkInput('phone', this.phones, this.phonesTips ,phoneReg);
                    if (checkResult != 1) {
                        this.step1Ok[2] = false;
                        //this.phoneFlag = false;
                    } else {
                        this.step1Ok[2] = true;
                    }
                }
                if (this.step1Ok[0] && this.step1Ok[1] && this.step1Ok[2]) {
                    this.nowStep ++;
                } 
            } else if (this.nowStep == 2) {     
                if (!this.noLoginPhone) {
                    let phoneTypeResult = 1;
                    for(let i = 0;i < this.usedPhoneType.length; i ++) {
                        if (this.usedPhoneType[i].phoneType == "" && !this.usedPhoneType[i].noPhoneId && this.usedPhoneType[i].phoneId == '') {
                            this.$set(this.phoneIdTips, i, "请填写曾用手机序列号");
                            this.$set(this.phoneTypeTips, i, "请填写曾用手机型号");
                            phoneTypeResult = 2;
                        } else if(this.usedPhoneType[i].phoneType!="" || this.usedPhoneType[i].phoneId != "") {
                            if (this.usedPhoneType[i].phoneType!="") {
                                if (this.getLen(this.trim(this.usedPhoneType[i].phoneType))<2 || this.getLen(this.trim(this.usedPhoneType[i].phoneType))>32) {
                                    this.$set(this.phoneTypeTips, i, "设备名只允许输入2-32位中英文、数字、下划线");
                                    phoneTypeResult = 0;
                                }
                                if (!phoneTypeReg.test(this.trim(this.usedPhoneType[i].phoneType))) {
                                    this.$set(this.phoneTypeTips, i, "设备名只允许输入2-32位中英文、数字、下划线");
                                    phoneTypeResult = 0;
                                }
                            }
                            if (this.usedPhoneType[i].phoneId != "") {
                                if (!phoneIdReg.test(this.usedPhoneType[i].phoneId)) {
                                    this.$set(this.phoneIdTips, i, "请输入正确的序列号");
                                    phoneTypeResult = 0;
                                }
                            }
                        }
                    }
                    if (phoneTypeResult!=1) {
                        this.step2Ok = false;
                    } else {
                        this.step2Ok = true;
                    }
                }

                if (!this.step2Ok) {
                    return;
                }
                this.nowStep ++ ;
            }
        } else {
            // 提交表单
            // console.log(this.CityMap[this.RegLand[0]].pn, this.CityMap[this.RegLand[0]].cs[this.RegLand[1]].cn);
            if (this.RegTime == "") {
                this.dateTips = "请选择注册时间";
                this.showRegTimeTips = true;
                this.step3Ok[0] = false;
            }
            if (this.RegLand[0] === "" || this.RegLand[1] === "") {
                this.regLandTips = "请选择注册地点";
                this.showRegLandTips = true;
                this.step3Ok[1] = false;
            }
            let usedLandFlag = false;
            let usedLand = '';
            for (let i = 0;i < this.UsedLand.length; i++) {
                if (this.UsedLand[i].p !== "" && this.UsedLand[i].c !== "") {
                    usedLandFlag = true;
                    let tempLand = `${this.CityMap[this.UsedLand[i].p].pn}-${this.CityMap[this.UsedLand[i].p].cs[this.UsedLand[i].c].cn}`;
                    usedLand += tempLand+',';
                }
            }
            if (!usedLandFlag) {
                this.usedLandTips = "至少填写一个常用地";
                this.showUsedLandTips = true;
                this.step3Ok[2] = false;
            }
            let passwordFlag = false;
            for (let i = 0;i < this.usedPassword.length; i++) {
                if (this.usedPassword[i] != "") {
                    if (this.usedPassword[i].length < 8 || this.usedPassword[i].length > 16) {
                        this.$set(this.passwordTips, i, '密码应为8~16个字符，区分大小写');
                        passwordFlag = true;
                    } else if (!pwdReg.test(this.usedPassword[i])) {
                        this.$set(this.passwordTips, i, '密码至少包含数字、字母和符号两种类型');
                        passwordFlag = true;
                    }
                }
            }
            if (passwordFlag) {
                this.step3Ok[3] = false;
            } else {
                this.step3Ok[3] = true;
            }
            if (!this.step3Ok[0] || !this.step3Ok[1] || !this.step3Ok[2] || !this.step3Ok[3]) {
                return;
            }
            let usedPwd = '';
            for(let i = 0;i < this.usedPassword.length; i++) {
                if (this.usedPassword[i] != "") {
                    usedPwd = usedPwd + encodeURIComponent(this.usedPassword[i])+',';
                }
            }
            const useNickName = this.contactInput(this.nicknames);
            const usedEmails = this.contactInput(this.emails);
            const usedPhones = this.contactInput(this.phones);
            const regLand = `${this.CityMap[this.RegLand[0]].pn}-${this.CityMap[this.RegLand[0]].cs[this.RegLand[1]].cn}`;
            let usedPhoneTypes = "";
            let usedPhoneIds = ""
            for (let i = 0;i < this.usedPhoneType.length; i++) {
                if (this.usedPhoneType[i].phoneType!=='') {
                    usedPhoneTypes += this.usedPhoneType[i].phoneType + ',';
                }
                if (this.usedPhoneType[i].phoneId!=='') {
                    usedPhoneIds += this.usedPhoneType[i].phoneId + ',';
                }
            }
            const data = {
                regLocation: regLand,
                regDate: this.RegTime,
                commonUsedLocation: usedLand.substring(0, usedLand.length-1),
                resetId: this.resetId,
                nameUsedBeforeList: useNickName.substring(0, useNickName.length-1),
                emailUsedBeforeList: usedEmails.substring(0, usedEmails.length-1),
                deviceUsedBeforeList: usedPhoneTypes.substring(0, usedPhoneTypes.length-1),
                phoneUsedBeforeList: usedPhones.substring(0, usedPhones.length-1),
                passwordUsedBeforeList: usedPwd.substring(0, usedPwd.length-1),
                snUsedBeforeList: usedPhoneIds.substring(0, usedPhoneIds.length-1),
            }
            //console.log(data);
            axios.post('/uc/system/webjsp/resetpwd/addEvidence', data).then((res) => {
                if (res.data.code == 200) {
                    let gotoUrl = '';
                    if (res.data.value.phone) {
                        location.replace(`/appeal/step5?account=${this.account}&resetId=${res.data.value.resetId}&vcode=${res.data.value.areacode}&phone=${res.data.value.phone}`);
                    } else {
                        location.replace(`/appeal/step5?account=${this.account}&resetId=${res.data.value.resetId}`);
                    }
                } else if (res.data.code == 200014) {
                    this.message = "已经提交过了，请重新填写账号申诉";
                    this.showModal = true;
                    return Promise.reject(1);
                } else {
                    if (res.data.message == "非法操作") {
                        return Promise.reject(0);
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
        }
    },
    getLen(str) {
        var len = 0;  
        for (var i=0; i<str.length; i++) {   
            var c = str.charCodeAt(i);   
            //单字节加1   
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
                len++;
            }
            else {
                len+=2;
            }
        }   
        return len;
    },
    closeModal() {
        this.showModal = false;
        this.message = "";
    },
    checkInput(type,inputList,tipsList,rule) {
        let flag = false;
        let tips = '';
        let result = 1; // -1通过，-2空错误，非负数不合法
        for (let i=0;i<inputList.length;i++) {
            if (inputList[i] !== "") { // 判断空值
               flag = true;
               if (rule && !rule.test(inputList[i])) { // 若有条件参数，则进一步判断条件
                    // 提示不合法
                    if (type == 'email') {
                        this.$set(tipsList, i, '输入邮箱格式不正确')
                    } else if (type == 'phone') {
                        this.$set(tipsList, i, '输入手机号格式不正确')
                    }
                    result = 2;
               }
            }
        }
        if (!flag) {
            if (type == 'nickname') {
                this.$set(tipsList, 0, '请输入曾用昵称')
            } else if (type == 'email') {
                this.$set(tipsList, 0, '请输入曾用邮箱')
            } else if (type == 'phone') {
                this.$set(tipsList, 0, '请输入曾用手机号')
            }
            result = 0; //输入框列表都未空
        }
        return result;
    },
    contactInput(list) {
        let result = '';
        for ( let i = 0; i < list.length; i++ ) {
            if (list[i] != "") {
                result = result + list[i] + ",";
            }
        }
        return result;
    },
    handleNoPhoneId(index) {
        this.usedPhoneType[index].phoneId = "";
        this.phoneIdTips[index] = '';
    },
    handleChangeDate() {
        this.showRegTimeTips = false;
        this.step3Ok[0] = true;
    },
    addUsedPwd() {
        if (this.usedPassword.length < 5) {
            this.usedPassword.push('');
        }
    },
    subUsedPwd(index) {
        this.usedPassword.splice(index,1);
    },
    handleAdd(type) {
        switch(type) {
            case 'nickname': {
                if (this.nicknames.length < 5) {
                    this.nicknames.push('');
                    this.nicknameTips.push('');
                }
                break;
            }
            case 'email': {
                if (this.emails.length < 5) {
                    this.emails.push('');
                    this.emailsTips.push('');
                }
                break;
            }
            case 'phones': {
                if (this.phones.length < 5 ) {
                    this.phones.push('');
                    this.phonesTips.push('');
                }
                break;
            }
            case 'phoneType': {
                if (this.usedPhoneType.length < 5) {
                    this.usedPhoneType.push({
                        phoneType: '',
                        phoneId: '',
                        noPhoneId: false,
                    });
                    this.phoneTypeTips.push('');
                    this.phoneIdTips.push('');
                }
                
                break;
            }
            case 'usedLand': {
                if (this.UsedLand.length < 5) {
                    this.UsedLand.push({
                        p: '',
                        c: ''
                    });
                }
                break;
            }
        }
    },
    handleSub(index, type) {
        switch(type) {
            case 'nickname': {
                this.nicknames.splice(index, 1);
                this.nicknameTips.splice(index, 1);
                break;
            }
            case 'email': {
                this.emails.splice(index,1);
                this.emailsTips.splice(index, 1);
                break;
            }
            case 'phones': {
                this.phones.splice(index,1);
                this.phonesTips.splice(index, 1);
                break;
            }
            case 'phoneType': {
                this.usedPhoneType.splice(index, 1);
                this.phoneTypeTips.splice(index, 1);
                this.phoneIdTips.splice(index, 1);
                break;
            }
            case 'usedLand': {
                this.UsedLand.splice(index, 1);
                break;
            }
        }
    },
    handleForgot(type) {
        switch(type) {
            case 'nickname': {
                this.nicknames=[''];
                this.nicknameTips = [''];
                this.step1Ok[0] = true;
                break;
            }
            case 'email': {
                this.emails=[''];
                this.emailsTips = [''];
                this.step1Ok[1] = true;
                break;
            }
            case 'phones': {
                this.phones=[''];
                this.phonesTips = [''];
                this.step1Ok[2] = true;
                break;
            }
        }
    },
    handleInput(type, index) {
        switch(type) {
            case 'nickname': {
                this.nicknameTips[index] = "";
                break;
            }
            case 'email': {
                this.emailsTips[index] = "";
                break;
            }
            case 'phones': {
                this.phonesTips[index] = "";
                break;
            }
            case 'phoneType': {
                this.phoneTypeTips[index] = "";
                this.phoneIdTips[index] = "";
                this.step2Ok = true;
                break;
            }
            case 'phoneId': {
                this.phoneTypeTips[index] = "";
                this.phoneIdTips[index] = "";
                this.step2Ok = true;
                break;
            }
            case 'password': {
                this.passwordTips[index] = "";
                this.step3Ok[3] = false;
            }
        }
    },
    trim(str) {
        return str.replace(/\s+/g,"");
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
    @font-face {
        font-family: 'operations';  /* project id 952637 */
        src: url('//at.alicdn.com/t/font_952637_ut5molpe9ea.eot');
        src: url('//at.alicdn.com/t/font_952637_ut5molpe9ea.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_952637_ut5molpe9ea.woff') format('woff'),
        url('//at.alicdn.com/t/font_952637_ut5molpe9ea.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_952637_ut5molpe9ea.svg#iconfont') format('svg');
    }
    .footer {
        z-index: 2;
    }
        .mt20 {
            margin-top: 20px;
        }
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
                    font-size: 16px;
                    color: #000000;
                    letter-spacing: 0;
                    line-height: 24px;
                }
            }
            &.step1 {
                .content-form {
                    margin-top: 40px;
                    .section {
                        margin-bottom: 20px;
                        .input-content{
                            .bar-input {
                                .tips-input {
                                    font-size: 12px;
                                    color: #DE3131;
                                    margin-top: 10px;
                                }
                            }
                        }
                    }
                }
            }
            &.step3 {
                .section {
                    margin-bottom: 20px;
                }
            }
            .content-form {
                &.used-phone-data {
                    margin-top: 100px;
                    .group {
                        position: relative;
                        .section {
                            .input-content {
                                .forgoten-content {
                                    margin-left: 0;
                                }
                                .bar-input {
                                    margin-bottom: 0;
                                }
                                .tips-input {
                                    font-size: 12px;
                                    color: #DE3131;
                                    margin-top: 10px;
                                }
                            }
                        }
                        .operation {
                            position: absolute;
                            top: 0;
                            left: 494px;
                            .op {
                                display: inline-block;
                                width: 26px;
                                height: 40px;
                                font-family: 'operations';
                                line-height: 40px;
                                font-size: 22px;
                                color: #387AFF;
                                cursor: pointer;
                                &.add {
                                    margin-right: 6px;
                                }
                            }
                        }
                    }
                }
                .section {
                    width: 100%;
                    text-align: left;
                    .tips-selection {
                        font-size: 12px;
                        color: #DE3131;
                        margin-left: 204px;
                        margin-top: 6px;
                    }
                    .selections-warp {
                        display: inline-block;
                        :first-child {
                            margin-top: 0;
                        }
                        .operations {
                            display: inline-block;
                            margin-left: 10px;
                            vertical-align: middle;
                            
                            .op {
                                display: inline-block;
                                width: 26px;
                                height: 26px;
                                font-family: 'operations';
                                line-height: 26px;
                                font-size: 22px;
                                color: #387AFF;
                                cursor: pointer;
                                &.add {
                                    margin-right: 6px;
                                }
                            }
                        } 
                        .tips {
                            margin-left:10px;
                        }
                    }
                    .select-label, .label-input {
                        display: inline-block;
                        width: 190px;
                        height: 42px;
                        line-height: 42px;
                        text-align: right;
                        vertical-align: top;
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
                            .tips-input {
                                font-size: 12px;
                                color: #DE3131;
                                margin-top: 10px;
                            }
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
                                &.error {
                                    border-color: #DE3131;
                                }
                                input {
                                    font-size:14px;
                                    line-height: 20px;
                                    height: 20px;
                                    display: inline-block;
                                    width: 100%;
                                    &:disabled {
                                        background-color: #ffffff;
                                    }
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
                                    font-family: 'operations';
                                    line-height: 26px;
                                    font-size: 22px;
                                    color: #387AFF;
                                    cursor: pointer;
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
                        .el-date-editor.el-input, .el-date-editor.el-input__inner {
                            width: 284px;
                        }
                    }
                    .phone-type-tips {
                        width: 268px;
                        margin-top: 8px;
                        p {
                            opacity: 0.4;
                            font-size: 14px;
                            color: #000000;
                            letter-spacing: 0;
                            line-height: 24px;
                        }
                    }
                    .forgoten-content {
                        margin-left: 195px;
                        font-size: 14px;
                        margin-top: 8px;
                        .mz_checkbox-label {
                            opacity: 0.4;
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
            .btn-next {
                &.long-btn {
                    width: 288px;
                }
            }
            .btn-back {
                margin-right: 12px;
            }
        }
</style>
