import axios from 'axios';

const url = {
    ucLogin: 'https://login.flyme.cn/sso?appuri=https%3A%2F%2Fopen.flyme.cn%2Flogin&useruri=https%3A%2F%2Fopen.flyme.cn&sid=&service=open&autodirct=true',
}

export function getData(result) {
    if (!result) return null;
    if (typeof(result) === 'object') {
        if (result.code !== "200") {
            if (result.code === "201") {
                location.href = url.ucLogin;
            } else {
               return null
            }
        } else {
            return result;
        }
    }
}

export function getParams(paramName) {
    let paramValue = "";
    let isFound = !1;
    if (location.search.indexOf("?") == 0 && location.search.indexOf("=") > 1) {
        let arrSource = location.search.substring(1, location.search.length).split("&"), i = 0; 
        while(i < arrSource.length && !isFound) {
            arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
        }
    }
    return paramValue == "" && (paramValue = null), paramValue 
}

