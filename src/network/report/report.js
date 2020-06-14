import { request } from "../request";

// 获取最后一次构建任务
export function getLastReport() {
  return request({
    method: "get",
    url: "/report/last",
    headers: { "Content-Type": "application/json;charset=UTF-8" }
  });
}

// 获取当前构建任务
export function getCurrentReport(buildId) {
  return request({
    method: "get",
    url: "/report/current",
    params: buildId
  });
}
