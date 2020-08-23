import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueParticles from 'vue-particles'//点线性背景 
Vue.use(VueParticles)

import { Button,Image,Col,Row,Tab,Tabs,Swipe,SwipeItem,Lazyload,SwipeCell,Search,DropdownMenu,DropdownItem,RadioGroup,Radio,Pagination,Card,Empty,Tag,Icon,Toast,Dialog,Divider,Uploader,Field,Calendar } from 'vant'//Vant组件库
Vue.use(Button).use(Image).use(Col).use(Row).use(Tab).use(Tabs).use(Swipe).use(SwipeItem).use(Lazyload).use(SwipeCell).use(Search).use(DropdownMenu).use(DropdownItem).use(RadioGroup).use(Radio).use(Pagination).use(Card).use(Empty).use(Tag).use(Icon).use(Toast).use(Dialog).use(Divider).use(Uploader).use(Field).use(Calendar)
import '@vant/touch-emulator'

Vue.config.productionTip = false

import LwFirewords from 'lw_firewords'//鼠标烟花
const lw_f = new LwFirewords();
lw_f.init();

import axios from './utils/axios'
Vue.prototype.$axios = axios

import 'lib-flexible/flexible'

import VueJsonp from 'vue-jsonp'//跨域问题，用于百度定位API...
Vue.use(VueJsonp)

import time from 'js-time.js';
Vue.prototype.$time = time

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
