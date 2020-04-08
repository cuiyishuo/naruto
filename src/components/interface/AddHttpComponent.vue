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
            <el-form-item label="接口名：" prop="interfaceName" label-width="90px">
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
            <el-form-item label="超时时间(s):" prop="timeOut" label-width="90px">
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
              <el-select
                v-model="componentForm.methods"
                placeholder="请选择"
                @change="resetInput()"
              >
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
            <el-form-item label="添加信息头：" prop="header" label-width="100px">
              <el-switch v-model="isHeader" @change="activeChange('header')"></el-switch>
            </el-form-item>
          </el-col>
          <!-- 添加请求参数开关 -->
          <el-col :span="2">
            <el-form-item label="添加请求参数：" prop="param" label-width="110px">
              <el-switch v-model="isParams" @change="activeChange('param')"></el-switch>
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
                <span>Key:</span>
              </el-col>
              <el-col :span="9">
                <span>Value:</span>
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
                <span>Key:</span>
              </el-col>
              <el-col :span="9">
                <span>Value:</span>
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
import { addComponent } from "../../network/interface/component.js";
export default {
  data() {
    return {
      componentRules: {
        interfaceName: [
          { required: true, message: "请输入接口名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        apiUrl: [{ required: true, message: "请输入接口地址", trigger: "blur" }]
      },
      // 接口请求时提交的表单对象
      componentForm: {
        interfaceName: "",
        host: "beta-api.wanmen.org",
        apiUrl: "",
        timeOut: "3000",
        methods: "get",
        headers: "",
        params: "",
        body: "",
        componentType: "http"
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
      }
    };
  },
  methods: {
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
      // 如果前端有输入，存入对象数组，则将对象数组存入一个对象并转为string
      if (this.reqForm.headers[0].key != "") {
        let headersObj = {};
        for (let i = 0; i < this.reqForm.headers.length; i++) {
          let key = this.reqForm.headers[i].key;
          let val = this.reqForm.headers[i].value;
          headersObj[key] = val;
        }
        this.componentForm.headers = JSON.stringify(headersObj);
      }
      // 如果前端有输入，存入对象数组，则将对象数组存入一个对象并转为string
      console.log("表单数据显示：", JSON.stringify(this.reqForm.params));
      if (this.reqForm.params[0].key != "") {
        let paramsObj = {};
        for (let i = 0; i < this.reqForm.params.length; i++) {
          var key = this.reqForm.params[i].key;
          var val = this.reqForm.params[i].value;
          paramsObj[key] = val;
          console.log("遍历表单数据key：", this.reqForm.params[i].key);
        }
        console.log("表单对象数组转对象后显示：：", JSON.stringify(paramsObj));
        if (this.componentForm.methods.includes("post")) {
          this.componentForm.body = JSON.stringify(paramsObj);
        } else if (this.componentForm.methods.includes("get")) {
          this.componentForm.params = JSON.stringify(paramsObj);
        }
      }
      // 调用新增组件接口
      addComponent(this.componentForm)
        .then(res => {
          console.log(res);
          // 2、通过编程式导航跳转到后台首页
          this.$router.push("/component");
        })
        .catch(err => {
          console.log("¥¥¥¥¥¥¥ 保存接口失败 ¥¥¥¥¥¥");
          return this.$message.error(err.message);
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
