import axios from "axios";
import qs from "qs";

/**
 * 封装axios第三方请求方法,通过参数返回响应成功或失败信息
 */
export function request(config) {
  axios.defaults.withCredentials = true; // 若跨域请求需要带 cookie 身份识别

  const instance = axios.create({
    baseURL: "http://49.233.14.252:80",
    timeout: 5000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Method": "POST"
    }
  });

  // axios的拦截器
  // 请求拦截
  instance.interceptors.request.use(
    // 拦截请求成功
    config => {
      console.log(config.url);
      if (
        config.data != "" &&
        config.url != "/component/case" &&
        config.url != "/component/assert" &&
        config.url != "/build/cases"
      ) {
        // 格式化post的body，转换成aa=1&bb=2形式
        config.data = qs.stringify(config.data);
      }
      // 1、比如config中的一些信息不符合服务器的要求
      // 2、比如每次发送网络请求时，都希望在界面中显示一个转圈的图标
      // ！！！3、某些网络请求（如token），必须携带一些信息才能请求，否则跳转
      const authorization = window.localStorage.getItem("authorization");
      // 如果localstoreage中有Authorization字段则证明为登录状态，请求时请求头中需要带上这个字段
      if (authorization != null) {
        config.headers.Authorization = authorization;
      } else {
        console.log("Authorization为null");
      }
      return config;
    },
    // 拦截请求失败，发送都没发送成功
    err => {
      console.log(err);
    }
  );
  // 响应拦截
  instance.interceptors.response.use(
    // 拦截响应成功
    res => {
      return res;
    },
    // // 拦截响应失败
    err => {
      console.log(err);
      // 加上这句就不会在响应失败后，进不到catch中去
      return Promise.reject(err.response.data);
    }
  );
  return instance(config);
}
