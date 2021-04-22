<template>
  <div>
    <van-nav-bar
      title="投诉详情"
      left-arrow
      @click-left="
       back(item.status)
      "
    >
    </van-nav-bar>
    <div class="van-card">
      <div
        class="type"
        :class="{ re: item.status == '1', un: item.status == '0' }"
      >
        {{ item.status == 1 ? "已回复" : item.status == 0 ? "未回复" : "" }}
      </div>
      <div style="clear:both">
        <!-- <img class="avatarImg" src="@/assets/img/avatar.png" alt="" /> -->
        <span class="van-card-name">投诉人：{{ item.personName }}</span>
        <span class="role">{{
          item.personRole == 2 ? "教职工" : item.personRole == 1 ? "学生" : ""
        }}</span>
        <div class="van-card-phone">联系方式：{{ item.personPhone }}</div>
      </div>

      <div class="van-card-dec">
        {{ item.content }}
      </div>
      <div v-if="item.status == 1">
        <div class="replyDetail" v-for="(rep, i) in item.replyList" :key="i">
          <div class="replytime">{{ rep.replyTime }}</div>
          <div class="replycontent">
            <span style="color:rgba(0, 119, 97, 1)">{{
              rep.replyPersonDept
            }}</span
            >回复:
            {{ rep.replyContent }}
          </div>
        </div>
      </div>

      <div style="width:100%">
        <van-button
          type="primary"
          @click="showReply = true"
          style="width: 7.5rem; margin:1.25rem 4.8rem 0.6rem 4.8rem;height: 1.8rem;border: 1px solid #007761;opacity: 1;border-radius: 0.15rem;"
          >{{
            item.status == 1 ? "再次回复" : item.status == 0 ? "回复" : ""
          }}</van-button
        >
        <!-- <van-popup v-model:show="showReply" position="bottom"     closeable> -->
        <van-popup v-model:show="showReply" position="bottom">
          <van-field
            v-model="replyContent"
            style="  margin: 1rem;"
            autosize
            type="textarea"
            placeholder="请输入投诉内容"
          />
          <div style="height:3rem;width: calc(100% - 1rem);">
            <van-button
              type="primary"
              @click="send"
              style="width: 7.5rem; float:right;margin-top:0.7rem;margin-right: 1rem;
height: 1.8rem;
border: 1px solid #007761;
opacity: 1;
border-radius: 0.15rem;"
              >发送</van-button
            >
            <van-button
              type="default"
              style="margin-right: 1.7rem;float:right;margin-top:0.7rem;
height: 1.8rem;
border: 0;
opacity: 1;
color:rgba(0, 119, 97, 1)
width:3rem"
              @click="replyContent = ''"
              >清空</van-button
            >
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script scoped>
import { findDetail, replay,getUser } from "@/api/complaint";
import { Toast } from "vant";
export default {
  name: "complaintDetail",
  data() {
    return {
      showReply: false,
      replyContent: "",
      item: {},
     
    };
  },
  methods: {
    send() {
      replay({
        replyContent: this.replyContent,
        complaintId: this.item.id
      }).then(res => {
   
        if (res.code == 0) {
          Toast.success("回复成功");
          findDetail(this.$route.query.id).then(res => {
            this.item = res.data;
          });
        } else {
          Toast.fail(res.msg);
        }
        this.showReply = false;
      });
    },
    back(status){
      this.$router.push({ path: '/complaint', query: { status: status,param:this.$route.query.param} })
    }
  },
  mounted() {
 
    findDetail(this.$route.query.id).then(res => {
      this.item = res.data;
    });
    
  }
};
</script>

<style lang="scss" scoped>
/deep/ .van-card {
  margin: 0.5rem !important;
  color: #323233;
  width: calc(100% - 1rem);
  max-height: calc(100% - 3rem);
  text-align: left;
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 0.5rem;
  position: relative;
}
.avatarImg {
  height: 1.5rem;
  width: 1.5rem;
  vertical-align: middle;
  right: 0.5rem;
}

.van-card-name {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  font-family: "PingFang SC Bold";
  font-weight: bold;

  color: #202327;
  opacity: 1;
}
.van-card-phone {
  margin-left: 0.5rem;
  margin-top: 0.2rem;
  font-size: 0.6rem;
  font-family: "PingFang SC Regular";
  font-weight: 400;

  color: #9ea0a7;
}
.van-card-dec {
  font-family: "PingFang SC Regular";
  font-size: 0.7rem;
  line-height: 1.2rem;
  font-weight: 400;
  margin-top: 1rem;
  color: #202327;
  opacity: 1;
  margin-left: 0.5rem;
}
.type {
  width: 2.6rem;
  height: 1rem;
  border-radius: 0.5rem 0.5rem 0 0.5rem;
  float: right;
  margin-right: -0.5rem;
  margin-top: -0.5rem;
  text-align: center;
}

.role {
  width: 2.5rem;
  font-size: 0.6rem;
  background: #f1f3fb;
  opacity: 1;
  border-radius: 0.45rem;
  text-align: center;
  display: inline-block;
  margin-left: 0.5rem;
  color: rgba(0, 119, 97, 1);
}
/deep/ .van-button--primary {
  color: #fff;
  background-color: rgba(0, 119, 97, 1);
  border: 1px solid rgba(0, 119, 97, 1);
}
.replyDetail {
  padding: 0.45rem;
  background: #f2f2f2;
  margin-top: 0.65rem;
  border-radius: 0.25rem;
  .replytime {
    float: right;
    height: 1rem;
    font-size: 0.65rem;
    font-family: "PingFang SC Bold";
    font-weight: bold;
    line-height: 1rem;
    color: #56575b;
    margin-top: 0.15rem;
    margin-bottom: 0.35rem;
  }
  .replycontent {
    clear: both;
    line-height: 1.2rem;

    font-size: 0.7rem;
    font-family: "PingFang SC Regular";
    font-weight: 400;
    line-height: 1rem;
    color: #56575b;
    opacity: 1;
  }
}
/deep/ .van-cell {
  height: 7rem;
  background: #f2f2f2;

  width: calc(100% - 2rem);
}
/deep/ .van-popup__close-icon--top-right {
  top: 0.1rem;
  right: 0.5rem;
}
/deep/ .van-popup__close-icon {
  font-size: 0.8rem;
}
</style>
