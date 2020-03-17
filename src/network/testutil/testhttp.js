import { request } from "../request";

export function invoke(httpReq) {
  return request({
    method: "post",
    url: "/util/testhttp",
    data: httpReq
  });
}
