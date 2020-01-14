import { request } from "../request";

export function register(registerForm) {
  return request({
    method: "post",
    url: "/main/signup",
    data: registerForm
  });
}
