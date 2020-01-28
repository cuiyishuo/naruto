import { request } from "../request";

export function login(loginForm) {
  return request({
    method: "post",
    url: "/main/login",
    data: loginForm
  });
}
