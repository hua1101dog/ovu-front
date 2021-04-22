<template>
  <div id="screen">
    <van-nav-bar title="投诉与建议" left-arrow @click-left="$webView.back()">
      <template #right>
        <img
          @click="showPopup = true"
          class="searchImg"
          src="@/assets/img/search.png"
        />
      </template>
    </van-nav-bar>
    <van-popup
      v-model:show="showPopup"
      position="top"
      :style="{ height: '15.5rem', padding: '1rem', textAlign: 'left' }"
      @close="closePop"
    >
      <template>
        <div class="form-label">内容所包含关键字</div>
        <van-cell-group>
          <van-field v-model="search.contentOrTitle" />
        </van-cell-group>
      </template>
      <template>
        <div class="form-label mt1">投诉人角色</div>
        <van-button
          :type="search.personRole == 2 ? 'primary' : 'default'"
          style="margin-right: 0.75rem"
          @click="chooseRole(2)"
          >教职工</van-button
        >
        <van-button
          :type="search.personRole == 1 ? 'primary' : 'default'"
          @click="chooseRole(1)"
          >学生</van-button
        >
      </template>
      <template>
        <div class="form-label" style="margin-top: 1.6rem">投诉时间</div>
        <div style="display: flex">
          <div
            style="flex: 1; display: inline-block; position: relative"
            @click="showPickerFn('start')"
          >
            <van-field
              v-model="search.startTime"
              style="padding: 0.2rem 0.5rem 0.2rem 1.7rem"
              readonly
              placeholder="开始时间"
              clearable
            />
            <van-icon
              name="close"
              size="0.7rem"
              v-if="search.startTime"
              class="closeIcon"
              @click.stop="clearTime('start')"
            />
            <img src="@/assets/img/date.png" alt="" class="dateImg" />
          </div>

          <div class="date-line"></div>
          <div
            style="flex: 1; display: inline-block; position: relative"
            @click="showPickerFn('end')"
          >
            <van-field
              v-model="search.endTime"
              style="padding: 0.2rem 0.5rem 0.2rem 1.7rem"
              readonly
              placeholder="截止时间"
            />
            <img src="@/assets/img/date.png" alt="" class="dateImg" />
            <van-icon
              name="close"
              size="0.7rem"
              v-if="search.endTime"
              class="closeIcon"
              @click.stop="clearTime('end')"
            />
          </div>
        </div>
      </template>
      <div>
        <van-popup
          v-model:show="showPicker"
          position="bottom"
          get-container="#screen"
        >
          <van-datetime-picker
            v-model="formdate"
            type="date"
            :title="pTitle"
            :max-date="maxDate"
            @confirm="onConfirm_time"
            @cancel="showPicker = false"
          />
        </van-popup>
      </div>
      <template>
        <div style="display: flex">
          <van-button
            type="default"
            style="
              margin-right: 1.7rem;
              flex: 1;
              height: 1.8rem;
              margin-top: 1.6rem;
              border: 1px solid #007761;
              opacity: 1;
              border-radius: 0.15rem;
            "
            @click="reset"
            >重置</van-button
          >
          <van-button
            type="primary"
            @click="confirm"
            style="
              flex: 1;
              margin-top: 1.6rem;
              height: 1.8rem;
              border: 1px solid #007761;
              opacity: 1;
              border-radius: 0.15rem;
            "
            >确认</van-button
          >
        </div>
      </template>
    </van-popup>

    <!-- <van-tabs :active="activeName" @click="tabClick">
      <van-tab title="未回复" name="0">
        <comp-item :status="status" ref="child"></comp-item>
      </van-tab>
      <van-tab title="已回复" name="1">
        <comp-item :status="status" ref="child"></comp-item>
      </van-tab>
    </van-tabs> -->
    <div class="van-tabs van-tabs--line">
      <div class="van-tabs__wrap">
        <div role="tablist" class="van-tabs__nav van-tabs__nav--line">
          <div role="tab"  @click="tabClick('0')" class="van-tab" :class="{'van-tab--active':search.status=='0'}">
            <span class="van-tab__text van-tab__text--ellipsis" > 未回复</span>
          </div>
          <div role="tab" @click="tabClick('1')" class="van-tab" :class="{'van-tab van-tab--active':search.status=='1'}">
            <span class="van-tab__text van-tab__text--ellipsis">已回复</span>
          </div>
          <div
            class="van-tabs__line"
            style="
              transform: translateX(281.5px) translateX(-50%);
              transition-duration: 0.3s;
            "
          ></div>
        </div>
      </div>
      <div class="van-tabs__content">
        <div
         
        
          class="van-tab__pane"
          style="display: none"
        >
          <div  >
            <div  class="van-pull-refresh">
              <div
                class="van-pull-refresh__track"
                style="transition-duration: 0ms"
              >
                <div class="van-pull-refresh__head"></div>
                <div  role="feed" class="van-list">
                  <div class="van-list__placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div   class="van-tab__pane" >
          <div  >
            <div  class="van-pull-refresh">
              <div
                class="van-pull-refresh__track"
                style="transition-duration: 0ms"
              >
                <div class="van-pull-refresh__head"></div>
                <div  role="feed" class="van-list">
                  <comp-item :status="search.status" ref="child"></comp-item>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import compItem from "./compItem.vue";
