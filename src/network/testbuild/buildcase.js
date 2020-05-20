import { request } from "../request";
// 构建用例
export function buildCases(caseIds) {
  return request({
    method: "post",
    url: "/build/cases",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    data: caseIds
  });
}

// 执行测试用例
export function runCases(buildId) {
  return request({
    method: "get",
    url: "/run/build/" + buildId
  });
}
