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
      <el-breadcrumb-item>全部项目</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card背景 -->
    <el-card class="box-card">
      <!-- 功能按钮 -->
      <el-row :gutter="8">
        <el-col :span="2">
          <el-button type="primary" @click="dialogVisible = true">新增项目</el-button>
          <!-- 新增项目弹框 -->
          <el-dialog title="新增项目" :visible.sync="dialogVisible" width="35%">
            <!-- 项目表单主体 -->
            <el-form
              :model="addProjectForm"
              :rules="addProjectRules"
              ref="addProjectRef"
              label-width="100px"
            >
              <!-- 项目名 -->
              <el-form-item label="项目名称" prop="projectName">
                <!-- 增加带icon的属性;增加验证条件 -->
                <el-input
                  v-model="addProjectForm.projectName"
                  type="text"
                  placeholder="输入项目名"
                ></el-input>
              </el-form-item>
              <!-- 表单按钮 -->
              <el-form-item class="addBtn">
                <el-button @click="resetAddProjectForm()">取 消</el-button>
                <el-button type="primary" @click="addProject()">确 定</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-col>
      </el-row>

      <!-- 查询区域 -->
      <el-row :gutter="8">
        <el-col :span="6">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-row>
        <el-table :data="projectData" border stripe>
          <el-table-column type="index" label="id"></el-table-column>
          <el-table-column prop="projectName" label="项目名称"></el-table-column>
          <el-table-column prop="projectId" label="项目id"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
              <el-tooltip
                class="item"
                effect="dark"
                content="查看项目成员"
                placement="top"
                :enterable="false"
              >
                <el-button type="warning" icon="el-icon-view" size="mini"></el-button>
              </el-tooltip>
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
// 导入项目接口
import { getProjectList, addProject, deleteProject } from "../../network/project";

export default {
  data() {
    return {
      total: 0,
      projectData: [],
      isLogicDel: 0,
      pageParam: {
        pageNo: 1,
        pageSize: 10
      },
      dialogVisible: false,
      addProjectForm: {
        projectName: "",
        yn: 0
      },
      addProjectRules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    console.log("初始化页面数据");
    this.getpro();
  },
  methods: {
    // 获取项目列表
    getpro() {
      console.log("获取项目列表数据1：");
      getProjectList(this.pageParam).then(res => {
        console.log("获取项目列表数据2：");
        console.log("项目列表数据：" + res.data.data);
        this.projectData = res.data.data;
        this.total = Number(res.headers.total);
      });
    },
    // 重置添项目表单
    resetAddProjectForm() {
      // 关闭dialog
      this.dialogVisible = false;
      // 清空dialog内容
      console.log(this);
      this.$refs.addProjectRef.resetFields();
    },
    // 新增项目
    addProject() {
      // 表单预验证，登录之前对表单对象进行校验,valid是一个bool值，判断字段校验是否通过
      this.$refs.addProjectRef.validate(isValid => {
        console.log(isValid);
        if (isValid) {
          console.log("发送新建项目请求");
          addProject(this.addProjectForm)
            .then(res => {
              console.log(res);
              // 新建成功后给提示
              this.$message.success("新建项目成功～～");
              // 新建成功后调用重置添加项目表单方法
              this.resetAddProjectForm();
              // 重新获取列表信息
              this.getpro();
            })
            .catch(err => {
              // 调用重置表单方法
              this.resetAddProjectForm();
              this.$message.error(err.message);
              if (err.message.includes("请重新登录")) {
                this.$router.push("/login");
              }
            });
        }
      });
    },
    // 弹出是否删除项目
    open(projectId) {
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          // 调用删除项目接口
          this.delpro(projectId);
          // 重新获取列表信息
          this.getpro();
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    // 将项目进行逻辑删除
    delpro(projectId) {
      deleteProject(projectId).then(res => {
        console.log(res);
      });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log("监听分页：" + newSize);
      this.pageParam.pageSize = newSize;
      this.getpro();
    },
    // 监听 pageno 改变的事件
    handleCurrentChange(newPageNo) {
      console.log("监听页码：" + newPageNo);
      this.pageParam.pageNo = newPageNo;
      this.getpro();
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
// 弹框按钮
.addBtn {
  // flex的意思是变成弹性盒模型
  display: flex;
  // 尾部对齐 https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content
  justify-content: flex-end;
}
</style>
