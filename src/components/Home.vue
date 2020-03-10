<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <router-link to="/welcome">wanmen测试平台</router-link>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#3986D9"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="this.$route.path.substring(1, 20)"
        >
          <!-- 折叠标签按钮 -->
          <div class="toggle-button" @click="toggleCollapse">
            <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
          </div>
          <!-- 一级目录 -->
          <el-submenu :index="model.id + ''" v-for="model in menuList" :key="model.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ model.name }}</span>
            </template>

            <!-- 二级目录 -->
            <el-menu-item
              :index="functions.path + ''"
              v-for="functions in model.children"
              :key="functions.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ functions.funcName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 首页主版块 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      path: "",
      // 左侧菜单数据
      menuList: [
        {
          id: 1,
          name: "项目管理",
          children: [{ id: 1, funcName: "全部项目", path: "project" }]
        },
        {
          id: 2,
          name: "测试工具",
          children: [
            { id: 11, funcName: "Http 接口测试", path: "httptest" },
            { id: 12, funcName: "dubbo 接口测试", path: "dubbotest" }
          ]
        },
        {
          id: 3,
          name: "性能测试",
          children: [
            { id: 21, funcName: "jmeter性能测试", path: "jmeter" },
            { id: 32, funcName: "压力测试", path: "yali" }
          ]
        }
      ],
      isCollapse: false
    };
  },
  methods: {
    // 点击切换菜单折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 退出
    logout() {
      window.localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #3378c3;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #3986d9;
  .toggle-button {
    background-color: #3986d9;
    line-height: 36px;
    color: #fffde4;
    text-align: center;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #f2f4f5;
}
.home-container {
  height: 100%;
}
</style>
