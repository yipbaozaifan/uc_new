<template>
    <div class="input" :class="{
            'showtips': showTips
        }">
        <span class="label-input">{{label}}</span>
        <div class="input-bar" :class="{
            'error-tips': showTips
        }">
            <span class="country-code" v-show="showCode" @click="showSelectCycode">
                <span class="country-code-selected">+{{countryCode.code}}</span>
                <i class="arrow-down">&#xe629;</i>
            </span>
            <input :type="inptype || defaultType" :placeholder="placeholder" :class="[
                type,
                {'showcode': showCode}
            ]" @keyup="handleKeyUp" @input="$emit('input', $event.target.value)" @blur="emitBlur($event)" v-model="inputValue" :maxlength="maxlen" :disabled="disabled">
            <span class="imgkey-container" v-if="type === 'imgCode'">
                <span class="hr"></span>
                <img :src="imgkey" alt="验证码" class="img img-key" :title="title" @click="getImageKey">
            </span>
            <span class="getcode-container" v-if="type === 'phoneCode'">
                <span class="hr"></span>
                <span class="state" :class="[phoneCodeState, {'invalid': invalid}]" @click="handleSend">{{resendState?resendText:getState}}</span>
            </span>
            <span class="show-pwd-container" v-if="type === 'password'">
                <i class="iconfont" @click="toggleShowPwd" v-show="unShow">&#xeed2;</i>
                <i class="iconfont" @click="toggleShowPwd" v-show="!unShow">&#xeee6;</i>
            </span>
            <div class="container cycode-container" v-show="changeCycode">
                <div class="cycode-list">
                    <div class="cycode-group" v-for="(group,gindex) in countryCodeList" :key="gindex">
                        <div class="cycode-group-name">{{group.name}}</div>
                        <ul class="group-list">
                            <li class="cycode-item" v-for="(item, index) in group.cycodes" :key="index" @click="handleSelect(gindex,index)">
                                <span class="cycode-country">{{item.country}}</span>
                                <span class="cycode-code">+{{item.code}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="tips tips-input" v-show="showTips">
            <span>{{tips}}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: String,
        placeholder: String,
        type: String,
        inptype: String,
        maxlen: [String, Number],
        code: String,
        getState: {
            type: String,
            default: '获取验证码',
        },
        resend: {
            type: String,
            default: '重新发送',
        },
        title: {
            type: String,
            default: '点击可刷新验证码',
        },
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            countryCode: {
                code: '86',
                country: '中国'
            },
            countryCodeList: [
                {
                    name: '常用',
                    cycodes: [
                        {
                            country: "中国",
                            code: "86",
                            brief: "CN"
                        }, {
                            country: "中国台湾",
                            code: "886",
                            brief: "TW"
                        }, {
                            country: "中国香港",
                            code: "852",
                            brief: "HK"
                        }, {
                            country: "Brazil",
                            code: "55",
                            brief: "BR"
                        }, {
                            country: "India",
                            code: "91",
                            brief: "IN"
                        }, {
                            country: "Indonesia",
                            code: "62",
                            brief: "ID"
                        }, {
                            country: "Malaysia",
                            code: "60",
                            brief: "MY"
                        }
                    ]
                },
                {
                    name: 'A',
                    cycodes: [
                        {
                            brief: "AD",
                            country: "Andorra",
                            code: "376"
                        }, {
                            brief: "AF",
                            country: "Afghanistan",
                            code: "93"
                        }, {
                            brief: "AG",
                            country: "Antigua and Barbuda",
                            code: "1"
                        }, {
                            brief: "AI",
                            country: "Anguilla",
                            code: "1"
                        }, {
                            brief: "AL",
                            country: "Albania",
                            code: "355"
                        }, {
                            brief: "AM",
                            country: "Armenia",
                            code: "374"
                        }, {
                            brief: "AO",
                            country: "Angola",
                            code: "244"
                        }, {
                            brief: "AR",
                            country: "Argentina",
                            code: "54"
                        }, {
                            brief: "AS",
                            country: "American Samoa",
                            code: "1"
                        }, {
                            brief: "AT",
                            country: "Austria",
                            code: "43"
                        }, {
                            brief: "AU",
                            country: "Australia",
                            code: "61"
                        }, {
                            brief: "AW",
                            country: "Aruba",
                            code: "297"
                        }, {
                            brief: "AZ",
                            country: "Azerbaijan",
                            code: "994"
                        }, {
                            brief: "DZ",
                            country: "Algeria",
                            code: "213"
                        }],
                        B: [{
                            brief: "BA",
                            country: "Bosnia and Herzegovina",
                            code: "387"
                        }, {
                            brief: "BB",
                            country: "Barbados",
                            code: "1"
                        }, {
                            brief: "BD",
                            country: "Bangladesh",
                            code: "880"
                        }, {
                            brief: "BE",
                            country: "Belgium",
                            code: "32"
                        }, {
                            brief: "BF",
                            country: "Burkina Faso",
                            code: "226"
                        }, {
                            brief: "BG",
                            country: "Bulgaria",
                            code: "359"
                        }, {
                            brief: "BH",
                            country: "Bahrain",
                            code: "973"
                        }, {
                            brief: "BI",
                            country: "Burundi",
                            code: "257"
                        }, {
                            brief: "BJ",
                            country: "Benin",
                            code: "229"
                        }, {
                            brief: "BM",
                            country: "Bermuda",
                            code: "1"
                        }, {
                            brief: "BN",
                            country: "Brunei",
                            code: "673"
                        }, {
                            brief: "BO",
                            country: "Bolivia",
                            code: "591"
                        }, {
                            brief: "BQ",
                            country: "Bonaire, Sint Eustatius and Saba",
                            code: "599"
                        }, {
                            brief: "BR",
                            country: "Brazil",
                            code: "55"
                        }, {
                            brief: "BS",
                            country: "Bahamas",
                            code: "1"
                        }, {
                            brief: "BT",
                            country: "Bhutan",
                            code: "975"
                        }, {
                            brief: "BW",
                            country: "Botswana",
                            code: "267"
                        }, {
                            brief: "BY",
                            country: "Belarus",
                            code: "375"
                        }, {
                            brief: "BZ",
                            country: "Belize",
                            code: "501"
                        }, {
                            brief: "IO",
                            country: "British Indian Ocean Territory",
                            code: "246"
                        }, {
                            brief: "VG",
                            country: "British Virgin Islands",
                            code: "1"
                        }
                    ]
                },
                {
                    name: 'B',
                    cycodes: [
                        {
                            brief: "BA",
                            country: "Bosnia and Herzegovina",
                            code: "387"
                        }, {
                            brief: "BB",
                            country: "Barbados",
                            code: "1"
                        }, {
                            brief: "BD",
                            country: "Bangladesh",
                            code: "880"
                        }, {
                            brief: "BE",
                            country: "Belgium",
                            code: "32"
                        }, {
                            brief: "BF",
                            country: "Burkina Faso",
                            code: "226"
                        }, {
                            brief: "BG",
                            country: "Bulgaria",
                            code: "359"
                        }, {
                            brief: "BH",
                            country: "Bahrain",
                            code: "973"
                        }, {
                            brief: "BI",
                            country: "Burundi",
                            code: "257"
                        }, {
                            brief: "BJ",
                            country: "Benin",
                            code: "229"
                        }, {
                            brief: "BM",
                            country: "Bermuda",
                            code: "1"
                        }, {
                            brief: "BN",
                            country: "Brunei",
                            code: "673"
                        }, {
                            brief: "BO",
                            country: "Bolivia",
                            code: "591"
                        }, {
                            brief: "BQ",
                            country: "Bonaire, Sint Eustatius and Saba",
                            code: "599"
                        }, {
                            brief: "BR",
                            country: "Brazil",
                            code: "55"
                        }, {
                            brief: "BS",
                            country: "Bahamas",
                            code: "1"
                        }, {
                            brief: "BT",
                            country: "Bhutan",
                            code: "975"
                        }, {
                            brief: "BW",
                            country: "Botswana",
                            code: "267"
                        }, {
                            brief: "BY",
                            country: "Belarus",
                            code: "375"
                        }, {
                            brief: "BZ",
                            country: "Belize",
                            code: "501"
                        }, {
                            brief: "IO",
                            country: "British Indian Ocean Territory",
                            code: "246"
                        }, {
                            brief: "VG",
                            country: "British Virgin Islands",
                            code: "1"
                        }
                    ]
                },
                {
                    name: 'C',
                    cycodes: [
                                        {
                            brief: "CA",
                            country: "Canada",
                            code: "1"
                        }, {
                            brief: "CC",
                            country: "Cocos Islands",
                            code: "61"
                        }, {
                            brief: "CF",
                            country: "Central African Republic",
                            code: "236"
                        }, {
                            brief: "CG",
                            country: "Congo",
                            code: "242"
                        }, {
                            brief: "CI",
                            country: "Côte d'Ivoire",
                            code: "225"
                        }, {
                            brief: "CK",
                            country: "Cook Islands",
                            code: "682"
                        }, {
                            brief: "CL",
                            country: "Chile",
                            code: "56"
                        }, {
                            brief: "CM",
                            country: "Cameroon",
                            code: "237"
                        }, {
                            brief: "CN",
                            country: "China",
                            code: "86"
                        }, {
                            brief: "CO",
                            country: "Colombia",
                            code: "57"
                        }, {
                            brief: "CR",
                            country: "Costa Rica",
                            code: "506"
                        }, {
                            brief: "CU",
                            country: "Cuba",
                            code: "53"
                        }, {
                            brief: "CV",
                            country: "Cape Verde",
                            code: "238"
                        }, {
                            brief: "CW",
                            country: "Curaçao",
                            code: "599"
                        }, {
                            brief: "CX",
                            country: "Christmas Island",
                            code: "61"
                        }, {
                            brief: "CY",
                            country: "Cyprus",
                            code: "357"
                        }, {
                            brief: "CZ",
                            country: "Czech Republic",
                            code: "420"
                        }, {
                            brief: "HR",
                            country: "Croatia",
                            code: "385"
                        }, {
                            brief: "KH",
                            country: "Cambodia",
                            code: "855"
                        }, {
                            brief: "KM",
                            country: "Comoros",
                            code: "269"
                        }, {
                            brief: "KY",
                            country: "Cayman Islands",
                            code: "1"
                        }, {
                            brief: "TD",
                            country: "Chad",
                            code: "235"
                        }
                    ]
                },
                {
                    name: 'D',
                    cycodes: [
                        {
                            brief: "DJ",
                            country: "Djibouti",
                            code: "253"
                        }, {
                            brief: "DK",
                            country: "Denmark",
                            code: "45"
                        }, {
                            brief: "DM",
                            country: "Dominica",
                            code: "1"
                        }, {
                            brief: "DO",
                            country: "Dominican Republic",
                            code: "1"
                        }
                    ]
                },
                {
                    name: 'E',
                    cycodes: [
                        {
                            brief: "EC",
                            country: "Ecuador",
                            code: "593"
                        }, {
                            brief: "EE",
                            country: "Estonia",
                            code: "372"
                        }, {
                            brief: "EG",
                            country: "Egypt",
                            code: "20"
                        }, {
                            brief: "ER",
                            country: "Eritrea",
                            code: "291"
                        }, {
                            brief: "ET",
                            country: "Ethiopia",
                            code: "251"
                        }, {
                            brief: "GQ",
                            country: "Equatorial Guinea",
                            code: "240"
                        }, {
                            brief: "SV",
                            country: "El Salvador",
                            code: "503"
                        }
                    ]
                },
                {
                    name: 'F',
                    cycodes: [
                        {
                            brief: "FI",
                            country: "Finland",
                            code: "358"
                        }, {
                            brief: "FJ",
                            country: "Fiji",
                            code: "679"
                        }, {
                            brief: "FK",
                            country: "Falkland Islands",
                            code: "5"
                        }, {
                            brief: "FO",
                            country: "Faroe Islands",
                            code: "298"
                        }, {
                            brief: "FR",
                            country: "France",
                            code: "33"
                        }, {
                            brief: "GF",
                            country: "French Guiana",
                            code: "594"
                        }, {
                            brief: "PF",
                            country: "French Polynesia",
                            code: "689"
                        }
                    ]
                },
                {
                    name: 'G',
                    cycodes: [
                        {
                            brief: "DE",
                            country: "Germany",
                            code: "49"
                        }, {
                            brief: "GA",
                            country: "Gabon",
                            code: "241"
                        }, {
                            brief: "GD",
                            country: "Grenada",
                            code: "1"
                        }, {
                            brief: "GE",
                            country: "Georgia",
                            code: "995"
                        }, {
                            brief: "GG",
                            country: "Guernsey",
                            code: "44"
                        }, {
                            brief: "GH",
                            country: "Ghana",
                            code: "233"
                        }, {
                            brief: "GI",
                            country: "Gibraltar",
                            code: "350"
                        }, {
                            brief: "GL",
                            country: "Greenland",
                            code: "299"
                        }, {
                            brief: "GM",
                            country: "Gambia",
                            code: "220"
                        }, {
                            brief: "GN",
                            country: "Guinea",
                            code: "224"
                        }, {
                            brief: "GP",
                            country: "Guadeloupe",
                            code: "590"
                        }, {
                            brief: "GR",
                            country: "Greece",
                            code: "30"
                        }, {
                            brief: "GT",
                            country: "Guatemala",
                            code: "502"
                        }, {
                            brief: "GU",
                            country: "Guam",
                            code: "1"
                        }, {
                            brief: "GW",
                            country: "Guinea-Bissau",
                            code: "245"
                        }, {
                            brief: "GY",
                            country: "Guyana",
                            code: "592"
                        }
                    ]
                },
                {
                    name: 'H',
                    cycodes: [
                        {
                            brief: "HK",
                            country: "Hong Kong",
                            code: "852"
                        }, {
                            brief: "HN",
                            country: "Honduras",
                            code: "504"
                        }, {
                            brief: "HT",
                            country: "Haiti",
                            code: "509"
                        }, {
                            brief: "HU",
                            country: "Hungary",
                            code: "36"
                        }
                    ]
                },
                {
                    name: 'I',
                    cycodes: [
                        {
                            brief: "ID",
                            country: "Indonesia",
                            code: "62"
                        }, {
                            brief: "IE",
                            country: "Ireland",
                            code: "353"
                        }, {
                            brief: "IL",
                            country: "Israel",
                            code: "972"
                        }, {
                            brief: "IM",
                            country: "Isle Of Man",
                            code: "44"
                        }, {
                            brief: "IN",
                            country: "India",
                            code: "91"
                        }, {
                            brief: "IQ",
                            country: "Iraq",
                            code: "964"
                        }, {
                            brief: "IR",
                            country: "Iran",
                            code: "98"
                        }, {
                            brief: "IS",
                            country: "Iceland",
                            code: "354"
                        }, {
                            brief: "IT",
                            country: "Italy",
                            code: "39"
                        }
                    ]
                },
                {
                    name: 'J',
                    cycodes: [
                        {
                            brief: "JE",
                            country: "Jersey",
                            code: "44"
                        }, {
                            brief: "JM",
                            country: "Jamaica",
                            code: "1"
                        }, {
                            brief: "JO",
                            country: "Jordan",
                            code: "962"
                        }, {
                            brief: "JP",
                            country: "Japan",
                            code: "81"
                        }
                    ]
                },
                {
                    name: 'K',
                    cycodes: [
                        {
                            brief: "KE",
                            country: "Kenya",
                            code: "254"
                        }, {
                            brief: "KG",
                            country: "Kyrgyzstan",
                            code: "996"
                        }, {
                            brief: "KI",
                            country: "Kiribati",
                            code: "686"
                        }, {
                            brief: "KW",
                            country: "Kuwait",
                            code: "965"
                        }, {
                            brief: "KZ",
                            country: "Kazakhstan",
                            code: "7"
                        }
                    ]
                },
                {
                    name: 'L',
                    cycodes: [
                        {
                            brief: "LA",
                            country: "Laos",
                            code: "856"
                        }, {
                            brief: "LB",
                            country: "Lebanon",
                            code: "961"
                        }, {
                            brief: "LI",
                            country: "Liechtenstein",
                            code: "423"
                        }, {
                            brief: "LR",
                            country: "Liberia",
                            code: "231"
                        }, {
                            brief: "LS",
                            country: "Lesotho",
                            code: "266"
                        }, {
                            brief: "LT",
                            country: "Lithuania",
                            code: "370"
                        }, {
                            brief: "LU",
                            country: "Luxembourg",
                            code: "352"
                        }, {
                            brief: "LV",
                            country: "Latvia",
                            code: "371"
                        }, {
                            brief: "LY",
                            country: "Libya",
                            code: "218"
                        }
                    ]
                },
                {
                    name: 'M',
                    cycodes: [
                        {
                            brief: "FM",
                            country: "Micronesia",
                            code: "691"
                        }, {
                            brief: "MA",
                            country: "Morocco",
                            code: "212"
                        }, {
                            brief: "MC",
                            country: "Monaco",
                            code: "377"
                        }, {
                            brief: "MD",
                            country: "Moldova",
                            code: "373"
                        }, {
                            brief: "ME",
                            country: "Montenegro",
                            code: "382"
                        }, {
                            brief: "MG",
                            country: "Madagascar",
                            code: "261"
                        }, {
                            brief: "MH",
                            country: "Marshall Islands",
                            code: "692"
                        }, {
                            brief: "MK",
                            country: "Macedonia",
                            code: "389"
                        }, {
                            brief: "ML",
                            country: "Mali",
                            code: "223"
                        }, {
                            brief: "MM",
                            country: "Myanmar",
                            code: "95"
                        }, {
                            brief: "MN",
                            country: "Mongolia",
                            code: "976"
                        }, {
                            brief: "MO",
                            country: "Macao",
                            code: "853"
                        }, {
                            brief: "MQ",
                            country: "Martinique",
                            code: "596"
                        }, {
                            brief: "MR",
                            country: "Mauritania",
                            code: "222"
                        }, {
                            brief: "MS",
                            country: "Montserrat",
                            code: "1"
                        }, {
                            brief: "MT",
                            country: "Malta",
                            code: "356"
                        }, {
                            brief: "MU",
                            country: "Mauritius",
                            code: "230"
                        }, {
                            brief: "MV",
                            country: "Maldives",
                            code: "960"
                        }, {
                            brief: "MW",
                            country: "Malawi",
                            code: "265"
                        }, {
                            brief: "MX",
                            country: "Mexico",
                            code: "52"
                        }, {
                            brief: "MY",
                            country: "Malaysia",
                            code: "60"
                        }, {
                            brief: "MZ",
                            country: "Mozambique",
                            code: "258"
                        }, {
                            brief: "YT",
                            country: "Mayotte",
                            code: "262"
                        }
                    ]
                },
                {
                    name: 'N',
                    cycodes: [
                        {
                            brief: "KP",
                            country: "North Korea",
                            code: "850"
                        }, {
                            brief: "MP",
                            country: "Northern Mariana Islands",
                            code: "1"
                        }, {
                            brief: "NA",
                            country: "Namibia",
                            code: "264"
                        }, {
                            brief: "NC",
                            country: "New Caledonia",
                            code: "687"
                        }, {
                            brief: "NE",
                            country: "Niger",
                            code: "227"
                        }, {
                            brief: "NF",
                            country: "Norfolk Island",
                            code: "672"
                        }, {
                            brief: "NG",
                            country: "Nigeria",
                            code: "234"
                        }, {
                            brief: "NI",
                            country: "Nicaragua",
                            code: "505"
                        }, {
                            brief: "NL",
                            country: "Netherlands",
                            code: "31"
                        }, {
                            brief: "NO",
                            country: "Norway",
                            code: "47"
                        }, {
                            brief: "NP",
                            country: "Nepal",
                            code: "977"
                        }, {
                            brief: "NR",
                            country: "Nauru",
                            code: "674"
                        }, {
                            brief: "NU",
                            country: "Niue",
                            code: "683"
                        }, {
                            brief: "NZ",
                            country: "New Zealand",
                            code: "64"
                        }
                    ]
                },
                {
                    name: 'O',
                    cycodes: [
                        {
                            brief: "OM",
                            country: "Oman",
                            code: "968"
                        }
                    ]
                },
                {
                    name: 'P',
                    cycodes: [
                        {
                            brief: "PA",
                            country: "Panama",
                            code: "507"
                        }, {
                            brief: "PE",
                            country: "Peru",
                            code: "51"
                        }, {
                            brief: "PG",
                            country: "Papua New Guinea",
                            code: "675"
                        }, {
                            brief: "PH",
                            country: "Philippines",
                            code: "63"
                        }, {
                            brief: "PK",
                            country: "Pakistan",
                            code: "92"
                        }, {
                            brief: "PL",
                            country: "Poland",
                            code: "48"
                        }, {
                            brief: "PR",
                            country: "Puerto Rico",
                            code: "1"
                        }, {
                            brief: "PS",
                            country: "Palestine",
                            code: "970"
                        }, {
                            brief: "PT",
                            country: "Portugal",
                            code: "351"
                        }, {
                            brief: "PW",
                            country: "Palau",
                            code: "680"
                        }, {
                            brief: "PY",
                            country: "Paraguay",
                            code: "595"
                        }
                    ]
                },
                {
                    name: 'Q',
                    cycodes: [
                        {
                            brief: "QA",
                            country: "Qatar",
                            code: "974"
                        }
                    ]
                },
                {
                    name: 'R',
                    cycodes: [
                        {
                            brief: "RE",
                            country: "Reunion",
                            code: "262"
                        }, {
                            brief: "RO",
                            country: "Romania",
                            code: "40"
                        }, {
                            brief: "RU",
                            country: "Russia",
                            code: "7"
                        }, {
                            brief: "RW",
                            country: "Rwanda",
                            code: "250"
                        }
                    ]
                },
                {
                    name: 'S',
                    cycodes: [
                        {
                            brief: "BL",
                            country: "Saint Barthélemy",
                            code: "590"
                        }, {
                            brief: "CH",
                            country: "Switzerland",
                            code: "41"
                        }, {
                            brief: "ES",
                            country: "Spain",
                            code: "34"
                        }, {
                            brief: "KN",
                            country: "Saint Kitts And Nevis",
                            code: "1"
                        }, {
                            brief: "KR",
                            country: "South Korea",
                            code: "82"
                        }, {
                            brief: "LC",
                            country: "Saint Lucia",
                            code: "1"
                        }, {
                            brief: "LK",
                            country: "Sri Lanka",
                            code: "94"
                        }, {
                            brief: "MF",
                            country: "Saint Martin",
                            code: "590"
                        }, {
                            brief: "PM",
                            country: "Saint Pierre And Miquelon",
                            code: "508"
                        }, {
                            brief: "RS",
                            country: "Serbia",
                            code: "381"
                        }, {
                            brief: "SA",
                            country: "Saudi Arabia",
                            code: "966"
                        }, {
                            brief: "SB",
                            country: "Solomon Islands",
                            code: "677"
                        }, {
                            brief: "SC",
                            country: "Seychelles",
                            code: "248"
                        }, {
                            brief: "SD",
                            country: "Sudan",
                            code: "249"
                        }, {
                            brief: "SE",
                            country: "Sweden",
                            code: "46"
                        }, {
                            brief: "SG",
                            country: "Singapore",
                            code: "65"
                        }, {
                            brief: "SH",
                            country: "Saint Helena",
                            code: "290"
                        }, {
                            brief: "SI",
                            country: "Slovenia",
                            code: "386"
                        }, {
                            brief: "SJ",
                            country: "Svalbard And Jan Mayen",
                            code: "47"
                        }, {
                            brief: "SK",
                            country: "Slovakia",
                            code: "421"
                        }, {
                            brief: "SL",
                            country: "Sierra Leone",
                            code: "232"
                        }, {
                            brief: "SM",
                            country: "San Marino",
                            code: "378"
                        }, {
                            brief: "SN",
                            country: "Senegal",
                            code: "221"
                        }, {
                            brief: "SO",
                            country: "Somalia",
                            code: "252"
                        }, {
                            brief: "SR",
                            country: "Suriname",
                            code: "597"
                        }, {
                            brief: "ST",
                            country: "Sao Tome And Principe",
                            code: "239"
                        }, {
                            brief: "SX",
                            country: "Sint Maarten (Dutch part)",
                            code: "1"
                        }, {
                            brief: "SY",
                            country: "Syria",
                            code: "963"
                        }, {
                            brief: "SZ",
                            country: "Swaziland",
                            code: "268"
                        }, {
                            brief: "VC",
                            country: "Saint Vincent And The Grenadines",
                            code: "1"
                        }, {
                            brief: "WS",
                            country: "Samoa",
                            code: "685"
                        }, {
                            brief: "ZA",
                            country: "South Africa",
                            code: "27"
                        }
                    ]
                },
                {
                    name: 'T',
                    cycodes: [
                        {
                            brief: "CD",
                            country: "The Democratic Republic Of Congo",
                            code: "243"
                        }, {
                            brief: "TC",
                            country: "Turks And Caicos Islands",
                            code: "1"
                        }, {
                            brief: "TG",
                            country: "Togo",
                            code: "228"
                        }, {
                            brief: "TH",
                            country: "Thailand",
                            code: "66"
                        }, {
                            brief: "TJ",
                            country: "Tajikistan",
                            code: "992"
                        }, {
                            brief: "TK",
                            country: "Tokelau",
                            code: "690"
                        }, {
                            brief: "TL",
                            country: "Timor-Leste",
                            code: "670"
                        }, {
                            brief: "TM",
                            country: "Turkmenistan",
                            code: "993"
                        }, {
                            brief: "TN",
                            country: "Tunisia",
                            code: "216"
                        }, {
                            brief: "TO",
                            country: "Tonga",
                            code: "676"
                        }, {
                            brief: "TR",
                            country: "Turkey",
                            code: "90"
                        }, {
                            brief: "TT",
                            country: "Trinidad and Tobago",
                            code: "1"
                        }, {
                            brief: "TV",
                            country: "Tuvalu",
                            code: "688"
                        }, {
                            brief: "TW",
                            country: "Taiwan",
                            code: "886"
                        }, {
                            brief: "TZ",
                            country: "Tanzania",
                            code: "255"
                        }
                    ]
                },
                {
                    name: 'U',
                    cycodes: [
                        {
                            brief: "AE",
                            country: "United Arab Emirates",
                            code: "971"
                        }, {
                            brief: "GB",
                            country: "United Kingdom",
                            code: "44"
                        }, {
                            brief: "UA",
                            country: "Ukraine",
                            code: "380"
                        }, {
                            brief: "UG",
                            country: "Uganda",
                            code: "256"
                        }, {
                            brief: "US",
                            country: "United States",
                            code: "1"
                        }, {
                            brief: "UY",
                            country: "Uruguay",
                            code: "598"
                        }, {
                            brief: "UZ",
                            country: "Uzbekistan",
                            code: "998"
                        }, {
                            brief: "VI",
                            country: "U.S. Virgin Islands",
                            code: "1"
                        }
                    ]
                },
                {
                    name: 'V',
                    cycodes: [
                        {
                            brief: "VA",
                            country: "Vatican",
                            code: "379"
                        }, {
                            brief: "VE",
                            country: "Venezuela",
                            code: "58"
                        }, {
                            brief: "VN",
                            country: "Vietnam",
                            code: "84"
                        }, {
                            brief: "VU",
                            country: "Vanuatu",
                            code: "678"
                        }
                    ]
                },
                {
                    name: 'W',
                    cycodes: [
                        {
                            brief: "EH",
                            country: "Western Sahara",
                            code: "212"
                        }, {
                            brief: "WF",
                            country: "Wallis And Futuna",
                            code: "681"
                        }
                    ]
                },
                {
                    name: 'Y',
                    cycodes: [
                        {
                            brief: "YE",
                            country: "Yemen",
                            code: "967"
                        }
                    ]
                },
                {
                    name: 'Z',
                    cycodes: [
                        {
                            brief: "ZM",
                            country: "Zambia",
                            code: "260"
                        }, {
                            brief: "ZW",
                            country: "Zimbabwe",
                            code: "263"
                        }
                    ]
                },
            ],
            showCode: false,
            inputValue: '',
            resendText: '',
            resendState: false,
            changeCycode: false,
            imgkey: '',
            showTips: false,
            tips: '',
            waitTime: 60,
            phoneCodeState: 'get', // get or again ro wait
            invalid: true,
            unShow: true,
            defaultType: 'text',
        }
    },
    methods: {
        showSelectCycode() {
            this.changeCycode = !this.changeCycode;
        },
        handleKeyUp() {
            this.hideTips();
            this.$emit('changeinp', false);
            switch(this.type) {
                case 'account': {
                    const that = this;
                    let timer;
                    timer = setTimeout(function() {
                        clearTimeout(timer);
                        if (that.showCode) {
                            if (/[a-z@\.\s]+/.test(that.inputValue) || that.inputValue.length < 6) {
                                that.showCode = false;
                            }
                        } else {
                            if (/^\d{6,}/.test(that.inputValue) && !/\D+/.test(that.inputValue)) {
                                that.showCode = true;
                            } 
                        }
                    }, 1000);
                    break;
                }
            }
        },
        clear() {
            this.inputValue = '';
        },
        hideTips() {
            this.showTips = false;
            this.tips = '';
        },
        showInputTips(text) {
            this.showTips = true;
            this.tips = text;
        },
        handleSelect(gindex,index) {
            if (this.countryCodeList[gindex].cycodes[index] != this.countryCode) {
                this.hideTips();
                this.$emit('changeinp', true);
            }
            this.countryCode = this.countryCodeList[gindex].cycodes[index];
            this.changeCycode = false;
        },
        changeState(time) {
            if (this.phoneCodeState === 'get' || this.phoneCodeState === 'again') {
                // 请求接口获取验证码改变状态为wait
                this.phoneCodeState = 'wait';
                this.waitTime = time || 60;
                //设置计时器
                this.count();
            } else {
                return;
            }
        },
        emitBlur(event) {
            this.$emit('finished')
        },
        handleSend() {
            if (this.invalid) {
                return;
            }
            this.$emit('send');
        },
        allowSend() {
            this.invalid = false;
        },
        getImageKey() {
            this.imgkey = '/kaptcha.jpg?t='+new Date().getTime();
        },
        count() {
            const that = this;
            this.resendState = true;
            that.resendText = this.resend +'('+that.waitTime+')';
            that.waitTime--;
            let timer = setInterval(function() {
                if (that.waitTime > 0) {
                    that.resendText = that.resend +'('+that.waitTime+')';
                    that.waitTime--;
                } else {
                    that.$emit('resend')
                    that.phoneCodeState = 'again';
                    that.resendText = that.resend;
                    clearInterval(timer);
                } 
            }, 1000) 
        },
        toggleShowPwd() {
            this.unShow = !this.unShow;
            if (this.unShow) {
                this.defaultType = 'password';
            } else {
                this.defaultType = "text";
            }
            this.$emit('showpwd');
        }
    },
    mounted() {
        if (this.type === 'password') {
            this.defaultType = 'password';
        }
    }
}
</script>

