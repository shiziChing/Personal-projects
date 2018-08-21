// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import babelpolyfill from 'babel-polyfill'  //转码兼容IE
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/common/common.css'
import './assets/common/iconSelect.css'

import VueRouter from 'vue-router'
//import store from './vuex/store'  //vuex存储
import store from './store/index'
import NProgress from 'nprogress'  //进度条
import 'nprogress/nprogress.css'
import routes from './routes/index'  //路由

import cookie from  'vue-cookie'

import * as filters from './api/filter'  //过滤器

Vue.filter('detailTime', filters.detailTime)


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(cookie)

Vue.config.productionTip = false
Vue.config.silent = true  //语法检查
NProgress.configure({ showSpinner: false });  //默认关闭请求进度条





const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {  //路由钩子

// 	if (to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
// 	  	next()

// 	 } else {

//     	next({path: '/login'});

// 	}

// })
router.beforeEach((to, from, next) => {

  if (to.path == '/login') {
  	// console.log(1)
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
    // console.log(2)
  } else {
    next()

    // console.log(3)
  }
})


window.JS_VUE = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
