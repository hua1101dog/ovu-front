import { Notify } from 'vant';
import router from '../router';

function getDevice () {
  if (/(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)) {
    return 'ios';
  } else if (/(Android)/i.test(window.navigator.userAgent)) {
    return 'android';
  } else {
    return 'pc';
  }
}

window.session = function(data) {
  
  console.log(data);

  sessionStorage.setItem('parkId', data.parkId);
  sessionStorage.setItem('token', data.token);
  sessionStorage.setItem('parkUserId', data.parkUserId);
  sessionStorage.setItem('personName', data.personName || '');
  sessionStorage.setItem('companyName', data.companyName ||'');
};

let resolveFn = null;
window.getUserInfo = function(data) {
  
  let obj = JSON.parse(data);
  if(!obj || !obj.token) return;
  document.cookie = `token=${obj.token};path=/`;
  window.session(obj);
  if (resolveFn) resolveFn();
};


let device = {
  ios: {
    
    async getUserInfo() {
      Notify({
        type: "primary",
        duration: 0,
        message: "调用了ios的方法"
      });
      return new Promise(resolve => {
        resolveFn = resolve;
        window.webkit.messageHandlers.nativeObject.postMessage({
          action: 'getUserInfo',
          callback: 'getUserInfo'
        });
      });
    },
    jumpNext({
               title = '',
               url = '',
               hideNavBar = false,
               params ={},
               action = "jumpNewWebPage"}) {
      window.webkit.messageHandlers.nativeObject.postMessage({
        action,
        params: Object.assign({
          title: title,
          url: `${location.origin}${location.pathname}#${url}`,
          hideNavBar
        }, params)
      });
    },
    download({ title = '', url = ''}) {
      window.webkit.messageHandlers.nativeObject.postMessage({
        action: "jumpNewWebPage",
        params: {
          title: title,
          url: url
        }
      });
    },
    back() {
      window.webkit.messageHandlers.nativeObject.postMessage({
        action: "close",
      });
    },
    upload() {
      window.webkit.messageHandlers.nativeObject.postMessage({
        action: 'getImage',
        callback: 'upload'
      });
    }
  },
  android: {
    async getUserInfo() {
      Notify({
        type: "primary",
        duration: 0,
        message: "调用了安卓的方法"
      });
      return new Promise(resolve => {
        let data = JSON.parse(window.nativeMethod.receiveMessage());
        document.cookie = `token=${data.token};path=/`;
        window.session(data);
       
        resolve();
      });
    },
    jumpNext({ title = '', url = '', nextPage = 'default', params = {} }) {   //,action="toNextPage"
      window.nativeMethod.sendMessage(JSON.stringify(Object.assign({
        nextPage,
        title: title,
        url: `${location.origin}${location.pathname}#${url}`
      }, params)));
    },
    download(data) {
      window.open(data.url);
    },
    back() {
      window.nativeMethod.back();
    },
  },
  pc: {
    getUserInfo() {
      let sessionMsg = sessionStorage.getItem("ovu_user")
      window.getUserInfo(sessionMsg);
    },
    download(data) {
      window.open(data.url);
    },
    jumpNext(data) {
      router.push({path:data.url,query:data.params});
    },
    back() {
      router.go(-1);
    },
  }
};

export { getDevice };
export default device[getDevice()];