<style lang="scss">
@font-face {
  font-family: 'iconfont';
  src: url('./assets/iconfont.eot');
  src: url('./assets/iconfont.eot?#iefix') format('embedded-opentype'),
  url('./assets/iconfont.woff') format('woff'),
  url('./assets/iconfont.ttf') format('truetype'),
  url('./assets/iconfont.svg#iconfont') format('svg');
}
@font-face {
  font-family: 'arrow';  /* project id 893534 */
  src: url('//at.alicdn.com/t/font_893534_1shjj12oufd.eot');
  src: url('//at.alicdn.com/t/font_893534_1shjj12oufd.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_893534_1shjj12oufd.woff') format('woff'),
  url('//at.alicdn.com/t/font_893534_1shjj12oufd.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_893534_1shjj12oufd.svg#iconfont') format('svg');
}
.iconfont{
  font-family:"iconfont" !important;
  font-size:16px;font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.input {
    width: 100%;
    font-size: 0;
    position: relative;
    .label-input {
        text-align: right;
        display: inline-block;
        width: 143px;
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        vertical-align: top;
    }
    .input-bar {
        text-align: left;
        width: 290px;
        margin: 0 auto;
        font-size: 0;
        position: relative;
        display: inline-block;
        padding: 0 10px;
        height: 36px;
        border: 1px solid #cccccc;
        outline: none;
        color: #474747;
        border-radius: 3px;
        box-sizing: border-box;
        vertical-align: middle;
        &.error-tips {
            border: 1px solid #DE3131;
        }
        
        &::before {
            content: '';
            height: 34px;
            vertical-align: middle;
            display: inline-block;
        }
        input{
            display: inline-block;
            font-size: 14px;
            height: 20px;
            line-height: 20px;
            vertical-align: middle;
            width: 100%;
            &.account {
                &.showcode {
                    width: 70%;
                    margin-left: 10px;
                }
            }
            &.imgCode{
                width: 63%;
            }
            &.phoneCode {
                width: 55%;
            }
            &.password {
                width: 74%;
            }
        }
        .country-code {
            display: inline-block;
            vertical-align: middle;
            width: 60px;
            cursor: pointer;
            border-right: 1px solid #ddd;
            .country-code-selected {
                height: 35px;
                line-height: 35px;
                display: inline-block;
                font-size: 14px;
                width: 60%;
                color: gray;
            }
            .arrow-down {
                font-family:"arrow" !important;
                font-size:16px;font-style:normal;
                -webkit-font-smoothing: antialiased;
                -webkit-text-stroke-width: 0.2px;
                -moz-osx-font-smoothing: grayscale;
                display: inline-block;
                width: 14px;
                height: 8px;
            }
        }
        .cycode-container {
            position: absolute;
            width: 100%;
            height: 210px;
            line-height: 30px;
            background: #fff;
            border: 1px solid #e8e8e8;
            z-index: 500;
            overflow-x: hidden;
            overflow-y: auto;
            left: -1px;
            top: 35px;
            color: #000;
            font-size: 14px;
            .cycode-list {
                .cycode-group {
                    .cycode-group-name {
                        background: #f9f9f9;
                        padding-left: 10px;
                    }
                    .group-list {
                        .cycode-item {
                            padding: 0 10px;
                            clear: both;
                            overflow: hidden;
                            cursor: pointer;
                            span {
                                height: 30px;
                                overflow: hidden;
                            }
                            .cycode-country {
                                float: left;
                                width: 74%;
                                cursor: pointer;
                            }
                            .cycode-code {
                                float: right;
                                width: 20%;
                            }
                        }
                    }
                }
            }
        }
        .getcode-container {
            width: 96px;
            height: 100%;
            vertical-align: middle;
            display: inline-block;
            margin-left: 10px;
            float: right;
            &::before {
                content: '';
                display: inline-block;
                height: 100%;;
                vertical-align: middle;
            }
            .hr {
                border-left: 1px #cccccc solid;
                height:16px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
            }
            .state {
                display: inline-block;
                height: 36px;
                line-height: 36px;
                width: 85px;
                font-size: 14px;
                vertical-align: middle;
                text-align: center;
                &.get, &.again {
                    color: #387aff;
                    cursor: pointer;
                    &.invalid {
                        color: #cccccc;
                        cursor: default;
                    }
                }
            }
        }
        .imgkey-container {
            width: 76px;
            height: 100%;
            vertical-align: middle;
            display: inline-block;
            margin-left: 10px;
            float: right;
            &::before {
                content: '';
                display: inline-block;
                height: 100%;;
                vertical-align: middle;
            }
            .hr {
                border-left: 1px #cccccc solid;
                height:16px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
            }
            img {
                display: inline-block;
                height: 28px;
                width: 65px;
                vertical-align: middle;
                cursor: pointer;
            }
        }
        .show-pwd-container {
            width: 30px;
            height: 30px;
            vertical-align: middle;
            display: inline-block;
            float: right;
            cursor: pointer;
            .iconfont {
                display: inline-block;
                height: 30px;
                font-size: 26px;
                line-height: 30px;
            }
        }
    }
    .tips {
        font-size: 12px;
        color: #DE3131;
        margin-top: 10px;
        text-align: left;
        width: 290px;
        padding: 0 10px;
        margin-left: 143px;
        box-sizing: border-box;
    }
}
</style>