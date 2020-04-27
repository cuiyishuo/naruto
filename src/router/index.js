import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Project from "../components/project/Project.vue";
import HttpTest from "../components/testutil/HttpTest.vue";
import Component from "../components/interface/Component.vue";
import HttpComponent from "../components/interface/HttpComponent.vue";
import CaseList from "../components/interface/CaseList.vue";
import AddCase from "../components/interface/AddCase.vue";

Vue.use(VueRouter);

// 解决两次访问相同路由地址报错（NavigationDuplicated）
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const routes = [
  {
    // 访问默认页面是，重定向到登录页
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/register",
    component: Register
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      // 欢迎页
      { path: "/welcome", component: Welcome },
      // 项目管理页面
      { path: "/project", component: Project },
      // 测试工具页面
      { path: "/httptest", component: HttpTest },
      // 组件管理页面
      { path: "/component", component: Component },
      { path: "/component/addhttp", component: HttpComponent }, //新增组件
      { path: "/component/edithttp", component: HttpComponent }, // 编辑组件
      { path: "/component/caselist", component: CaseList }, // 用例列表
      { path: "/component/:id/case", component: AddCase, name: "addCase" }, // 新增用例
      { path: "/component/:id/editcase", component: AddCase, name: "addCase" } // 编辑用例
    ]
  }
];

const router = new VueRouter({
  routes
});

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径、from：从哪个路径跳转而来、next()：放行、next("/xx")：强制跳转到xx
  if (to.path == "/login" || to.path == "/register") {
    return next();
  }
  const authorization = window.localStorage.getItem("authorization");
  if (!authorization) {
    return next("/login");
  } else {
    return next();
  }
});

export default router;
