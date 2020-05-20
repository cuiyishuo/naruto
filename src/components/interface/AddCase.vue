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
      <el-breadcrumb-item>新增用例</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card背景 -->
    <el-card class="box-card">
      <!-- 功能按钮 -->
      <el-row :gutter="10" style="margin-bottom:30px" class="top-button">
        <el-col :span="2.5">
          <el-button type="primary" size="medium" @click="save()">
            保存
          </el-button>
          <el-button type="primary" size="medium" @click="invoke()">
            接口调用
          </el-button>
          <el-button type="primary" size="medium">
            执行用例
          </el-button>
          <router-link to="/component/caselist" style="margin-left:10px">
            <el-button type="info" size="medium">
              返回
            </el-button>
          </router-link>
          <!-- <el-button @click="t1()" style="margin-left:30px">test</el-button> -->
        </el-col>
      </el-row>

      <!-- 用例表单区域 -->
      <el-form
        :model="caseForm"
        :rules="caseRules"
        ref="caseRef"
        size="small"
        label-position="left"
        label-width="100px"
      >
        <el-row :gutter="25">
          <!-- 用例名称 -->
          <el-col :span="12">
            <el-form-item label="用例名称：" prop="caseName">
              <el-input v-model="caseForm.caseName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 用例级别 -->
        <el-row :gutter="25">
          <el-col :span="5">
            <el-form-item label="用例级别：" prop="caseLevel">
              <el-select v-model="caseForm.caseLevel" placeholder="请选择">
                <el-option
                  v-for="item in caseLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 断言类型 -->
          <el-col :span="6">
            <el-form-item label="断言类型：" prop="assertType">
              <el-select v-model="caseForm.assertType" placeholder="请选择">
                <el-option
                  v-for="item in assertTypeOptions"
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

        <!-- 信息头/入参表单 -->
        <el-form :model="reqForm" ref="reqRef" size="small">
          <el-tabs v-if="isHeader || isParams" v-model="activeName">
            <!-- 请求消息头表单 -->
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
                      @click="addReqInput('header')"
                    ></el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button
                      v-if="index > 0"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click.prevent="removeReqInput(header, 'header')"
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
                      @click="addReqInput('param')"
                    ></el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button
                      v-if="index > 0"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click.prevent="removeReqInput(param, 'param')"
                    ></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>

        <!-- 断言信息头/响应体验证区域 -->
        <el-form size="small">
          <el-collapse v-model="activeNames" style="margin-bottom:25px">
            <!-- 断言响应头 -->
            <el-collapse-item title="验证响应消息头:" name="1">
              <el-row :gutter="25" class="title">
                <el-col :span="6">
                  <el-tag v-if="caseForm.assertType == 'jsonPath'"
                    >匹配规则</el-tag
                  >
                </el-col>
                <el-col :span="6">
                  <el-tag>比较类型</el-tag>
                </el-col>
                <el-col :span="6">
                  <el-tag>期望结果</el-tag>
                </el-col>
              </el-row>
              <!-- 断言验证对象 -->
              <el-form-item
                v-for="(assertHeader, index) in caseForm.assertHeaderList"
                :key="index"
                :prop="'assertHeaderList.' + index + '.value'"
              >
                <el-row :gutter="25">
                  <el-col :span="6" v-if="caseForm.assertType == 'jsonPath'">
                    <el-input v-model="assertHeader.expression"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-input v-model="assertHeader.compareType"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-input v-model="assertHeader.expectValue"></el-input>
                  </el-col>
                  <el-col :span="1.2">
                    <el-button
                      type="success"
                      icon="el-icon-plus"
                      size="mini"
                      @click="addAssert('header')"
                    ></el-button>
                  </el-col>
                  <el-col :span="1.2">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="检查断言表达式"
                      placement="top"
                      :enterable="false"
                    >
                      <el-button
                        type="warning"
                        icon="el-icon-s-claim"
                        size="mini"
                        @click="checkExpression(index, 'header')"
                      ></el-button>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="1.2">
                    <el-button
                      v-if="index > 0"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click.prevent="removeAssert(assertHeader, 'header')"
                    ></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-collapse-item>
            <!-- 断言响应体 -->
            <el-collapse-item title="验证响应体:" name="2">
              <el-row :gutter="25" class="title">
                <el-col :span="6">
                  <el-tag v-if="caseForm.assertType == 'jsonPath'"
                    >匹配规则</el-tag
                  >
                </el-col>
                <el-col :span="6">
                  <el-tag>比较类型</el-tag>
                </el-col>
                <el-col :span="6">
                  <el-tag>期望结果</el-tag>
                </el-col>
              </el-row>
              <!-- 断言验证对象 -->
              <el-form-item
                v-for="(assertResbody, index) in caseForm.assertResbodyList"
                :key="index"
                :prop="'assertResbodyList.' + index + '.value'"
              >
                <el-row :gutter="25">
                  <el-col :span="6" v-if="caseForm.assertType == 'jsonPath'">
                    <el-input v-model="assertResbody.expression"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-input v-model="assertResbody.compareType"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-input v-model="assertResbody.expectValue"></el-input>
                  </el-col>
                  <el-col :span="1.2">
                    <el-button
                      type="success"
                      icon="el-icon-plus"
                      size="mini"
                      @click="addAssert('resbody')"
                    ></el-button>
                  </el-col>
                  <el-col :span="1.2">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="检查断言表达式"
                      placement="top"
                      :enterable="false"
                    >
                      <el-button
                        type="warning"
                        icon="el-icon-s-claim"
                        size="mini"
                        @click="checkExpression(index, 'resbody')"
                      ></el-button>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="1.2">
                    <el-button
                      v-if="index > 0"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click.prevent="removeAssert(assertResbody, 'resbody')"
                    ></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-form>

      <!-- 响应信息-->
      <el-tabs v-model="activeNameRes" type="border-card">
        <!-- 响应结果 -->
        <el-tab-pane label="响应结果" name="responseResult">
          <el-card class="box-card" style="margin-top:2px">
            <vue-json-pretty
              :path="'res'"
              :data="response.body"
              :deep="1"
              :showLength="true"
            >
            </vue-json-pretty>
          </el-card>
        </el-tab-pane>
        <!-- 响应头 -->
        <el-tab-pane label="响应头" name="responseHeader">
          <el-card class="box-card" style="margin-top:2px">
            <vue-json-pretty
              :path="'res'"
              :data="response.headers"
              :deep="1"
              :showLength="true"
            >
            </vue-json-pretty>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {
  addCase,
  checkExpression,
  updateCase
} from "../../network/interface/case.js";
import { getComponent } from "../../network/interface/component.js";
import { invoke } from "../../network/testutil/testhttp.js";
import { formateObjList, JSONStrToObjList } from "../../kit/kit.js";
export default {
  data() {
    return {
      caseRules: {
        caseName: [
          { required: true, message: "请输入用例名称", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ]
      },
      caseForm: {
        caseName: "",
        caseLevel: "middle",
        assertType: "jsonPath",
        // 断言对象
        assertHeaderList: [
          {
            expression: "", // jsonpath表达式
            expectValue: "", // 期望值
            compareType: "" //比较类型
          }
        ],
        // 断言响应对象
        assertResbodyList: [
          {
            expression: "", // jsonpath表达式
            expectValue: "", // 期望值
            compareType: "" //比较类型
          }
        ],
        HttpForm: { style: "" },
        interfaceId: ""
      },
      // 用例级别下拉选项
      caseLevelOptions: [
        {
          value: "low",
          label: "较低"
        },
        {
          value: "middle",
          label: "普通"
        },
        {
          value: "high",
          label: "较高"
        }
      ],
      // 断言类型下拉选项
      assertTypeOptions: [
        {
          value: "jsonPath",
          label: "JsonPath"
        },
        {
          value: "context",
          label: "全文匹配"
        }
      ],
      // 折叠组件默认激活
      activeNames: [],
      // 响应对象
      response: {
        headers: {},
        body: {},
        statutCode: ""
      },
      // 初始化页面时的接口信息
      componentForm: {
        host: "beta-api.wanmen.org",
        apiUrl: "",
        timeOut: "3000",
        methods: "get",
        headers: "",
        params: "",
        body: ""
      },
      // 响应结果tab默认激活
      activeNameRes: "responseResult",
      // 判断入参和头部开关是否开启
      isHeader: false,
      isParams: false,
      // 请求表单对应的请求对象数组
      reqForm: {
        headers: [{ key: "", value: "" }],
        params: [{ key: "", value: "" }]
      },
      // 默认tab激活状态的标签
      activeName: "",
      selectComponentData: {
        id: ""
      },
      pageParam: {
        pageNo: 1,
        pageSize: 10
      },
      // 测试表达式请求体
      assertExpression: {
        assertType: "",
        assert: {},
        resdata: []
      }
    };
  },
  created() {
    let interfaceId = this.$store.state.interfaceId;
    // 将所属接口的id赋值给case对象
    this.caseForm.interfaceId = interfaceId;
    // 如果是新建用例执行下面操作，从后端查询的数据，并渲染到页面（只查询httpentity）
    console.log("当前路径：", this.$route.path);
    if (this.$route.path == "/component/" + interfaceId + "/case") {
      console.log("进入初始化逻辑");
      this.selectComponentData.id = interfaceId;
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
          // 转换header字符串变为object
          let headerObj = JSON.parse(headerStr);
          console.log("转换后的headerObj：", headerObj);
          // 将默认的信息头数组首行空数据删除
          this.reqForm.headers.shift();
          // 遍历信息头对象，并将key，value分别push到数组下
          for (let i = 0; i < Object.keys(headerObj).length; i++) {
            this.reqForm.headers.push({
              value: Object.values(headerObj)[i],
              key: Object.keys(headerObj)[i]
            });
          }
          console.log("遍历后的headerArr：", this.reqForm.headers);
        }

        // 如果有参数则把参数信息渲染到页面
        let paramStr = componentRes.params + componentRes.body;
        if (paramStr != "") {
          this.isParams = true;
          this.activeName = "param";
          // 转换param字符串变为object
          let paramObj = JSON.parse(paramStr);
          console.log("转换后的paramObj：", paramObj);
          // 将默认的参数数组首行空数据删除
          this.reqForm.params.shift();
          // 遍历参数对象，并将key，value分别push到数组下
          for (let i = 0; i < Object.keys(paramObj).length; i++) {
            this.reqForm.params.push({
              value: Object.values(paramObj)[i],
              key: Object.keys(paramObj)[i]
            });
          }
          console.log("遍历后的paramArr：", this.reqForm.params);
        }
      });
    }
    // 否则视为编辑，查询caseentity，渲染到页面
    if (this.$route.path == "/component/" + interfaceId + "/editcase") {
      console.log("进入编辑页面");
      // 获取caseList中存入store的caseRow
      let caseRow = this.$store.state.caseRow;
      console.log("编辑前数据：", caseRow);
      // 赋值给页面数据做渲染
      this.caseForm = caseRow;
      this.componentForm = caseRow.HttpForm;
      // 如果有信息头则把信息头信息渲染到页面
      let headerStr = caseRow.HttpForm.headers;
      if (headerStr != "") {
        this.isHeader = true;
        this.activeName = "header";
        this.reqForm.headers = JSONStrToObjList(headerStr);
      }
      // 如果有参数则把参数信息渲染到页面
      let paramStr = caseRow.HttpForm.params + caseRow.HttpForm.body;
      if (paramStr != "") {
        this.isParams = true;
        this.activeName = "param";
        this.reqForm.params = JSONStrToObjList(paramStr);
      }
      // 如果断言信息头表达式不为空
      if (JSON.stringify(caseRow.assertHeaderList) != "[]") {
        this.activeNames.push("1");
      }
      // 如果断言响应体表达式不为空
      if (JSON.stringify(caseRow.assertResbodyList) != "[]") {
        this.activeNames.push("2");
      }
    }
  },
  methods: {
    t1() {
      // console.log("厨师换获得的接口信息：", this.componentForm, this.reqForm);
      // this.caseForm.HttpForm = formateObjList(this.reqForm, this.componentForm);
      // console.log(JSON.stringify(this.caseForm));
      // addCase(JSON.stringify(this.caseForm)).then(res => {
      //   console.log(res.data.data);
      // });
      console.log("厨师换获得的接口信息：", this.caseForm);
      console.log("厨师换获得的接口信息2：", this.reqForm);
    },
    // 保存用例
    save() {
      // 如果没有断言信息则返回空数组
      // if (this.caseForm.assertHeaderList[0].expression == "") {
      //   this.caseForm.assertHeaderList = "";
      // }
      // if (this.caseForm.assertResbodyList[0].expression == "") {
      //   this.caseForm.assertResbodyList = "";
      // }
      // 将初始化的httpentity 赋值到caseentity中
      this.caseForm.HttpForm = formateObjList(this.reqForm, this.componentForm);
      // 设置用例中生成httpentity风格为“case”
      this.caseForm.HttpForm.style = "case";
      // 判断是新增还是编辑
      if (this.$route.path.includes("editcase")) {
        console.log("编辑完后页面数据：", this.caseForm);
        // 调用编辑接口
        updateCase(JSON.stringify(this.caseForm)).then(res => {
          console.log(res.data.data);
          this.$router.push("/component/caselist");
        });
      } else {
        // 调用新增接口
        addCase(JSON.stringify(this.caseForm)).then(res => {
          console.log(res.data.data);
          this.$router.push("/component/caselist");
        });
      }
    },
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
        console.log("对象转请求字符串后显示：", this.componentForm.params);
      }
      // 调用测试api接口
      invoke(this.componentForm).then(res => {
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
    // 添加断言表达式
    addAssert(tab) {
      if (tab.includes("header")) {
        this.caseForm.assertHeaderList.push({
          expression: "",
          expectValue: "",
          compareType: ""
        });
      } else if (tab.includes("resbody")) {
        this.caseForm.assertResbodyList.push({
          expression: "",
          expectValue: "",
          compareType: ""
        });
      }
    },
    // 删除断言表达式 item：当前行序号，tab：(消息头/响应体)
    removeAssert(item, tab) {
      if (tab.includes("header")) {
        let index = this.caseForm.assertHeaderList.indexOf(item);
        if (index !== -1) {
          this.caseForm.assertHeaderList.splice(index, 1);
        }
      } else if (tab.includes("resbody")) {
        let index = this.caseForm.assertResbodyList.indexOf(item);
        if (index !== -1) {
          this.caseForm.assertResbodyList.splice(index, 1);
        }
      }
    },
    // 校验断言表达式
    checkExpression(index, tab) {
      console.log(index);
      console.log(this.caseForm.assertResbodyList[index]);
      this.assertExpression.assertType = this.caseForm.assertType;
      // this.assertExpression.resdata =
      console.log(this.response.headers, this.response.body);
      // 如果没有调用接口，先去调用接口
      if (
        JSON.stringify(this.response.headers) == "{}" ||
        JSON.stringify(this.response.body) == "{}"
      ) {
        return this.$message.error("请先执行接口调用");
      }
      // 否则判断是header还是body后赋值
      if (tab.includes("header")) {
        // 赋值断言表达式对象
        this.assertExpression.assert = this.caseForm.assertHeaderList[index];
        // 赋值响应头对象
        this.assertExpression.resdata = this.response.headers;
      } else if (tab.includes("resbody")) {
        // 赋值断言表达式对象
        this.assertExpression.assert = this.caseForm.assertResbodyList[index];
        // 赋值响应体
        this.assertExpression.resdata = this.response.body;
      }
      // 请求数据构造完毕，发送检查表达式的请求
      console.log("发送检查表达式的请求");
      checkExpression(this.assertExpression)
        .then(res => {
          let result = res.data.data;
          this.$alert(result, "表达式结果", {
            confirmButtonText: "确定",
            closeOnPressEscape: true,
            closeOnClickModal: true
          });
        })
        .catch(err => {
          return this.$message.error(err.message);
        });
    },
    // 添加请求数据
    addReqInput(tab) {
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
    // 删除请求数据 item：当前行序号，tab：(消息头/请求体)
    removeReqInput(item, tab) {
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
.el-row {
  margin-bottom: 15px;
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
