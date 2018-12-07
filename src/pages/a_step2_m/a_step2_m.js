// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './a_step2_m.vue';
import "babel-polyfill";
import qs from 'qs';
import axios from 'axios';

import './assets/reset.css';
Vue.config.productionTip = false;

// axios 默认配置
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.post['content-Type'] = 'appliction/x-www-form-urlencoded';
axios.interceptors.request.use(function(config){ // eslint-disable-line
  // 在请求发出之前进行一些操作
  if (config.method === 'post' && !(config.data instanceof FormData)) {
    config.data = qs.stringify(config.data);// eslint-disable-line
  }
  return config;
},function(error){ // eslint-disable-line
  return Promise.reject(error);
});

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { 
        callback(currTime + timeToCall); 
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
}());
