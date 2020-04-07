import { request } from "../request";

export function addComponent(componentForm) {
  return request({
    method: "post",
    url: "/component/addComponent",
    data: componentForm
  });
}
