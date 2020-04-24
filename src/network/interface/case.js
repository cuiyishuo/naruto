import { request } from "../request";
// 新增用例
export function addCase(caseForm) {
  return request({
    method: "post",
    url: "/component/case",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    data: caseForm
  });
}

// 查询用例
export function findCase(interfaceId) {
  return request({
    method: "get",
    url: "/component/cases",
    params: { interfaceId: interfaceId }
  });
}

// 检查断言表达式
export function checkExpression(assertExpression) {
  return request({
    method: "post",
    url: "/component/assert",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    data: assertExpression
  });
}
