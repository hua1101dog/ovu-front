<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="我也是有底线的~~~"
        @load="onLoad"
      >
        <div class="van-card" v-for="(item, i) in list" :key="i" @click="toDetail(item.id)">
          <!-- <router-link :to="'/complaint/detail/' + item.id"> -->
            <div class="van-card_left">
              <div class="van-card-time">{{ item.createTime }}</div>
            </div>
            <div class="van-card_right">
              <div
                class="van-card-status"
                :class="{ re: item.status == '1', un: item.status == '0' }"
              >
                {{ item.status == 1 ? "已回复" : "未回复" }}
              </div>
            </div>
            <div class="van-card-dec">{{ item.content }}</div>
            <div class="vant-card-detailBtn">详情</div>
          <!-- </router-link> -->
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { findPage } from "@/api/complaint";
export default {
  name: "compItem",
 props:['status'],

  data() {
    return {
      listQuery: {
        pageIndex: 0,
        currentPage: 1,
        pageSize: 10,
        parkId: this.$parkId,
       
      },
      list: [],
    
      loading: false, // 上拉加载
      finished: false, // 上拉加载完毕
      refreshing: false // 下拉刷新
    };
  },
  methods: {
    // 获取列表
    getroadList(data) {
    
      const _self = this;
        if (data) {
          if (JSON.stringify(data) == "{}") {
              this.listQuery={
        currentPage: 1,
        pageSize: 10,
        parkId: _self.$parkId,
         status:this.$parent.search.status
      }
          } else {
            for (var k in data) {
              if (data[k]) {
               
                this.listQuery[k] = data[k];
              }else{
                delete this.listQuery[k]
              }
            }
           
          }
        }
      _self.listQuery.pageIndex = 0;
  _self.listQuery.status=this.$parent.search.status
       console.log(_self.listQuery)
      findPage(_self.listQuery).then(res => {
         _self.list = res.data.data
         
         this.$set(this,'list',res.data.data)
       if(res.totals === this.list.length){
                 _self.finished = true
            }else {
                _self.finished = false
            }
             _self.listQuery.pageIndex = 1
             _self.refreshing = false
            _self.loading = false
       
       this.$set(this,'list', res.data.data)
      });
    },
    onLoad() {
    const _self = this;
    _self.listQuery.status=this.$parent.search.status
  _self.listQuery.personRole=_self.listQuery.personRole || this.$parent.search.personRole || null
  _self.listQuery.contentOrTitle=_self.listQuery.contentOrTitle || this.$parent.search.contentOrTitle || null
   _self.listQuery.endTime= _self.listQuery.endTime || this.$parent.search.endTime || null
      findPage(_self.listQuery).then(res => {
         let datas = res.data.data
        
         if(res.data.start!==0){
            _self.list = _self.list.concat(datas)
            
         }else{
            
            _self.list =datas
         }
           
             if (_self.list.length < res.data.totalCount) {
                  _self.listQuery.pageIndex++
                 _self.loading = false
             }else{
                _self.finished = true
                _self.loading = true
           }
      
      });
    },
    toDetail(id){
      this.$router.push({path:'/complaint/detail',query:{param:this.listQuery,id:id}})

    },
    onRefresh() {
      this.getroadList();
    }
  },
 
};
</script>

<style lang="scss" scoped>
/deep/ .van-card {
  margin: 0.5rem;
  color: #323233;
  width: calc(100% - 1rem);
  height: 5.5rem;
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 0.5rem;
  position: relative;
  .van-card_left {
    display: inline-block;
    width: calc(100% - 3rem);
    text-align: left;
    margin-top: 0.5rem;
  }
  .van-card_right {
    margin-top: 0.5rem;
    display: inline-block;
    text-align: left;
    width: 3rem;
    vertical-align: top;
    .van-card-status {
      width: 2.65rem;
      opacity: 1;
      border-radius: 0.1rem;
      text-align: center;
      height: 1rem;
      line-height: 1rem;
    }
  }
}

.van-card-time {
  height: 1rem;
  font-size: 0.7rem;
  font-family: "PingFang SC Regular";

  height: 1rem;
  color: #9ea0a7;
}
.van-card-dec {
  font-family: "PingFang SC Regular";
  font-size: 0.8rem;
  line-height: 0.8rem;
  font-weight: 400;
  color: #202327;
  opacity: 1;
  text-align: left;
  margin-top: 0.35rem;
  overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.vant-card-detailBtn {
  text-align: center;
  font-size: 0.8rem;
  font-family: "PingFang SC Regular";
  font-weight: 400;
  margin-top: 0.75rem;
  color: #007761;
}
</style>
