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
      <el-breadcrumb-item>测试工具</el-breadcrumb-item>
      <el-breadcrumb-item>Http 接口测试</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card背景 -->
    <el-card class="box-card">
      <!-- 功能按钮 -->
      <el-row :gutter="10">
        <el-col :span="2.5">
          <el-button type="primary" @click="invoke()" size="medium">
            接口调用
          </el-button>
        </el-col>
      </el-row>

      <!-- 接口请求表单区域 -->
      <el-form
        :model="invokeHttpForm"
        :rules="invokeHttpRules"
        ref="invokeHttpRef"
        size="small"
        label-position="left"
      >
        <el-row :gutter="25">
          <!-- 域名 -->
          <el-col :span="7">
            <el-form-item label="域名：" prop="host" label-width="55px">
              <el-input v-model="invokeHttpForm.host"></el-input>
            </el-form-item>
          </el-col>
          <!-- 接口地址 -->
          <el-col :span="10">
            <el-form-item label="接口地址：" prop="apiUrl" label-width="85px">
              <el-input v-model="invokeHttpForm.apiUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="25">
          <!-- 超时时间下拉选择 -->
          <el-col :span="5">
            <el-form-item label="超时时间(s):" prop="timeOut" label-width="90px">
              <el-select v-model="invokeHttpForm.timeOut" placeholder="请选择">
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
            <el-form-item label="请求方法：" prop="methods" label-width="85px">
              <el-select
                v-model="invokeHttpForm.methods"
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

      <!-- 响应信息-->
      <el-tabs v-model="activeNameRes" type="border-card">
        <!-- 响应结果 -->
        <el-tab-pane label="响应结果" name="responseResult">
          <el-card class="box-card" style="margin-top:2px">
            <vue-json-pretty :path="'res'" :data="response.body" :deep="1" :showLength="true">
            </vue-json-pretty>
          </el-card>
        </el-tab-pane>
        <!-- 响应头 -->
        <el-tab-pane label="响应头" name="responseHeader">
          <el-card class="box-card" style="margin-top:2px">
            <vue-json-pretty :path="'res'" :data="response.headers" :deep="1" :showLength="true">
            </vue-json-pretty>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { invoke } from "../../network/testutil/testhttp.js";
export default {
  data() {
    return {
      invokeHttpRules: {},
      // 响应对象
      response: {
        headers: {},
        body: {},
        statutCode: ""
      },
      // 接口请求时提交的表单对象
      invokeHttpForm: {
        host: "beta-api.wanmen.org",
        apiUrl: "",
        timeOut: "3000",
        methods: "get",
        headers: "",
        params: "",
        body: ""
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
      activeNameRes: "responseResult",
      // 请求表单对应的请求对象数组
      reqForm: {
        headers: [{ key: "", value: "" }],
        params: [{ key: "", value: "" }]
      }
    };
  },
  methods: {
    // 调用测试接口
    invoke() {
      console.log("调用接口");

      // 如果前端有输入，存入对象数组，则将对象数组存入一个对象并转为string
      if (this.reqForm.headers[0].key != "") {
        let headersObj = {};
        for (let i = 0; i < this.reqForm.headers.length; i++) {
          let key = this.reqForm.headers[i].key;
          let val = this.reqForm.headers[i].value;
          headersObj[key] = val;
        }
        this.invokeHttpForm.headers = JSON.stringify(headersObj);
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
        if (this.invokeHttpForm.methods.includes("post")) {
          this.invokeHttpForm.body = JSON.stringify(paramsObj);
        } else if (this.invokeHttpForm.methods.includes("get")) {
          this.invokeHttpForm.params = JSON.stringify(paramsObj);
        }
        console.log("对象转请求字符串后显示：", this.invokeHttpForm.params);
      }
      // 调用测试api接口
      invoke(this.invokeHttpForm).then(res => {
        console.log("测试接口响应信息：" + res.data.data);
        this.response.headers = res.data.data.headers;
        this.response.body = res.data.data.body;
        this.response.statutCode = res.data.data.statusCode;
      });
    },
    // 开关关联tab的恶心方法
    activeChange(activeName) {
      console.log(activeName);
      if (activeName.includes("header") && this.isHeader) {
        console.log("header1");
        this.activeName = "header";
      } else if (activeName.includes("header")) {
        console.log("param2");
        this.activeName = "param";
      }
      if (activeName.includes("param") && this.isParams) {
        console.log("param1");
        this.activeName = "param";
      } else if (activeName.includes("param")) {
        console.log("header2");
        this.activeName = "header";
      }
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
