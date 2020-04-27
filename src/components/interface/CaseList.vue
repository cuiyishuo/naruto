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
      <el-breadcrumb-item
        :to="{
          path: '/component'
        }"
        >组件列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>用例列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card背景 -->
    <el-card class="box-card">
      <!-- 功能按钮 -->
      <el-row :gutter="10">
        <el-col :span="2.5">
          <el-button type="primary" size="medium" @click="toAddCase()">
            新增测试用例
          </el-button>
          <router-link to="/component" style="margin-left:10px">
            <el-button type="info" size="medium">
              返回
            </el-button>
          </router-link>
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
        <el-table
          :data="caseData"
          @selection-change="handleSelectionChange"
          border
          stripe
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="id"></el-table-column>
          <el-table-column
            prop="caseName"
            label="用例名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="caseLevel"
            label="用例级别"
            align="center"
          ></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center">
          </el-table-column>
          <el-table-column prop="result" label="测试结果" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <!-- 通过csope获取列表每行的数据，并传入方法 -->
            <template slot-scope="scoped">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑用例"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="toEditCase(scoped.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="执行测试用例"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="success"
                  icon="el-icon-video-play"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
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
import { findCase } from "../../network/interface/case.js";
export default {
  data() {
    return {
      componentForm: { componentType: "http" },
      caseData: [],
      // 组件类型下拉列表
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
      total: 0,
      caseSelection: []
    };
  },
  created() {
    let interfaceId = this.$store.state.interfaceId;
    this.getCase(interfaceId);
  },
  methods: {
    // 获取当前接口下用例数据
    getCase(interfaceId) {
      // 调用查询用例接口
      findCase(interfaceId).then(res => {
        console.log(res.data.data);
        this.caseData = res.data.data;
        this.total = Number(res.headers.total);
      });
    },
    /**
     * 跳转到新增用例
     */
    toAddCase() {
      let interfaceId = this.$store.state.interfaceId;
      this.$router.push("/component/" + interfaceId + "/case");
    },
    /**
     * 跳转到编辑用例页面，并将row数据保存至store
     */
    toEditCase(scopredRow) {
      let interfaceId = this.$store.state.interfaceId;
      this.$router.push("/component/" + interfaceId + "/editcase");
      // 保存行数据到store
      this.$store.commit("getCaseRow", scopredRow);
    },
    // 获取列表中checkbox选中的数据
    handleSelectionChange(val) {
      this.caseSelection = val;
      console.log(this.caseSelection);
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log("监听分页：" + newSize);
      this.pageParam.pageSize = newSize;
      let interfaceId = this.$store.state.interfaceId;
      this.getCase(interfaceId);
    },
    // 监听 pageno 改变的事件
    handleCurrentChange(newPageNo) {
      console.log("监听页码：" + newPageNo);
      this.pageParam.pageNo = newPageNo;
      let interfaceId = this.$store.state.interfaceId;
      this.getCase(interfaceId);
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
