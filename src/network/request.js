import axios from "axios";
import qs from "qs";

/**
 * 封装axios第三方请求方法,通过参数返回响应成功或失败信息
 */
export function request(config) {
  axios.defaults.withCredentials = true; // 若跨域请求需要带 cookie 身份识别

  const instance = axios.create({
    baseURL: "http://localhost:8081",
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
    config => {
      if (config.data != "") {
        // 格式化post的body，转换成aa=1&bb=2形式
        config.data = qs.stringify(config.data);
      }
      return config;
    },
    err => {
      console.log(err);
    }
  );
  // 响应拦截
  instance.interceptors.response.use(
    res => {
      return res.data;
    },
    err => {
      console.log(err);
    }
  );
  return instance(config);
}
