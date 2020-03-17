<template>
  <!-- 给登录组件加样式类 -->
  <div class="login_container">
    <!-- ###### 登录框元素 ######-->
    <div class="login_box">
      <!-- ----- 登录头像区域 ----- -->
      <div class="avatar_box">
        <!-- 跳转到注册页面 -->
        <router-link to="/register"
          ><img src="../assets/login/avatar.png" alt="注册"
        /></router-link>
      </div>
      <!-- 图片内文字 -->
      <div class="avatar_box2">
        <img src="../assets/login/wanmen.png" alt="" />
      </div>
      <!-- ----- 登录表单区域 ----- -->
      <!-- 需要在element插件中，按需倒入需要用到的元素 -->
      <!-- 通过ref属性，拿到表单的实例对象 -->
      <el-form
        class="login_form_box"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <!-- 增加带icon的属性;增加验证条件 -->
          <el-input
            prefix-icon="iconfont icon-yonghuming"
            v-model="loginForm.userName"
            type="text"
            placeholder="输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mima"
            v-model="loginForm.password"
            type="text"
            placeholder="输入密码"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入登录接口
import { login } from "../network/main/login";

export default {
  data() {
    // 自定义密码校验规则
    const checkPwd = (rule, value, callback) => {
      // 定义正则表达式
      const pattern = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      setTimeout(() => {
        if (!pattern.test(value)) {
          callback(new Error("必须包含特殊字符"));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      loginForm: {
        userName: "",
        password: ""
      },
      loginFormRules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur"
          },
          { validator: checkPwd, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLoginForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 表单预验证，登录之前对表单对象进行校验,valid是一个bool值，判断字段校验是否通过
      this.$refs.loginFormRef.validate(valid => {
        console.log(valid);
        if (valid) {
          console.log("发送登录请求");
          login(this.loginForm)
            .then(res => {
              console.log("¥¥¥¥¥¥¥ 登录成功 ¥¥¥¥¥¥");
              console.log(res);
              let headers = res.headers;
              this.$message.success("登录成功～～");
              // 登录后操作
              // 1、将登录的token保存到sessionStorege中
              //  1.1、出现除登录注册外的其他api接口，必须在登录后才能访问
              //  1.2、token只应该在当前网站打开期间生效，所以需要保存在sessionStoreage中，
              //       而localStorege只要不清浏览器缓存就不会失效
              console.log("header-auth:" + headers.authorization);
              window.localStorage.setItem(
                "authorization",
                headers.authorization
              );
              // 2、通过编程式导航跳转到后台首页
              this.$router.push("/home");
            })
            .catch(err => {
              console.log("¥¥¥¥¥¥¥ 登录失败 ¥¥¥¥¥¥");
              return this.$message.error(err.message);
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  // 设置背景色
  background-color: #2b4b6b;
  //   设置高度
  height: 100%;
}

.login_box {
  // 设置宽、高
  width: 450px;
  height: 300px;
  // 设置背景色
  background-color: #ffffff;
  // 设置边框圆角
  border-radius: 6px;
  // 设置绝对定位,配合left、right、top、bottom使用
  position: absolute;
  // 距离左侧和顶部都是50%的距离
  left: 50%;
  top: 50%;
  // 旋转，缩放，倾斜或平移给定元素.此处是水平和竖直平移50%（https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform）
  transform: translate(-50%, -50%);

  // 内嵌样式
  .avatar_box {
    height: 130px;
    width: 130px;
    // 边框线
    border: 1px solid #eeeeee;
    // 边框圆角
    border-radius: 50%;
    // 加内边距
    padding: 10px;
    box-shadow: 0 0 40px #eeeeee;
    // 设置绝对定位,配合left、right、top、bottom使用
    position: absolute;
    z-index: 1;
    // 距离左侧和顶部都是50%的距离
    left: 50%;
    // 移动自身的50%，也就是65px
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      // 充满box
      height: 100%;
      width: 100%;
      // 边框圆角
      border-radius: 50%;
      // 加背景色
      background-color: #eeeeee;
    }
  }
  // 嵌套的图片样式
  .avatar_box2 {
    height: 20px;
    width: 90px;
    // 设置绝对定位,配合left、right、top、bottom使用
    position: absolute;
    // 嵌套样式 https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index
    z-index: 2;
    // 距离左侧和顶部都是50%的距离
    left: 50%;
    // 移动自身的50%，也就是65px
    transform: translate(-50%, 110%);
    img {
      // 充满box
      height: 100%;
      width: 100%;
    }
  }

  // 表单样式
  .login_form_box {
    // 设置绝对定位
    position: absolute;
    // 设置距离底部0
    bottom: 0;
    // 设置宽度100%
    width: 100%;
    padding: 20px;
    // https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing
    box-sizing: border-box;

    .btns {
      // flex的意思是变成弹性盒模型
      display: flex;
      // 尾部对齐 https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content
      justify-content: flex-end;
    }
  }
}
</style>
