import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import {webView} from '@/webview';
export const CancelToken = axios.CancelToken;

// create an axios instance
const service = axios.create({
  baseURL: "", // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
});
 console.log(webView)
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["token"] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    if (
      res instanceof Object &&
      typeof res.code === "undefined" &&
      typeof res.msg === "undefined" &&
      typeof res.data === "undefined"
    ) {
      return { code: 0, data: res, msg: "success" };
    } else if (response.status === 200) {
      if (res.code === -1) {
        // Message({
        //   message: res.msg || "Error",
        //   type: "error",
        //   duration: 5 * 1000
        // });
        return res;
      }
      return res;
    } else if (res.code !== 20000 && res.code !== 200 && res.code !== 0) {
      // if the custom code is not 20000, it is judged as an error.
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        res.code === 50008 ||
        res.code === 50012 ||
        res.code === 50014 ||
        res.code === 401 ||
        res.code === 403
      ) {
        // to re-login
        MessageBox.confirm(
          "您已经登出，您可以取消以停留在此页面，或再次登录",
          "确认退出",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          // store.dispatch("user/resetToken").then(() => {
          //   location.reload();
          // });
          // webView.back()
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
