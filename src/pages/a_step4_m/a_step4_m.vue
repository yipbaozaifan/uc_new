<template>
    <div id="app">
        <div class="steps-warp">
            <mzprogress :steps="steps" :actived="3" size="58" line-length="188"></mzprogress>
        </div>
        <h1 class="title">填写申诉材料</h1>
        <div class="tips-bar">
            <p class="complaint-text">为了账号安全，请尽量多提供账号使用资料以帮助我们判断你是号码主人，而非盗号者。即使你对某些答案不确定，也可提供你认为正确的答案</p>
        </div>
        <div class="main step3">
            <div class="content content-form">
                <div class="section">
                    <div class="section-title">
                        <p>注册信息</p>
                    </div>
                    <div class="content select-content">
                        <!--<div class="date-picker">
                            <el-date-picker
                                v-model="RegTime"
                                type="date"
                                placeholder="选择注册日期"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                                @change="handleChangeDate">
                            </el-date-picker>
                        </div>-->
                        <div class="picker-opener" @click="openPicker" :class="{
                            'error': showRegTimeTips
                        }">
                            <div class="opener-main">
                                <p class="opener-name">注册时间</p>
                                <p class="opener-desc" v-show="regTime == ''">必填</p>
                                <p class="opener-desc" v-show="regTime">{{regTime}}</p>
                            </div>
                        </div>
                        <mt-datetime-picker
                            ref="picker"
                            type="date"
                            year-format="{value} 年"
                            month-format="{value} 月"
                            date-format="{value} 日"
                            :start-date="new Date(1990,0,1)"
                            :end-date="new Date()"
                            @confirm="confirmTime"
                            v-model="RegTime">
                        </mt-datetime-picker>
                        <p class="tips tips-selection" v-show="showRegTimeTips">{{dateTips}}</p>
                    </div>
                    <div class="content select-content">
                        <div class="picker-opener" @click="showPickLand(-1)" :class="{
                            'error': showRegLandTips
                        }">
                            <div>
                                <p class="opener-name">注册地</p>
                                <p class="opener-desc" v-show="!choosenRegLand">必填</p>
                                <p class="opener-desc" v-show="choosenRegLand">{{regLand[0] + ' - ' + regLand[1]}}</p>
                            </div>
                        </div>
                        <p class="tips tips-selection" v-show="showRegLandTips">{{regLandTips}}</p>
                    </div>
                    <div class="content select-content" v-for="(item, index) in usedLand" :key="index">
                        <div class="picker-opener" :class="{
                            'error': showUsedLandTips
                        }">
                            <div @click="showPickLand(index)">
                                <p class="opener-name">常用地</p>
                                <p class="opener-desc" v-show="choosenUsedLand[index] == '' && index == 0">必填</p>
                                <p class="opener-desc" v-show="choosenUsedLand[index]">{{item.p + ' - ' + item.c}}</p>
                            </div>
                            <div class="operations">
                                <span class="op add" @click="handleAdd('usedLand')" v-show="index == 0 && choosenUsedLand[index] && choosenUsedLand.length < 5">&#xe648;</span>
                                <span class="op sub" @click="handleSub(index, 'usedLand')" v-show="index > 0">&#xe60b;</span>
                            </div>
                        </div>
                        <p class="tips tips-selection" v-show="showUsedLandTips">{{usedLandTips}}</p>
                    </div>
                    <mt-popup v-model="pickLand" class="landPicker-bar">
                        <mt-picker :slots="citySlots" @change="onCityChange" v-show="pickLandIndex == -1">
                        </mt-picker>
                        <mt-picker :slots="citySlots" v-show="pickLandIndex != -1" @change="onUsedChange">
                        </mt-picker>
                        <div class="popup-footer">
                            <a class="popup-btn" @click="confirmLand">确定</a>
                        </div>
                    </mt-popup>
                </div>
            </div>
        </div>
        <div class="main step1">
            <div class="content content-form">
                <div class="section">
                    <div class="section-title">
                        <p>账号曾用信息</p>
                    </div>
                    <div>
                        <div class="content input-content" v-for="(item, index) in usedPassword" :key="index">
                            <div class="bar bar-input" :class="{
                                'focus': showPwdLabel[index],
                                'error': passwordTips[index],
                            }">
                                <div class="outer-input" v-show="!forgotPwd">
                                    <input type="password" placeholder="请输入曾用密码" v-model="usedPassword[index]" @input="handleInput('password', index)" @focus="handleFocus(showPwdLabel, index)" @blur="handleBlur(showPwdLabel, index)">
                                </div>
                                <a class="forgot-btn" v-show="index == 0 && usedPassword[index] == '' && !forgotPwd" @click="forgotPwd = true">
                                    忘记密码
                                </a>
                                <div class="forgoten" v-show="forgotPwd" @click="forgotPwd = false">
                                    忘记密码
                                </div>
                                <div class="operations">
                                    <span class="op add" @click="handleAdd('password')" v-show="index == 0 && usedPassword[index] && usedPassword.length < 5">&#xe648;</span>
                                    <span class="op sub" @click="handleSub(index, 'password')" v-show="index > 0">&#xe60b;</span>
                                </div>
                            </div>
                            <p class="tips tips-input" v-show="passwordTips[index]">{{passwordTips[index]}}</p>
                            <span class="label-input" 
                                :class="{
                                    'focus': showPwdLabel[index]
                                }" 
                                v-show="showPwdLabel[index] || usedPassword[index] || forgotPwd">曾用密码</span>
                        </div>
                    </div>
                    <div>
                        <div class="content input-content" v-for="(item, index) in nicknames" :key="index">
                            <div class="bar bar-input" :class="{
                                'focus': showNickLabel[index],
                                'error': nicknameTips[index],
                            }">
                                <div class="outer-input" v-show="!forgotNickname">
                                    <input type="text" placeholder="请输入曾用昵称" v-model="nicknames[index]" @input="handleInput('nickname', index)" @focus="handleFocus(showNickLabel, index)" @blur="handleBlur(showNickLabel, index)">
                                </div>
                                <a class="forgot-btn" v-show="index == 0 && nicknames[index] == '' && !forgotNickname" @click="forgotNickname = true">
                                    忘记昵称
                                </a>
                                <div class="forgoten" v-show="forgotNickname" @click="forgotNickname = false">
                                    忘记昵称
                                </div>
                                <div class="operations">
                                    <span class="op add" @click="handleAdd('nickname')" v-show="index == 0 && nicknames[index] && nicknames.length < 5">&#xe648;</span>
                                    <span class="op sub" @click="handleSub(index, 'nickname')" v-show="index > 0">&#xe60b;</span>
                                </div>
                            </div>
                            <p class="tips tips-input" v-show="nicknameTips[index]">{{nicknameTips[index]}}</p>
                            <span class="label-input" 
                                :class="{
                                    'focus': showNickLabel[index]
                                }" 
                                v-show="showNickLabel[index] || nicknames[index] || forgotNickname">曾用昵称</span>
                        </div>
                    </div>
                    <div>
                       <div class="content input-content" v-for="(item, index) in emails" :key="index">
                            <div class="bar bar-input" :class="{
                                'focus': showEmailLabel[index],
                                'error': emailsTips[index],
                            }">
                                <div class="outer-input" v-show="!forgotMail">
                                    <input type="text" placeholder="请输入曾用邮箱" v-model="emails[index]" :disabled="forgotMail" @input="handleInput('email', index)" @focus="handleFocus(showEmailLabel, index)" @blur="handleBlur(showEmailLabel, index)">
                                </div>
                                <div class="operations">
                                    <span class="op add" @click="handleAdd('email')" v-show="index == 0 && emails[index] && emails.length < 5">&#xe648;</span>
                                    <span class="op sub" @click="handleSub(index, 'email')" v-show="index > 0">&#xe60b;</span>
                                </div>
                                <a class="forgot-btn" v-show="index == 0 && emails[index] == '' && !forgotMail" @click="forgotMail = true">
                                    未绑定过邮箱
                                </a>
                                <div class="forgoten" v-show="forgotMail" @click="forgotMail = false">
                                    未绑定过邮箱
                                </div>
                            </div>
                            <p class="tips tips-input" v-show="emailsTips[index]">{{emailsTips[index]}}</p>
                            <span class="label-input" 
                                :class="{
                                    'focus': showEmailLabel[index]
                                }" 
                                v-show="showEmailLabel[index] || emails[index] || forgotMail">曾用邮箱</span>
                        </div> 
                    </div>
                    <div>
                       <div class="content input-content" v-for="(item, index) in phones" :key="index">
                            <div class="bar bar-input" :class="{
                                'focus': showPhoneLabel[index],
                                'error': phonesTips[index],
                            }">
                                <div class="outer-input" v-show="!forgotPhone">
                                    <input type="text" placeholder="请输入曾用手机号" v-model="phones[index]" @input="handleInput('phones', index)" @focus="handleFocus(showPhoneLabel, index)" @blur="handleBlur(showPhoneLabel, index)">
                                </div>
                                <div class="operations">
                                    <span class="op add" @click="handleAdd('phones')" v-show="index == 0 && phones[index] && phones.length < 5">&#xe648;</span>
                                    <span class="op sub" @click="handleSub(index, 'phones')" v-show="index > 0">&#xe60b;</span>
                                </div>
                                <a class="forgot-btn" v-show="index == 0 && phones[index] == '' && !forgotPhone" @click="forgotPhone = true">
                                    未绑定过手机号
                                </a>
                                <div class="forgoten" v-show="forgotPhone" @click="forgotPhone = false">
                                    未绑定过手机号
                                </div>
                            </div>
                            <p class="tips tips-input" v-show="phonesTips[index]">{{phonesTips[index]}}</p>
                            <span class="label-input" 
                                :class="{
                                    'focus': showPhoneLabel[index]
                                }" 
                                v-show="showPhoneLabel[index] || phones[index] || forgotPhone">曾用手机号</span>
                        </div> 
                    </div>
                    <div v-for="(item, index) in usedPhoneType" :key="index">
                       <div class="content input-content">
                            <div class="bar bar-input" :class="{
                                'focus': item.showPhoneTypeLabel
                            }">
                                <div class="outer-input" v-show="!noLoginPhone">
                                    <input type="text" placeholder="请输入曾用手机型号" v-model="item.phoneType" @input="item.phoneTypeTips = '';item.phoneIdTips = ''" @focus="item.showPhoneTypeLabel = true" @blur="item.showPhoneTypeLabel = false">
                                </div>
                                <div class="operations">
                                    <span class="op add" @click="handleAdd('phoneType')" v-show="index == 0 && item.phoneType && usedPhoneType.length < 5">&#xe648;</span>
                                    <span class="op sub" @click="handleSub(index, 'phoneType')" v-show="index > 0">&#xe60b;</span>
                                </div>
                                <a class="forgot-btn" v-show="index == 0 && item.phoneType == '' && !noLoginPhone" @click="noLoginPhone = true">
                                    未登录过手机
                                </a>
                                <div class="forgoten" v-show="noLoginPhone" @click="noLoginPhone = false">
                                    未登录过手机
                                </div>
                            </div>
                            <p class="tips tips-input" v-show="item.phoneTypeTips">{{item.phoneTypeTips}}</p>
                            <span class="label-input" 
                                :class="{
                                    'focus': item.showPhoneTypeLabel
                                }" 
                                v-show="item.showPhoneTypeLabel || item.phoneType || noLoginPhone">曾用手机型号</span>
                        </div>
                        <div class="content input-content" v-show="!noLoginPhone">
                            <div class="bar bar-input" :class="{
                                'focus': item.showPhoneIdLabel
                            }">
                                <div class="outer-input" v-show="!item.noPhoneId">
                                    <input type="text" placeholder="请填写曾用手机序列号" v-model="item.phoneId" @input="item.phoneIdTips = '';item.phoneTypeTips = ''" @focus="item.showPhoneIdLabel = true" @blur="item.showPhoneIdLabel = false">
                                </div>
                                <a class="forgot-btn" v-show="item.phoneId == '' && !item.noPhoneId" @click="item.noPhoneId = true;item.phoneIdTips = '';item.phoneTypeTips = ''">
                                    无法提供序列号
                                </a>
                                <div class="forgoten" v-show="item.noPhoneId" @click="item.noPhoneId = false">
                                    无法提供序列号
                                </div>
                            </div>
                            <p class="tips tips-input" v-show="item.phoneIdTips">{{item.phoneIdTips}}</p>
                            <span class="label-input" 
                                :class="{
                                    'focus': item.showPhoneIdLabel
                                }" 
                                v-show="item.showPhoneIdLabel || item.phoneId || item.noPhoneId">曾用手机序列号</span>
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
            <div class="modal-main" v-show="!overTime">
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
        </mz-modal>
    </div>
