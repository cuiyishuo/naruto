import { request } from "../network/request";
// 获取项目列表
export function getProjectList(pageParam) {
  return request({
    method: "get",
    url: "/main/getProjectList",
    params: pageParam
  });
}
// 创建项目
export function addProject(addProjectForm) {
  return request({
    method: "post",
    url: "/main/createProject",
    data: addProjectForm
  });
}
// 将项目进行逻辑删除
export function deleteProject(projectId) {
  return request({
    method: "post",
    url: "/main/deleteProject/" + projectId
  });
}

// 修改用户当前项目
export function modifyCurrentId(currentProjectId) {
  return request({
    method: "post",
    url: "/main/modifyCurrentId",
    data: currentProjectId
  });
}

// 修改用户当前项目
export function getLastProjectId() {
  return request({
    method: "get",
    url: "/main/getLastProjectId"
  });
}
