<template>
  <!-- 给登录组件加样式类 -->
  <div class="login_container">
    <!-- 登录框元素 -->
    <div class="login_box">
      <!-- 登录头像元素 -->
      <div class="avatar_box">
        <img src="../assets/login/avatar.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
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
}
</style>
