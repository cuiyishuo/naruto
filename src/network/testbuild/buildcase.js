import { request } from "../request";

// 构建用例级别任务
export function buildCases(caseIds) {
  return request({
    method: "post",
    url: "/build/cases",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    data: caseIds
  });
}

// 构建接口级别的任务
export function buildInterfaces(interfaceIds) {
  return request({
    method: "post",
    url: "/build/interfaces",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    data: interfaceIds
  });
}

// 执行测试用例
export function runCases(buildId) {
  return request({
    method: "get",
    url: "/run/build/" + buildId
  });
}
