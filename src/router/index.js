import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Home from "../components/Home.vue";

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
  },
  {
    path: "/register",
    component: Register
  },
  {
    path: "/home",
    component: Home
  }
];

const router = new VueRouter({
  routes
});

export default router;
