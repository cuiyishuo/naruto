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
          <el-button
            type="success"
            size="medium"
            icon="el-icon-video-play"
            @click="excuteCase()"
            >执行测试用例</el-button
          >
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
          :data="componentData"
          border
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="36"> </el-table-column>
          <el-table-column
            type="index"
            label="id"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="interfaceName"
            label="接口名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="apiUrl"
            label="接口路径"
            align="center"
          ></el-table-column>
          <el-table-column prop="methods" label="接口类型" align="center">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.methods }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="180px">
            <!-- 通过csope获取列表每行的数据，并传入方法 -->
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑接口"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="toEdit(scope.row.interfaceId)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="测试用例维护"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-folder-opened"
                  size="mini"
                  @click="toCaseList(scope.row.interfaceId)"
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
import { getComponent } from "../../network/interface/component.js";
import {
  buildInterfaces,
  runCases
} from "../../network/testbuild/buildcase.js";
export default {
  data() {
    return {
      componentForm: {
        componentType: "http",
        projectId: "",
        style: "model"
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
      caseSelection: [],
      pageParam: {
        pageNo: 1,
        pageSize: 10
      },
      projectData: [],
      total: 0,
      buildArrayObj: {
        interfaceIds: [],
        caseIds: []
      }
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
      getComponent(
        this.componentForm,
        this.pageParam.pageNo,
        this.pageParam.pageSize
      ).then(res => {
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
          this.$router.push("/component/addhttp");
          break;
        case "other":
          this.$router.push("/login");
      }
    },
    // 前往编辑组件
    toEdit(interfaceId) {
      console.log("进入的接口id：", interfaceId);
      this.$router.push("/component/edithttp");
      // 将interfaceId提交到store中
      this.$store.commit("getInterfaceId", interfaceId);
    },
    // 前往测试用例列表
    toCaseList(interfaceId) {
      this.$router.push("/component/caselist");
      // 将interfaceId提交到store中
      this.$store.commit("getInterfaceId", interfaceId);
    },
    // 获取列表中checkbox选中的数据
    handleSelectionChange(val) {
      this.caseSelection = val;
      console.log(this.caseSelection);
    },
    // 执行checkbox选中的测试用例
    async excuteCase() {
      let interfaceIds = new Array();
      this.caseSelection.forEach((el, i) => {
        console.log(i, el.interfaceId);
        interfaceIds.push(el.interfaceId);
      });
      console.log("接口id数组：", interfaceIds);
      if (interfaceIds.length == 0) {
        this.$message.error("至少勾选1个接口执行测试用例");
      } else {
        console.log("调用执行用例的接口");
        this.buildArrayObj.interfaceIds = interfaceIds;
        // 使用async/await配合使用，实现同步，await执行完后，才执行async的方法
        let buildId;
        await buildInterfaces(this.buildArrayObj).then(res => {
          console.log(res.data.data);
          buildId = res.data.data;
        });
        this.$router.push("/report/" + buildId);
        // 执行完await修饰的方法后再执行用例测试
        runCases(buildId).then(res => {
          console.log(res.data.data);
        });
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
