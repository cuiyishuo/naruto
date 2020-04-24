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
      <el-breadcrumb-item>新增组件</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card背景 -->
    <el-card class="box-card">
      <!-- 功能按钮 -->
      <el-row :gutter="10">
        <el-col :span="2.5">
          <el-button type="primary" size="medium" @click="save()">
            保存
          </el-button>
          <router-link to="/component" style="margin-left:10px">
            <el-button type="info" size="medium">
              返回
            </el-button>
          </router-link>
          <el-button v-show="false" @click="t1()" style="margin-left:30px"
            >test</el-button
          >
        </el-col>
      </el-row>

      <!-- 接口请求表单区域 -->
      <el-form
        :model="componentForm"
        :rules="componentRules"
        ref="componentRef"
        size="small"
        label-position="left"
        label-width="110px"
      >
        <el-row :gutter="25">
          <!-- 接口名 -->
          <el-col :span="10">
            <el-form-item
              label="接口名："
              prop="interfaceName"
              label-width="90px"
            >
              <el-input v-model="componentForm.interfaceName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="25">
          <!-- 域名 -->
          <el-col :span="7">
            <el-form-item label="域名：" prop="host" label-width="90px">
              <el-input v-model="componentForm.host"></el-input>
            </el-form-item>
          </el-col>
          <!-- 接口地址 -->
          <el-col :span="10">
            <el-form-item label="接口地址：" prop="apiUrl" label-width="100px">
              <el-input v-model="componentForm.apiUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="25">
          <!-- 超时时间下拉选择 -->
          <el-col :span="5">
            <el-form-item
              label="超时时间(s):"
              prop="timeOut"
              label-width="90px"
            >
              <el-select v-model="componentForm.timeOut" placeholder="请选择">
                <el-option
                  v-for="item in timeOutOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 请求方法下拉选择-->
          <el-col :span="5">
            <el-form-item label="请求方法：" prop="methods" label-width="90px">
              <el-select v-model="componentForm.methods" placeholder="请选择">
                <el-option
                  v-for="item in methodsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 添加信息头开关 -->
          <el-col :span="2.5">
            <el-form-item
              label="添加信息头："
              prop="header"
              label-width="100px"
            >
              <el-switch
                v-model="isHeader"
                @change="activeChange('header')"
              ></el-switch>
            </el-form-item>
          </el-col>
          <!-- 添加请求参数开关 -->
          <el-col :span="2">
            <el-form-item
              label="添加请求参数："
              prop="param"
              label-width="110px"
            >
              <el-switch
                v-model="isParams"
                @change="activeChange('param')"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 信息头/入参表单 -->
      <el-form :model="reqForm" ref="reqRef" size="small">
        <el-tabs v-if="isHeader || isParams" v-model="activeName">
          <!-- 消息头表单 -->
          <el-tab-pane v-if="isHeader" label="信息头" name="header">
            <el-row :gutter="22" class="title">
              <el-col :span="9">
                <el-tag effect="dark" type="info">Key</el-tag>
              </el-col>
              <el-col :span="9">
                <el-tag effect="dark" type="info">Value</el-tag>
              </el-col>
            </el-row>
            <el-form-item
              v-for="(header, index) in reqForm.headers"
              :key="index"
              :prop="'headers.' + index + '.value'"
            >
              <el-row :gutter="22">
                <el-col :span="9">
                  <el-input v-model="header.key"></el-input>
                </el-col>
                <el-col :span="9">
                  <el-input v-model="header.value"></el-input>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="success"
                    icon="el-icon-plus"
                    size="mini"
                    @click="add('header')"
                  ></el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    v-if="index > 0"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click.prevent="removeDomain(header, 'header')"
                  ></el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-tab-pane>
          <!-- 请求参数表单 -->
          <el-tab-pane v-if="isParams" label="请求参数" name="param">
            <el-row :gutter="22" class="title">
              <el-col :span="9">
                <el-tag effect="dark" type="info">Key</el-tag>
              </el-col>
              <el-col :span="9">
                <el-tag effect="dark" type="info">Value</el-tag>
              </el-col>
            </el-row>
            <el-form-item
              v-for="(param, index) in reqForm.params"
              :key="index"
              :prop="'params.' + index + '.value'"
            >
              <el-row :gutter="22">
                <el-col :span="9">
                  <el-input v-model="param.key"></el-input>
                </el-col>
                <el-col :span="9">
                  <el-input v-model="param.value"></el-input>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="success"
                    icon="el-icon-plus"
                    size="mini"
                    @click="add('param')"
                  ></el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    v-if="index > 0"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click.prevent="removeDomain(param, 'param')"
                  ></el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  addComponent,
  getComponent,
  updateComponent
} from "../../network/interface/component.js";
import { formateObjList, JSONStrToObjList } from "../../kit/kit.js";
export default {
  data() {
    return {
      componentRules: {
        interfaceName: [
          { required: true, message: "请输入接口名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        apiUrl: [
          { required: true, message: "请输入接口地址", trigger: "blur" }
        ],
        host: [{ required: true, message: "请输入域名", trigger: "blur" }]
      },
      // 接口请求时提交的表单对象
      componentForm: {
        id: "",
        interfaceName: "",
        host: "beta-api.wanmen.org",
        apiUrl: "",
        timeOut: "3000",
        methods: "get",
        headers: "",
        params: "",
        body: "",
        componentType: "http",
        updateTime: "",
        style: "model" // 通过接口页面新建的接口模型类型
      },
      selectComponentData: {
        id: ""
      },
      // 下拉列表选项
      timeOutOptions: [
        {
          value: "1000",
          label: "1秒"
        },
        {
          value: "2000",
          label: "2秒"
        },
        {
          value: "3000",
          label: "3秒"
        },
        {
          value: "4000",
          label: "4秒"
        },
        {
          value: "5000",
          label: "5秒"
        }
      ],
      methodsOptions: [
        {
          value: "get",
          label: "GET"
        },
        {
          value: "post",
          label: "POST"
        },
        {
          value: "put",
          label: "PUT"
        },
        {
          value: "delete",
          label: "DELETE"
        }
      ],
      // 判断入参和头部开关是否开启
      isHeader: false,
      isParams: false,
      // 默认tab激活状态的标签
      activeName: "",
      // 请求表单对应的请求对象数组
      reqForm: {
        headers: [{ key: "", value: "" }],
        params: [{ key: "", value: "" }]
      },
      pageParam: {
        pageNo: 1,
        pageSize: 10
      }
    };
  },
  created() {
    // 如果为编辑的地址
    if (this.$route.path == "/component/edithttp") {
      // 从store中取出interfaceId
      let interfaceId = this.$store.state.interfaceId;
      console.log("进入编辑，预加载接口数据：", interfaceId);
      this.selectComponentData.id = interfaceId;

      // 根据接口id获取httpentity
      getComponent(
        this.selectComponentData,
        this.pageParam.pageNo,
        this.pageParam.pageSize
      ).then(res => {
        console.log(res.data.data);
        // 获取需要的数据信息
        let componentRes = res.data.data[0];
        this.componentForm = componentRes;

        // 如果有信息头则把信息头信息渲染到页面
        let headerStr = componentRes.headers;
        if (headerStr != "") {
          this.isHeader = true;
          this.activeName = "header";
          // 转换param字符串变为object
          this.reqForm.headers = JSONStrToObjList(
            headerStr,
            this.reqForm.headers
          );
          console.log("遍历后的headerArr：", this.reqForm.headers);
        }

        // 如果有参数则把参数信息渲染到页面
        let paramStr = componentRes.params + componentRes.body;
        if (paramStr != "") {
          this.isParams = true;
          this.activeName = "param";
          // 转换param字符串变为object
          this.reqForm.params = JSONStrToObjList(paramStr, this.reqForm.params);
          console.log("遍历后的paramArr：", this.reqForm.params);
        }
      });
    }
  },

  methods: {
    t1() {
      console.log("path:", this.$route.path);
      console.log(
        "Component组件的interfaceId：",
        this.$store.state.interfaceId
      );
      console.log("遍历后的headerArr：", this.reqForm.headers);
      console.log("遍历后的paramArr：", this.reqForm.params);
    },
    // 开关关联tab的恶心方法
    activeChange(activeName) {
      console.log(activeName);
      if (activeName.includes("header") && this.isHeader) {
        this.activeName = "header";
      } else if (activeName.includes("header")) {
        this.activeName = "param";
      }
      if (activeName.includes("param") && this.isParams) {
        this.activeName = "param";
      } else if (activeName.includes("param")) {
        this.activeName = "header";
      }
    },
    // 保存组件
    save() {
      // 表单预验证，对表单对象进行校验,valid是一个bool值，判断字段校验是否通过
      this.$refs.componentRef.validate(valid => {
        if (valid) {
          // 如果前端有输入，存入对象数组，则将对象数组存入一个对象并转为string
          let saveComponentForm = formateObjList(
            this.reqForm,
            this.componentForm
          );
          // 如果是编辑则调用编辑接口
          if (this.$route.path == "/component/edithttp") {
            // 传入组件id
            this.componentForm.id = this.$store.state.interfaceId;
            updateComponent(saveComponentForm)
              .then(res => {
                console.log(res.data.data);
                // 通过编程式导航跳转到后台首页
                this.$router.push("/component");
              })
              .catch(err => {
                console.log("¥¥¥¥¥¥¥ 更新接口失败 ¥¥¥¥¥¥");
                return this.$message.error(err.message);
              });
          } else {
            // 调用新增组件接口
            addComponent(saveComponentForm)
              .then(res => {
                console.log(res.data.data);
                // 通过编程式导航跳转到后台首页
                this.$router.push("/component");
              })
              .catch(err => {
                console.log("¥¥¥¥¥¥¥ 保存接口失败 ¥¥¥¥¥¥");
                return this.$message.error(err.message);
              });
          }
        }
      });
    },

    // 添加消息头
    add(tab) {
      if (tab.includes("header")) {
        this.reqForm.headers.push({
          value: "",
          key: ""
        });
      } else if (tab.includes("param")) {
        this.reqForm.params.push({
          value: "",
          key: ""
        });
      }
    },
    // 删除消息头
    removeDomain(item, tab) {
      if (tab.includes("header")) {
        let index = this.reqForm.headers.indexOf(item);
        if (index !== -1) {
          this.reqForm.headers.splice(index, 1);
        }
      } else if (tab.includes("param")) {
        let index = this.reqForm.params.indexOf(item);
        if (index !== -1) {
          this.reqForm.params.splice(index, 1);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-col {
  border-radius: 4px;
}
.el-button {
  margin-bottom: 20px;
}
.title {
  margin-bottom: 10px;
}
</style>
