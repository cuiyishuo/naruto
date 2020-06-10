import { request } from "../request";

export function getLastReport() {
  return request({
    method: "get",
    url: "/report/lastReport",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });
}