import { Toast } from "vant";
export default {
  name: "complaint",
  components: { compItem },

  data() {
    return {
      list: [],
      search: {
        contentOrTitle: "",
        personRole: null,
        startTime: "",
        endTime: "",
        status:'0'
      },
   
      showPopup: false,
      parkIdCopy: null,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      formdate: new Date(),

      showPicker: false,
      flag: "start",
      pTitle: "开始时间",
    };
  },
  methods: {
    tempUserInof(data) {
      this.parkIdCopy = JSON.parse(data).parkId;
    },
    tabClick(name, title) {
     
      this.search.status=name
      this.$refs.child.getroadList(this.search);
    },
    chooseRole(role) {
      this.$set(this.search, "personRole", role);
      this.search.personRole = role;
    },
    showPickerFn(time) {
      this.showPicker = true;

      this.flag = time;
      if (time == "start") {
        this.pTitle = "开始时间";
      } else {
        this.pTitle = "截止时间";
        this.maxDate = new Date();
      }
    },
    onConfirm_time(time) {
      this.showPicker = false;
      if (this.flag == "start") {
        if (
          !this.search.endTime <
          this.moment(this.moment(time).valueOf()).format("yyyy-MM-DD")
        ) {
          Toast.fail("开始时间不得大于结束时间");
          return;
        }
        this.search.startTime = this.moment(this.moment(time).valueOf()).format(
          "yyyy-MM-DD"
        );
      } else {
        if (
          this.search.startTime >
          this.moment(this.moment(time).valueOf()).format("yyyy-MM-DD")
        ) {
          Toast.fail("结束时间不得大于开始时间");
          return;
        }
        this.search.endTime = this.moment(this.moment(time).valueOf()).format(
          "yyyy-MM-DD"
        );
        this.maxDate = time;
      }
    },

    clearTime(time) {
      this.flag = time;
      this.formdate = new Date();
      if (time == "start") {
        this.search.startTime = null;
        this.formdate = new Date();

        this.minDate = this.moment().subtract(3, "years")._d; //3年前的今天
      } else {
        this.search.endTime = null;
        this.formdate = new Date();
        this.maxDate = new Date();
      }
    },
    reset() {
       this.search.personRole=null
       this.search.contentOrTitle=null
        this.search.startTime=null
        this.search.endTime=null
    },
    confirm() {
      this.showPopup = false;
    },
    closePop() {
      this.$refs.child.getroadList(this.search);
    },
  },
  mounted() {
   
    if (this.$route.query && this.$route.query.param) {
     
      this.search.status=this.$route.query.status
      this.search.personRole=this.$route.query.param.personRole || null
       this.search.contentOrTitle=this.$route.query.param.contentOrTitle || null
        this.search.startTime=this.$route.query.param.startTime || null
        this.search.endTime=this.$route.query.param.endTime || null
      
    }else{
     
       this.search.status='0'
       this.$set(this.search,'status','0')
    }
    // window.getUserInfo = this.tempUserInof;
    // this.$webView.getUserInfo();
  },
};
</script>

<style lang="scss" scoped>
.searchImg {
  width: 2.2rem;
  height: 0.95rem;
  display: inline-block;
  margin-right: 1rem;
}
/deep/ .van-tabs--line .van-tabs__wrap {
  height: 1.75rem;
}
/deep/ .van-tab__text--ellipsis {
  width: 3rem;
  height: 1.1rem;
  font-size: 0.8rem;
  font-family: "PingFang SC Regular";
  color: rgba(158, 160, 167, 1);
  line-height: 1.1rem;
}
/deep/ .van-tab--active {
  span {
    color: #007761;
    font-weight: 700;
  }
}
.form-label {
  width: 6rem;
  height: 1rem;
  font-size: 0.75rem;
  font-family: "PingFang SC Regular";
  font-weight: 400;
  line-height: 1rem;
  color: #202327;
  margin-bottom: 0.25rem;
  text-align: left;
}
/deep/ .van-cell {
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  height: 1.6rem;
  border: 1px solid #b3b5bc;
  border-radius: 0.15rem;
}
/deep/ .van-popup--top {
  width: calc(100% - 2rem);
}
/deep/ .van-cell-group {
  background: #ffffff;
}
.mt1 {
  margin-top: 1rem;
}
/deep/ .van-button--normal {
  padding: 0 0.04rem;
  font-size: 0.7rem;
  width: 4.25rem;
  height: 1.6rem;
  margin-top: 0.65rem;
}
/deep/ .van-button--primary {
  color: #fff;
  background-color: rgba(0, 119, 97, 1);
  border: 1px solid rgba(0, 119, 97, 1);
}
.date-line {
  width: 1.3rem;
  height: 0;
  border: 0.00267rem solid #9ea0a7;
  display: inline-block;
  vertical-align: inherit;
  margin: 0.7rem 0.15rem 0 0.15rem;
}
.dateImg {
  position: absolute;
  width: 0.85rem;
  height: 0.85rem;
  display: inline-block;
  left: 0.5rem;
  top: 0.4rem;
}
.closeIcon {
  position: absolute;
  width: 0.85rem;
  height: 0.85rem;
  display: inline-block;
  right: 0rem;
  top: 0.4rem;
}
/deep/ .van-picker__toolbar {
  height: 1.5rem;
  padding: 0.6rem 1rem;
}
/deep/ .van-picker__cancel,
/deep/ .van-picker__confirm {
  color: #969799;

  height: 1rem;
  font-size: 0.7rem;

  font-weight: 400;

  color: #007761;
}
/deep/ .van-picker__title {
  height: 1.1rem;
  font-size: 0.8rem;

  font-weight: bold;
  line-height: 1.1rem;
  color: #202327;
}
/deep/ .van-picker-column__item--selected {
  color: #007761;
}
/deep/ .van-tabs__line {
  background: transparent;
}
</style>
