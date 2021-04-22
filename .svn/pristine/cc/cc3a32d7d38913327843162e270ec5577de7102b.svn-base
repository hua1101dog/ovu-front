import Vue from 'vue'
import Router from 'vue-router'


import informate from '@/components/informate'
import informateDetail from '@/components/informateDetail'
import complaint from '@/components/complaint'
import complaintDetail from '@/components/complaintDetail'

Vue.use(Router)

export default new Router({
  routes: [
  
    
    { path: '/informate',  component: informate,meta:{title:'信息公告'}},
   
    { path: '/informate/detail/:id',  component: informateDetail,meta:{title:'公告详情'}},
    {path:'/complaint',component: complaint,meta:{title:'投诉建议'}},
    { path: '/complaint/detail',  component: complaintDetail,meta:{title:'投诉详情'}},

  ],
  scrollBehavior (to, from, savedPosition) {

    return { x: 0, y: 0 }
  }

})
