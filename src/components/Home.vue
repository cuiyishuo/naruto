<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <router-link to="/welcome">wanmen测试平台</router-link>
      </div>
      <div>
        <el-select
          v-model="user.lastProjectId"
          filterable
          placeholder="选择项目"
          size="medium"
          @change="modifyProjectId()"
        >
          <el-option
            v-for="item in curentProjects"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId"
          >
          </el-option>
        </el-select>
        <el-button type="info" @click="logout" style="margin-left:30px">退出</el-button>
      </div>
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
// 导入项目接口
import { getProjectList, modifyCurrentId, getLastProjectId } from "../network/project";
export default {
  data() {
    return {
      path: "",
      // 左侧菜单数据
      menuList: [
        {
          id: 1,
          name: "项目管理",
          children: [{ id: 1, funcName: "项目列表", path: "project" }]
        },
        {
          id: 2,
          name: "组件管理",
          children: [{ id: 11, funcName: "组件列表", path: "component" }]
        },
        {
          id: 3,
          name: "测试工具",
          children: [
            { id: 21, funcName: "Http 接口测试", path: "httptest" },
            { id: 22, funcName: "dubbo 接口测试", path: "dubbotest" }
          ]
        },
        {
          id: 4,
          name: "性能测试",
          children: [
            { id: 31, funcName: "jmeter性能测试", path: "jmeter" },
            { id: 32, funcName: "压力测试", path: "yali" }
          ]
        }
      ],
      isCollapse: false,
      curentProjects: [{}],
      // 默认选中的项目
      pageParam: {
        pageNo: 1,
        pageSize: 100
      },
      user: {
        lastProjectId: ""
      }
    };
  },
  created() {
    console.log("加载header项目列表");
    // 将当前项目默认置为用户的lastProjectId
    getLastProjectId().then(res => {
      console.log("lastProjectId:", res.data.data);
      this.user.lastProjectId = res.data.data;
    });
    getProjectList(this.pageParam).then(res => {
      // 将项目列表对象数组负值给curentProjects
      let resbody = res.data.data;
      this.curentProjects = resbody;
    });
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
    },
    // 切换项目时更改用户当前项目id
    modifyProjectId() {
      modifyCurrentId(this.user).then(res => {
        console.log(res.data.data);
      });
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
