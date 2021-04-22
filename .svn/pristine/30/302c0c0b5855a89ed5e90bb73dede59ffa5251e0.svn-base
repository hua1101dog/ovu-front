<template>
 
       <div>
       <van-nav-bar title="信息公示"  left-arrow @click-left="$webView.back()" >
 
</van-nav-bar>
     <div>
   <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="我也是有底线的~~~"
        @load="onLoad"
     
      >
        <div class="van-card" v-for="(item,i) in list" :key='i'>
     <router-link :to="'/informate/detail/'+item.id">
         <img class="topImg" src="@/assets/img/top.png" alt="" v-if="item.isTop">
 <div class="radius_box" :style="{'background':colorList[i%3]}">
   <span>{{item.deptName[0]}}</span>
 </div>
 <div class="van-card_right">
    <div class="van-card-dept">{{item.deptName}}</div>
     <div class="van-card-time">{{item.createTime}}</div>
   <div class="van-card-dec">{{item.title}}</div>
 </div>
     
     </router-link>
 
  </div>
      </van-list>
   </van-pull-refresh>

 

     </div>
      
  
       </div>
    
 
</template>

<script>

import { findPage } from "@/api/informate";
  export default {
    name: "informate",
 
      data() {
      return {
         list:[
        
         ],
         listQuery:{
          pageIndex: 0,
            currentPage: 1,
            pageSize: 10,
           
            parkId: this.$parkId,
            infoStatus:0
         },
         colorList:[
           'RGBA(1, 155, 127, 1)',
           'RGBA(9, 175, 175, 1)',
           'RGBA(4, 93, 183, 1)',

         ],
          loading: false, // 上拉加载
      finished: false, // 上拉加载完毕
      refreshing: false // 下拉刷新
      
      };
    },
    methods:{
       // 获取列表
    getroadList() {
      const _self = this;
          _self.listQuery.pageIndex = 0
    
      findPage(this.listQuery).then(res => {
    
       this.list = res.data.data
       if(res.totals === this.list.length){
                 this.finished = true
            }else {
                this.finished = false
            }
             this.listQuery.pageIndex = 1
             this.refreshing = false
            this.loading = false
      });
    
    },
    onLoad() {
   
     findPage(this.listQuery).then(res => {
     let datas = res.data.data
             this.list = this.list.concat(datas)
             if (this.list.length < res.data.totalCount) {
                  this.listQuery.pageIndex++
                 this.loading = false
             }else{
                this.finished = true
                this.loading = true
           }
      
      });
    
    },
    onRefresh() {
    
      this.getroadList();
    }
    }
   
   
 


  }
</script>


<style lang="scss" scoped>
  /deep/ .van-card {
 
    margin: .5rem;
    color: #323233;
 width: calc(100% - 1rem);
 height: 5rem;
background: #FFFFFF;
 border-radius:0.5rem;
 padding: 0;
 position: relative;
 .van-card_right{
   display: inline-block;
   text-align: left;
   width: calc(100% - 4rem);
 }
}
.radius_box{
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: .5rem;
  display: inline-block;
 vertical-align: bottom;
  span{
      color: #fff;
    font-size: 0.9rem;
    line-height:  2.5rem;
     font-family: 'PingFang SC Bold';
  }
}
.topImg{
 
  position: absolute;
  height: 33px;
  width: 35px;
  top:0;
  right: .5rem;
}
.van-card-dept{
font-size: 0.75rem;
    line-height: 1rem;
    font-weight: bold;
    color: #202327;
    margin-top: 0.8rem;
    font-family: 'PingFang SC Bold';

}
.van-card-time{

font-size: 0.6rem;
 margin: 0.15rem 0 0.25rem 0;
line-height: 0.8rem;
color: #9EA0A7;

}
.van-card-dec{
font-family: 'PingFang SC Regular';
font-size: 0.75rem;
line-height: 0.8rem;
font-weight: 400;
overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
color: #202327;
opacity: 1;
}


</style>
