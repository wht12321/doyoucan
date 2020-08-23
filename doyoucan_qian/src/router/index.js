import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import edit from '../views/edit.vue'
import articledetails from '../views/articledetails.vue'
import bilibilicutcomments from '../tools/bilibilicutcomments.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta:{
        title:"深井烈阳的小站"
      }
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: edit,
      meta:{
        title:"深井烈阳的小站--编辑页"
      }
    },
    {
      path: '/articledetails/:id',
      name: 'articledetails',
      component: articledetails,
      meta:{
        title:"深井烈阳的小站--文章详情"
      }
    },
    {
      path: '/bilibilicutcomments',
      name: 'bilibilicutcomments',
      component: bilibilicutcomments,
      meta:{
        title:"深井烈阳小工具--B站视频评论批量截图"
      }
    },
  ]


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})
export default router
