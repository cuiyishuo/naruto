<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        :to="{
          path: '/home'
        }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>组件列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card背景 -->
    <el-card class="box-card">
      <!-- 功能按钮 -->
      <el-row :gutter="10">
        <el-col :span="2.5">
          <el-button type="primary" size="medium" @click="toAddComponent()">
            新增组件
          </el-button>
        </el-col>
      </el-row>

      <!-- 查询区域 -->
      <el-form label-position="right" label-width="85px" :model="componentForm">
        <el-form-item label="组件类型：">
          <el-select v-model="componentForm.componentType" placeholder="请选择">
            <el-option
              v-for="item in componentTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 列表区域 -->
      <el-row>
        <el-table :data="componentData" border stripe>
          <el-table-column type="index" label="id"></el-table-column>
          <el-table-column prop="interfaceName" label="接口名称"></el-table-column>
          <el-table-column prop="apiUrl" label="接口路径"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
          <el-table-column label="操作" width="180">
            <!-- 通过csope获取列表每行的数据，并传入方法 -->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="open(scope.row.projectId)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 分页区域 -->
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParam.pageNo"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getComponent } from "../../network/interface/component.js";
export default {
  data() {
    return {
      componentForm: {
        componentType: "http",
        projectId: ""
      },
      componentData: [],
      componentTypeOptions: [
        {
          value: "http",
          label: "Http接口"
        },
        {
          value: "redis",
          label: "redis组件"
        }
      ],
      pageParam: {
        pageNo: 1,
        pageSize: 10
      },
      projectData: [],
      total: 0
    };
  },
  created() {
    this.componentForm.projectId = window.localStorage.getItem("lastProjectId");
    console.log("当前组件类型：", this.componentForm.componentType);
    this.getComponent();
  },
  methods: {
    // 获取组件列表数据
    getComponent() {
      getComponent(this.componentForm, this.pageParam.pageNo, this.pageParam.pageSize).then(res => {
        console.log(res.data.data);
        this.componentData = res.data.data;
        this.total = Number(res.headers.total);
      });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log("监听分页：" + newSize);
      this.pageParam.pageSize = newSize;
      this.getComponent();
    },
    // 监听 pageno 改变的事件
    handleCurrentChange(newPageNo) {
      console.log("监听页码：" + newPageNo);
      this.pageParam.pageNo = newPageNo;
      this.getComponent();
    },
    // 新增组件跳转
    toAddComponent() {
      switch (this.componentForm.componentType) {
        case "http":
          console.log("进入http的switch");
          this.$router.push("/addhttp");
          break;
        case "other":
          this.$router.push("/login");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.el-table {
  font-size: 13px;
  margin-top: 15px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
