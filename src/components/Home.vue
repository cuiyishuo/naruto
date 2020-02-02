<template>
  <el-container class="home-container">
    <el-header>Header</el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          background-color="#508fb4"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级目录 -->
          <el-submenu
            :index="model.id + ''"
            v-for="model in menuList"
            :key="model.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ model.name }}</span>
            </template>

            <!-- 二级目录 -->
            <el-menu-item
              :index="functions.id + ''"
              v-for="functions in model.children"
              :key="functions.id"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ functions.funcName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 首页主版块 -->
      <el-main>wanmen测试平台首页</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [
        {
          id: 1,
          name: "功能测试",
          children: [
            { id: 1, funcName: "ui自动化测试" },
            { id: 2, funcName: "api自动化测试" }
          ]
        },
        {
          id: 2,
          name: "性能测试",
          children: [
            { id: 11, funcName: "jmeter性能测试" },
            { id: 12, funcName: "压力测试" }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #005284;
}
.el-aside {
  background-color: #508fb4;
}
.el-main {
  background-color: #fffde4;
}
.home-container {
  height: 100%;
}
</style>
