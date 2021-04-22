<template>
  <div >
     <van-nav-bar title="公示详情"  left-arrow @click-left="$router.push('/informate')">
 
</van-nav-bar>
 <div class="van-card">
    <img class="topImg" src="@/assets/img/top.png" alt="" >
      <div class="van-card-title">{{item.title}}</div>
      <div style="text-align: left;">
        <span class="radius_box" style="background:rgba(0, 119, 97, 1)">
   <span>{{item.fdept}}</span>
 </span>
 <span class="van-card-dept">{{item.deptName}}</span>
 <span class="van-card-time">{{item.createTime}}</span>

      </div>
      <div class="van-card-dec" v-html="item.content">

      </div>
 </div>
  </div>

</template>

<script scoped >
import { findDetail} from "@/api/informate";
export default {
  name: "informateDetail",
  data() {
    return {
       item:{}
    };
  },
  methods: {
   
    
  },
    mounted() {
    findDetail(this.$route.params.id).then(res => {
      this.item=res.data
    var dept=this.item.deptName
    this.item.fdept=this.item.deptName.split('')[0]
   
    })
   
  },
  
 
};
</script>

<style lang="scss" scoped>
  /deep/ .van-card {
 
    margin: .5rem !important;
    color: #323233;
 width: calc(100% - 1rem);
 max-height:calc(100% - 3rem);
text-align: left;
background: #FFFFFF;
 border-radius:0.5rem;
 padding: 0.5rem;
 position: relative;
}
.topImg{
 
  position: absolute;
  height: 33px;
  width: 35px;
  top:0;
  right: .5rem;
}
.van-card-title{

font-size: .9rem;
font-family: PingFang SC Bold;

 padding-top: 1.8rem;
color: #202327;

}
.van-card-dept{
font-size: 0.7rem;
     
    font-weight: bold;
    color: #202327;
    margin-top: 0.8rem;
    font-family: 'PingFang SC Bold';

}
.van-card-time{
 line-height: 2.2rem;
font-size: 0.6rem;
 margin: 0.15rem 0 0.25rem 0;

color: #9EA0A7;
float: right;

}
.van-card-dec{
font-family: 'PingFang SC Regular';
font-size: 0.7rem;
line-height: 1.2rem;
font-weight: 400;

color: #202327;
opacity: 1;
}
.radius_box{
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin: .5rem .5rem .5rem 0px;
  display: inline-block;
  span{
      color: #fff;
    font-size: 0.6rem;
    line-height:  1.5rem;
     font-family: 'PingFang SC Bold';
   margin-left: 0.4rem;
   clear: both;
  }
}
</style>
