import Vue from "vue";
// 按需倒入所需的元素组件
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Main,
  Aside,
  Menu,
  Submenu,
  MenuItem
} from "element-ui";

// 全局注册组件
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Aside);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.prototype.$message = Message;
