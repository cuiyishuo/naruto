import { request } from "../request";

export function addComponent(componentForm) {
  return request({
    method: "post",
    url: "/component/addComponent",
    data: componentForm
  });
}

export function getComponent(componentForm, pageNo, pageSize) {
  return request({
    methods: "get",
    url: "/component/getComponent?pageNo=" + pageNo + "&pageSize=" + pageSize,
    params: componentForm
  });
}
