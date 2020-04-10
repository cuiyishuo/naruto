import { request } from "../request";
// 新增组件
export function addComponent(componentForm) {
  return request({
    method: "post",
    url: "/component/addComponent",
    data: componentForm
  });
}
// 查询组件
export function getComponent(componentForm, pageNo, pageSize) {
  return request({
    methods: "get",
    url: "/component/getComponent?pageNo=" + pageNo + "&pageSize=" + pageSize,
    params: componentForm
  });
}

// 更新组件
export function updateComponent(componentForm) {
  return request({
    method: "patch",
    url: "/component/updateComponent",
    data: componentForm
  });
}