</template>

<script>
import mzprogress from '../../components/progress/progress_m.vue';
import btn from '../../components/button/button_m.vue';
import mzCheckbox from '../../components/checkbox/mzCheckbox.vue';
import axios from 'axios';
import mzModal from '../../components/mzModal/mzModal_m.vue';
import { getParams } from '../../assets/utils.js';
const address = {
    '北京': ['北京'],
    '广东': ['广州', '深圳', '珠海', '汕头', '韶关', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
    '上海': ['上海'],
    '天津': ['天津'],
    '重庆': ['重庆'],
    '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
    '江苏': ['南京', '苏州', '无锡', '常州', '镇江', '南通', '泰州', '扬州', '盐城', '连云港', '徐州', '淮安', '宿迁'],
    '湖北': ['武汉', '黄石', '十堰', '荆州', '宜昌', '襄樊', '鄂州', '荆门', '孝感', '黄冈', '咸宁', '随州', '恩施土家族苗族自治州', '仙桃', '天门', '潜江', '神农架林区'],
    '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
    '陕西': ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
    '河北': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
    '山西': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
    '河南': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店'],
    '吉林': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边朝鲜族自治州'],
    '黑龙江': ['哈尔滨', '齐齐哈尔', '鹤岗', '双鸭山', '鸡西', '大庆', '伊春', '牡丹江', '佳木斯', '七台河', '黑河', '绥化', '大兴安岭地区'],
    '内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '锡林郭勒盟', '兴安盟', '阿拉善盟'],
    '山东': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '莱芜', '临沂', '德州', '聊城', '滨州', '菏泽'],
    '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '巢湖', '六安', '亳州', '池州', '宣城'],
    '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
    '福建': ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'],
    '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西土家族苗族自治州'],
    '广西': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
    '江西': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
    '贵州': ['贵阳', '六盘水', '遵义', '安顺', '铜仁地区', '毕节地区', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
    '云南': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州', '大理白族自治州', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州'],
    '西藏': ['拉萨', '那曲地区', '昌都地区', '林芝地区', '山南地区', '日喀则地区', '阿里地区'],
    '海南': ['海口', '三亚', '五指山', '琼海', '儋州', '文昌', '万宁', '东方', '澄迈县', '定安县', '屯昌县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县'],
    '甘肃': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '酒泉', '张掖', '庆阳', '平凉', '定西', '陇南', '临夏回族自治州', '甘南藏族自治州'],
    '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
    '青海': ['西宁', '海东地区', '海北藏族自治州', '海南藏族自治州', '黄南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
    '新疆': ['乌鲁木齐', '克拉玛依', '吐鲁番地区', '哈密地区', '和田地区', '阿克苏地区', '喀什地区', '克孜勒苏柯尔克孜自治州', '巴音郭楞蒙古自治州', '昌吉回族自治州', '博尔塔拉蒙古自治州', '石河子', '阿拉尔', '图木舒克', '五家渠', '伊犁哈萨克自治州'],
    '香港': ['香港'],
    '澳门': ['澳门'],
    '台湾': ['台北市', '高雄市', '台北县', '桃园县', '新竹县', '苗栗县', '台中县', '彰化县', '南投县', '云林县', '嘉义县', '台南县', '高雄县', '屏东县', '宜兰县', '花莲县', '台东县', '澎湖县', '基隆市', '新竹市', '台中市', '嘉义市', '台南市']
};
const parr = Object.keys(address);
export default {
  name: 'app',
  components: {
    mzprogress,
    btn,
    mzCheckbox,
    mzModal,
  },
  watch: {
      noLoginPhone(newValue, oldValue) {
          if (newValue) {
              this.usedPhoneType = [
                  {
                    phoneType: '',
                    phoneId: '',
                    noPhoneId: false,
                    showPhoneTypeLabel: false,
                    showPhoneIdLabel: false,
                    phoneTypeTips: '',
                    phoneIdTips: ''
                  }
              ];
              this.phoneTypeOk = true;
          }
      },
      forgotNickname(newValue, oldValue) {
          if (newValue) {
              this.nicknames = [''];
              this.nicknameTips = [''];
              this.showNickLabel = [false];
              this.nickOk = true;
          }
      },
      forgotPwd(newValue, oldValue) {
          if (newValue) {
              this.usedPassword = [''];
              this.passwordTips = [''];
              this.showPwdLabel = [false];
              this.passwordOk = true;
          }
      },
      forgotMail(newValue, oldValue) {
          if (newValue) {
              this.emails = [''];
              this.emailsTips = [''];
              this.showEmailLabel = [false];
              this.emailOk = true;
          }
      },
      forgotPhone(newValue, oldValue) {
          if (newValue) {
              this.phones = [''];
              this.phonesTips = [''];
              this.showPhoneLabel = [false];
              this.phonesOk = true;
          }
      }
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
      nicknames: [''], //曾用昵称
      emails: [''], //曾用邮箱
      phones: [''], //曾用手机
      usedPassword: [''],
      passwordTips: [''],
      showPwdLabel: [false],
      nicknameTips: [''],
      showNickLabel: [false],
      emailsTips: [''],
      showEmailLabel: [false],
      phonesTips: [''],
      showPhoneLabel: [false],
      showModal: false,
      message: '',
      usedPhoneType:[
          {
              phoneType: '',
              phoneId: '',
              noPhoneId: false,
              showPhoneTypeLabel: false,
              showPhoneIdLabel: false,
              phoneTypeTips: '',
              phoneIdTips: ''
          }
      ],
      forgotNickname: false,
      forgotMail: false,
      forgotPhone: false,
      forgotPwd: false,
      hasUpload: false,
      noLoginPhone: false,
      choosenPic: null,
      RegTime: '',
      regTime: '',
      showUsedPwd: '',
      RegLand: ['', ''], 
      choosenRegLand: false,
      regLand: ['', ''],
      regLandPicker: '',
      UsedLand: {
          p: '',
          c: ''
      },
      choosenUsedLand: [false],
      usedLand:[{
          p: '',
          c: ''
      }],
      usedLandPicker: '',
      dateTips: '',
      regLandTips: '',
      usedLandTips: '',
      showRegTimeTips: false,
      showRegLandTips: false,
      showUsedLandTips: false,
      citySlots: [
        {
            flex: 1,
            values: parr,
            className: 'slot1',
            textAlign: 'center'
        }, {
            divider: true,
            content: '-',
            className: 'slot2'
        },{
            flex: 1,
            values: ['北京'],
            className: 'slot3',
            textAlign: 'center'
        }
      ],
      resetId: "",
      overTime: false,
      pickLand: false,
      pickLandIndex: -1,
      nickOk: true,
      phonesOk: true,
      emailOk: true,
      passwordOk: true,
      phoneTypeOk: true,
    }
  },
  methods: {
    next() {
        const mailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        const phoneReg = /^[0-9]*$/;
        const pwdReg = /^((?=.*?\d)(?=.*?[A-Za-z])|(?=.*?\d)(?=.*?[!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-])|(?=.*?[A-Za-z])(?=.*?[!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-]))[\dA-Za-z!@#$%^&*/().,\]\[_+{}|:;<>?'"`~-]+$/;
        const nickReg = /^[.a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        const phoneTypeReg = /^[.a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        const phoneIdReg = /^[0-9a-zA-Z]+$/;
        if (!this.regTime) {
            this.dateTips = '请选择注册时间';
            this.showRegTimeTips = true;
        }
        if (!this.regLand[0] || !this.regLand[1]) {
            this.regLandTips = '请选择注册地点';
            this.showRegLandTips = true;
        }
        let usedLandFlag = false;
        let usedLand = '';
        for (let i = 0;i < this.usedLand.length; i++) {
            if (this.usedLand[i].p !== "" && this.usedLand[i].c !== "") {
                usedLandFlag = true;
                let tempLand = `${this.usedLand[i].p}-${this.usedLand[i].c}`;
                usedLand += tempLand+',';
            }
        }
        if (!usedLandFlag) {
            this.usedLandTips = "至少填写一个常用地";
            this.showUsedLandTips = true;
        }
        if (!this.forgotPwd) {
            let checkResult = this.checkInput('password', this.usedPassword, this.passwordTips, pwdReg);
            if (checkResult != 1) {
                //this.emailFlag = false;
                this.passwordOk = false;
            } else {
                this.passwordOk = true;
            }
        }
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
            if (nickResult != 1) {
                this.nickOk = false;
                //this.nickFlag = false;
            } else {
                this.nickOk = true;
            }
        }
        if (!this.forgotMail) {
            let checkResult = this.checkInput('email', this.emails, this.emailsTips, mailReg);
            if (checkResult != 1) {
                //this.emailFlag = false;
                this.emailOk = false;
            } else {
                this.emailOk = true;
            }
        }
        if (!this.forgotPhone) {
            let checkResult = this.checkInput('phone', this.phones, this.phonesTips ,phoneReg);
            if (checkResult != 1) {
                //this.phoneFlag = false;
                this.phonesOk = false;
            } else {
                this.phonesOk = true;
            }
        }
        if (!this.noLoginPhone) {
            let phoneTypeResult = 1;
            for(let i = 0;i < this.usedPhoneType.length; i ++) {
                if (this.usedPhoneType[i].phoneType == "" && !this.usedPhoneType[i].noPhoneId && this.usedPhoneType[i].phoneId == '') {
                    this.usedPhoneType[i].phoneIdTips = "请填写曾用手机序列号";
                    this.usedPhoneType[i].phoneTypeTips =  "请填写曾用手机型号";
                    phoneTypeResult = 2;
                } else if(this.usedPhoneType[i].phoneType!="" || this.usedPhoneType[i].phoneId != "") {
                    if (this.usedPhoneType[i].phoneType!="") {
                        if (this.getLen(this.trim(this.usedPhoneType[i].phoneType))<2 || this.getLen(this.trim(this.usedPhoneType[i].phoneType))>32) {
                            this.usedPhoneType[i].phoneTypeTips = "设备名只允许输入2-32位中英文、数字、下划线";
                            phoneTypeResult = 0;
                        }
                        if (!phoneTypeReg.test(this.trim(this.usedPhoneType[i].phoneType))) {
                            this.usedPhoneType[i].phoneTypeTips = "设备名只允许输入2-32位中英文、数字、下划线";
                            phoneTypeResult = 0;
                        }
                    }
                    if (this.usedPhoneType[i].phoneId != "") {
                        if (!phoneIdReg.test(this.usedPhoneType[i].phoneId)) {
                            this.usedPhoneType[i].phoneIdTips = "请输入正确的序列号";
                            phoneTypeResult = 0;
                        }
                    }
                }
            }
            if (phoneTypeResult!=1) {
                this.phoneTypeOk = false;
            } else {
                this.phoneTypeOk = true;
            }
        }
        if (this.showRegTimeTips || this.showRegLandTips || this.showUsedLandTips || !this.passwordOk || !this.nickOk || !this.emailOk || !this.phonesOk || !this.phonesOk || !this.phoneTypeOk) {
            return 
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
        const regLand = this.regLand[0] + '-' + this.regLand[1];
        /*let usedLand = '';
        for (let i = 0;i < this.usedLand.length; i++) {
            if (this.usedLand[i].p !== "" && this.usedLand[i].c !== "") {
                let tempLand = `${this.usedLand[i].p}-${this.usedLand[i].c}`;
                usedLand += tempLand+',';
            }
        }*/
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
            regDate: this.RegTime.getFullYear() + '-' + (this.RegTime.getMonth()+1) + '-' + this.RegTime.getDate(),
            commonUsedLocation: usedLand.substring(0, usedLand.length-1),
            resetId: this.resetId,
            nameUsedBeforeList: useNickName.substring(0, useNickName.length-1),
            emailUsedBeforeList: usedEmails.substring(0, usedEmails.length-1),
            deviceUsedBeforeList: usedPhoneTypes.substring(0, usedPhoneTypes.length-1),
            phoneUsedBeforeList: usedPhones.substring(0, usedPhones.length-1),
            passwordUsedBeforeList: usedPwd.substring(0, usedPwd.length-1),
            snUsedBeforeList: usedPhoneIds.substring(0, usedPhoneIds.length-1),
        }
        axios.post('/uc/system/webjsp/resetpwd/addEvidence', data).then((res) => {
            if (res.data.code == 200) {
                let gotoUrl = '';
                if (res.data.value.phone) {
                    location.replace(`/complaint/step5?account=${this.account}&resetId=${res.data.value.resetId}&vcode=${res.data.value.areacode}&phone=${res.data.value.phone}`);
                } else {
                    location.replace(`/complaint/step5?account=${this.account}&resetId=${res.data.value.resetId}`);
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
    checkInput(type,inputList,tipsList,rule) {
        let flag = false;
        let tips = '';
        let result = 1; // -1通过，-2空错误，非负数不合法
        for (let i=0;i<inputList.length;i++) {
            if (inputList[i] !== "") { // 判断空值
               flag = true;
               if (type == 'password' && (inputList[i].length < 8 || inputList.length > 16)) {
                   this.$set(tipsList, i, '密码应为8~16个字符，区分大小写')
                   result = 2;
               } else if (rule && !rule.test(inputList[i])) { // 若有条件参数，则进一步判断条件
                    // 提示不合法
                    if (type == 'email') {
                        this.$set(tipsList, i, '输入邮箱格式不正确')
                    } else if (type == 'phone') {
                        this.$set(tipsList, i, '输入手机格式不正确')
                    } else if (type == 'password') {
                        this.$set(tipsList, i, '密码至少包含数字、字母和符号两种类型')
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
                this.$set(tipsList, 0, '请输入曾用手机')
            } else if (type == 'password') {
                this.$set(tipsList, 0, '请输入曾用密码')
            }
            result = 0; //输入框列表都未空
        }
        return result;
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
    contactInput(list) {
        let result = '';
        for ( let i = 0; i < list.length; i++ ) {
            if (list[i] != "") {
                result = result + list[i] + ",";
            }
        }
        return result;
    },
    onCityChange(picker, values) {
        this.regLandPicker = picker;
        picker.setSlotValues(1, address[values[0]]);
        this.RegLand[0] = values[0];
        this.RegLand[1] = values[1];
    },
    onUsedChange(picker, values) {
        this.usedLandPicker = picker;
        picker.setSlotValues(1, address[values[0]]);
        this.UsedLand.p = values[0];
        this.UsedLand.c = values[1];
    },
    handleChangeDate() {
        this.showRegTimeTips = false;
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
                if (this.nicknames.length < 5) {
                    this.nicknames.push('');
                    this.nicknameTips.push('');
                    this.showNickLabel.push(false);
                }
                break;
            }
            case 'email': {
                if (this.emails.length < 5) {
                    this.emails.push('');
                    this.emailsTips.push('');
                    this.showEmailLabel.push(false);
                }
                break;
            }
            case 'phones': {
                if (this.phones.length < 5) {
                    this.phones.push('');
                    this.phonesTips.push('');
                    this.showPhoneLabel.push(false);
                }
                break;
            }
            case 'phoneType': {
                if (this.usedPhoneType.length < 5) {
                    this.usedPhoneType.push({
                        phoneType: '',
                        phoneId: '',
                        noPhoneId: false,
                        showPhoneTypeLabel: false,
                        showPhoneIdLabel: false,
                        phoneTypeTips: '',
                        phoneIdTips: ''
                    });
                }
                break;
            }
            case 'usedLand': {
                if (this.usedLand.length < 5) {
                    this.usedLand.push({
                        p: '',
                        c: ''
                    });
                    this.choosenUsedLand.push(false);
                }
                break;
            }
            case 'password': {
                if (this.usedPassword.length < 5) {
                    this.usedPassword.push('');
                    this.passwordTips.push('');
                    this.showPwdLabel.push(false);
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
                this.showNickLabel.splice(index, 1);
                break;
            }
            case 'email': {
                this.emails.splice(index,1);
                this.emailsTips.splice(index, 1);
                this.showEmailLabel.splice(index, 1);
                break;
            }
            case 'phones': {
                this.phones.splice(index,1);
                this.phonesTips.splice(index, 1);
                this.showPhoneLabel.splice(index, 1);
                break;
            }
            case 'password': {
                this.usedPassword.splice(index,1);
                this.passwordTips.splice(index, 1);
                this.showPwdLabel.splice(index, 1);
                break;
            }
            case 'phoneType': {
                this.usedPhoneType.splice(index, 1);
                break;
            }
            case 'usedLand': {
                this.usedLand.splice(index, 1);
                this.choosenUsedLand.splice(index, 1);
                break;
            }
        }
    },
    handleForgot(type) {
        type = true;
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
            case 'password': {
                this.passwordTips[index] = "";
                break;
            }
        }
    },
    handleBlur(labelList, index) {
        this.$set(labelList, index, false);
    },
    handleFocus(labelList, index) {
        this.$set(labelList, index, true);;
    },
    openPicker() {
        this.$refs.picker.open();
    },
    showPickLand(index) {
        if (index != -1) { // 常用地址选择
            this.pickLandIndex = index;
            if (this.usedLand[this.pickLandIndex].p && this.usedLand[this.pickLandIndex].c) {
                this.usedLandPicker.setSlotValue(0, this.usedLand[this.pickLandIndex].p);
                this.usedLandPicker.setSlotValue(1, this.usedLand[this.pickLandIndex].c);
            } 
        } else { // 注册地址选择
            this.pickLandIndex = -1;
            if (this.regLand[0] && this.regLand[1]) {
                this.regLandPicker.setSlotValue(0, this.regLand[0]);
                this.regLandPicker.setSlotValue(1, this.regLand[1]);
            }   
        }
        this.pickLand = true;
    },
    confirmLand() {
        if (this.pickLandIndex == -1) {
            this.choosenRegLand = true;
            this.regLand[0] = this.RegLand[0];
            this.regLand[1] = this.RegLand[1];
            this.showRegLandTips = false;
        } else {
            this.choosenUsedLand[this.pickLandIndex] = true;
            this.usedLand[this.pickLandIndex].p = this.UsedLand.p;
            this.usedLand[this.pickLandIndex].c = this.UsedLand.c;
            this.showUsedLandTips = false;
        }
        this.pickLand = false;
    },
    confirmTime() {
        this.regTime = this.RegTime.getFullYear() + '-' + (this.RegTime.getMonth()+1) + '-' + this.RegTime.getDate();
        this.showRegTimeTips = false;
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
    @import '../../assets/base_m.scss';
    @font-face {
        font-family: 'operations';  /* project id 952637 */
        src: url('//at.alicdn.com/t/font_952637_ut5molpe9ea.eot');
        src: url('//at.alicdn.com/t/font_952637_ut5molpe9ea.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_952637_ut5molpe9ea.woff') format('woff'),
        url('//at.alicdn.com/t/font_952637_ut5molpe9ea.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_952637_ut5molpe9ea.svg#iconfont') format('svg');
    }
        .mt30 {
            margin-top: 30px;
        }
        .title {
            text-align: center;
            font-weight: 600;
            margin-bottom: 0;
        }
        .tips-bar{
            margin-top: px2vw(21);
            padding: 0 px2vw(48);
            p {
                font-size: 12px;
                color: #000000;
                letter-spacing: 0;
                line-height: px2vw(54);
            }
        }
        .main {
            margin: 0 auto;
            &.step1 {
                .content-form {
                    .section {
                        .input-content{
                            padding: 0 px2vw(48);
                            box-sizing: border-box;
                            position: relative;
                            margin-top: px2vw(39);
                            .bar-input {
                                border-bottom: 1px solid rgba(0,0,0,0.10);
                                padding-top: px2vw(72);
                                padding-bottom: px2vw(27);
                                box-sizing: border-box;
                                position: relative;
                                &.focus {
                                    border-color: #198DED;
                                }
                                &.error {
                                    border-color: #DE3131;
                                }
                                .operations {
                                    display: inline-block;
                                    position: absolute;
                                    top: px2vw(72);
                                    right: 0;
                                    .op {
                                        display: inline-block;
                                        width: px2vw(60);
                                        height: px2vw(60);
                                        font-family: 'operations';
                                        line-height: px2vw(60);
                                        font-size: 22px;
                                        color: #387AFF;
                                    }
                                }
                                .forgoten{
                                    width: 100%;
                                    background-color: #ffffff;
                                    font-size: 16px;
                                    line-height: 20px;
                                }
                                .forgot-btn {
                                    background-color: #ffffff;
                                    color: #198DED;
                                    font-size: 14px;
                                    line-height: 20px;
                                    float: right;
                                }
                            }
                            .tips-input {
                                font-size: 12px;
                                color: #DE3131;
                                margin-top: 3px;
                            }
                            .label-input {
                                position: absolute;
                                top: px2vw(16);
                                left: px2vw(49);
                                opacity: 0.4;
                                font-size: 12px;
                                color: #000000;
                                letter-spacing: 0;
                                &.focus {
                                    opacity: 1;
                                    color: #198DED;
                                }
                            }
                        }
                    }
                }
            }
            .content-form {
                .section {
                    width: 100%;
                    text-align: left;
                    .section-title {
                        font-size: 12px;
                        background-color: #f2f2f2;
                        height: px2vw(108);
                        line-height: px2vw(108);
                        padding: 0 px2vw(48);
                        text-align: left;
                        p {
                            opacity: 0.4;
                        }
                    }
                    .tips-selection {
                        font-size: 12px;
                        color: #DE3131;
                        margin-top: 6px;
                    }
                    .selections-warp {
                        display: inline-block;
                        :first-child {
                            margin-top: 0;
                        }
                        .tips {
                            margin-left:10px;
                        }
                    }
                    .select-label {
                        display: inline-block;
                        width: 190px;
                        height: 42px;
                        line-height: 42px;
                        text-align: right;
                        vertical-align: top;
                    }
                    .select-content {
                        width: 100%;
                        padding: 0 px2vw(48);
                        box-sizing: border-box;
                        margin-bottom: px2vw(39);
                        .picker-opener {
                            border-bottom: 1px solid rgba(0,0,0,0.10);
                            padding: px2vw(39) 0;
                            box-sizing: border-box;
                            height: px2vw(186);
                            position: relative;
                            &.error {
                                border-color: #DE3131;
                            }
                            .operations {
                                display: inline-block;
                                position: absolute;
                                top: px2vw(72);
                                right: 0;
                                .op {
                                    display: inline-block;
                                    width: px2vw(60);
                                    height: px2vw(60);
                                    font-family: 'operations';
                                    line-height: px2vw(60);
                                    font-size: 22px;
                                    color: #387AFF;
                                }
                            }
                        }
                        .opener-name {
                            font-size: 16px;
                            color: #000000;
                            text-align: left;
                            line-height: px2vw(57);
                        }
                        .opener-desc {
                            opacity: 0.4;
                            font-family: FlymeRegular;
                            font-size: 12px;
                            color: #000000;
                            text-align: left;
                            line-height: px2vw(42);
                        }
                    }
                    .input-content {
                        .bar-input {
                            font-size: 0;
                            .tips-input {
                                font-size: 12px;
                                color: #DE3131;
                                margin-top: 10px;
                            }
                            &.last-input {
                                margin-bottom: 0;
                            }
                            .outer-input {
                                width: px2vw(660);
                                vertical-align: middle;
                                display: inline-block;
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
                        }
                    }
                }
            }
        }
        .content-btn {
            margin-top: 80px;
            .btn-next {
                display: inline-block;
                width: px2vw(720);
                margin-top: 0;  
            }
        }
        .popup-footer {
            width: 100%;
            padding: px2vw(48);
            box-sizing: border-box;
            text-align: center;
            .popup-btn {
                font-size: 14px;
                color: #198DED;
                letter-spacing: 0;
            }
        }
        .landPicker-bar {
            width: px2vw(936);
        }
        .modal {
            position: fixed !important;
        }
        .mask {
            position: fixed;
        }
</style>
