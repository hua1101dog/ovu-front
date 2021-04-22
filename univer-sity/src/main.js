import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import webView from './webview';
import getDevice from './webview';
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
import moment from "moment";
import Element from "element-ui";
Vue.use(Element);
import {
  Tag,
  Cell,
  CellGroup,
  Col,
  Row,
  Tab,
  Tabs,
  Card,
  Icon,
  Search,
  List,
  PullRefresh,
  Form,
  Field,
  Button,
  RadioGroup,
  Radio,
  checkbox,
  CheckboxGroup,
  Dialog,
  IndexBar,
  IndexAnchor,
  DropdownMenu,
  DropdownItem,
  NavBar,
  Swipe,
  SwipeItem,
  Loading,
  Overlay,
  Lazyload,
  Popup,
  Toast,
  Picker,
  DatetimePicker,
  Collapse, 
  CollapseItem
} from 'vant'
// 引入vant样式
import 'vant/lib/index.css'

Vue.use(Cell)
  .use(CellGroup)
  .use(Col)
  .use(Row)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(Icon)
  .use(Search)
  .use(List)
  .use(PullRefresh)
  .use(Form)
  .use(Field)
  .use(Button)
  .use(Radio)
 
  .use(CheckboxGroup)
  .use(RadioGroup)
  .use(Dialog)
  .use(IndexBar)
  .use(IndexAnchor)
  .use(NavBar)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Loading)
  .use(Overlay)
  .use(Lazyload)
  .use(Popup)
  .use(Tag)
  .use(Toast)
  .use(Picker)
  .use(DatetimePicker)
  .use(Collapse)
  .use(CollapseItem),
  (Vue.config.productionTip = false)
  
 
  Vue.prototype.$webView = webView
Vue.prototype.$getDevice = getDevice
Vue.prototype.moment = moment;
router.beforeEach((to, from, next) => {

  if(to.query.token){
   
    document.cookie = `token=${to.query.token}; path=/`;
   
  }
  if(to.query.parkId){
    Vue.prototype.$parkId = to.query.parkId
   
  }

  next();
 
  
});
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});