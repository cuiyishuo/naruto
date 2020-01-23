<template>
  <!-- 注册组件 -->
  <div class="register_container">
    <!-- ###### 登录框元素 ######-->
    <div class="register_box">
      <!-- ----- 注册头像区域 ----- -->
      <div class="avatar_box">
        <!-- 跳转到注册页面 -->
        <router-link to="/login">
          <img src="../assets/login/avatar.png" alt="" />
        </router-link>
      </div>
      <!-- 图片内文字 -->
      <div class="avatar_box2">
        <img src="../assets/login/wanmen.png" alt="" />
      </div>
      <!-- ----- 注册表单区域 ----- -->
      <!-- 需要在element插件中，按需倒入需要用到的元素 -->
      <!-- 通过ref属性，拿到表单的实例对象 -->
      <el-form
        class="register_form_box"
        :model="registerForm"
        ref="registerFormRef"
        :rules="registerFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <!-- 增加带icon的属性;增加验证条件 -->
          <el-input
            prefix-icon="iconfont icon-yonghuming"
            type="text"
            placeholder="设置用户名"
            v-model="registerForm.userName"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mima"
            type="text"
            placeholder="设置密码"
            v-model="registerForm.password"
          ></el-input>
        </el-form-item>
        <!-- 邀请码 -->
        <el-form-item prop="inviteCode">
          <el-input
            prefix-icon="iconfont icon-yaoqingma"
            type="text"
            placeholder="输入8位邀请码"
            v-model="registerForm.inviteCode"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="info" @click="resetRegisterForm">重置</el-button>
        </el-form-item></el-form
      >
    </div>
  </div>
</template>

<script>
// 导入注册接口
import { register } from "../network/main/register";

export default {
  data() {
    const checkPwd = (rule, value, callback) => {
      // 定义正则表达式
      const pattern = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      if (!value) {
        callback(new Error("密码不能为空"));
      }
      setTimeout(() => {
        if (!pattern.test(value)) {
          callback(new Error("必须包含特殊字符"));
        } else {
          callback();
        }
      }, 1000);
    };
    const checkInviteCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error("邀请码不能为空"));
      } else if (value.length != 8) {
        callback(new Error("邀请码长度不正确"));
      } else if (value != "wmelyedx") {
        callback(new Error("邀请码不存在"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        userName: "",
        password: "",
        inviteCode: ""
      },
      registerFormRules: {
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
        ],
        inviteCode: [{ validator: checkInviteCode, trigger: "blur" }]
      }
    };
  },
  methods: {
    register() {
      // 表单预验证，登录之前对表单对象进行校验,valid是一个bool值，判断字段校验是否通过
      this.$refs.registerFormRef.validate(valid => {
        console.log(valid);
        if (valid) {
          console.log("发送注册请求");
          register(this.registerForm)
            .then(res => {
              console.log("¥¥¥¥¥¥¥ 响应成功 ¥¥¥¥¥¥");
              console.log(res);
              return this.$message.success("恭喜你，注册成功～～");
            })
            // 请求失败时
            .catch(err => {
              console.log("¥¥¥¥¥¥¥ 响应失败 ¥¥¥¥¥¥");
              return this.$message.error(err.message);
            });
        }
      });
    },
    resetRegisterForm() {
      console.log(this);
      this.$refs.registerFormRef.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.register_container {
  // 设置背景色
  background-color: #2b4b6b;
  //   设置高度
  height: 100%;

  .register_box {
    // 设置宽、高
    width: 450px;
    height: 370px;
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
    .register_form_box {
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
}
</style>
