import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    // 访问默认页面是，重定向到登录页
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  }
];

const router = new VueRouter({
  routes
});

export default router;
