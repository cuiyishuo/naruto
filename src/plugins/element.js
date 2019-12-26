import Vue from "vue";
// 按需倒入所需的元素组件
import { Button } from "element-ui";
import { Form  } from "element-ui";
import { FormItem } from "element-ui";
import { Input } from "element-ui";

// 全局注册组件
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
