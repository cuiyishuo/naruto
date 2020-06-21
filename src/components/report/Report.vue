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
      <el-breadcrumb-item>测试报告</el-breadcrumb-item>
      <el-breadcrumb-item>接口测试报告</el-breadcrumb-item>
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
      <div v-for="(item, index) in reportTextArr" :key="index">
        <div v-if="item.color == 'red'">
          <span style="color:red">{{ item.text }}</span>
        </div>
        <div v-else-if="item.color == 'green'">
          <span style="color:green">{{ item.text }}</span>
        </div>
        <div v-else-if="item.color == 'grey'">
          <span style="color:grey">{{ item.text }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getLastReport,
  getCurrentReport,
  getLogs
} from "../../network/report/report.js";

export default {
  data() {
    return {
      reportTextArr: [],
      logObj: { buildId: "", lastTimeFileSize: null }
    };
  },
  created() {
    console.log("初始化页面数据", this.$route.path);
    let path = this.$route.path;
    // 如果url中没有buildId，则请求获取最后一构建任务
    if (path.endsWith("report")) {
      console.log("请求最后一次执行的任务");
      getLastReport().then(res => {
        console.log(res.data.data);
      });
    } else {
      // 如果不是以report结尾，证明是带着biuldid跳转过来的
      console.log("轮询请求当前执行任务");
      // 截取url获取id，并存入对象传入请求方法
      let buildId = path.split("/")[2];
      let buildObj = { buildId: buildId };
      this.logObj.buildId = buildId;
      // 轮询调用请求build的接口方法
      console.log("截取的buildId的：", buildId);
      this.t = setInterval(() => {
        this.getCurrentBuild(buildObj);
        this.getLogs(this.logObj);
      }, 2000);
    }
  },
  methods: {
    // 封装调用build接口方法，加入轮询判断停止的条件
    getCurrentBuild(buildObj) {
      getCurrentReport(buildObj).then(res => {
        let resData = res.data.data;
        console.log("当前状态：", resData.status, new Date());
        // 如果不是等待执行或执行中状态，则停止轮询
        if (
          !resData.status.includes("EXCUTING") &&
          !resData.status.includes("WAITFOREXCUTE")
        ) {
          console.log("构建结束啦！！！");
          clearInterval(this.t);
        }
      });
    },
    getLogs(logObj) {
      getLogs(logObj).then(res => {
        let resData = res.data.data;
        console.log("日志文本：", resData.text);
        console.log("日志上一次指针", resData.lastTimeFileSize);
        // 将上一次指针保存，用于下次请求
        this.logObj.lastTimeFileSize = resData.lastTimeFileSize;
        let textArray = resData.text.split("#End");
        textArray.pop();
        console.log("#End后：", textArray);
        textArray.forEach(text => {
          let reportTextObj = { text: "", color: "" };
          let arr = text.split("&");
          reportTextObj.text = arr[0];
          console.log(arr[0]);
          reportTextObj.color = arr[1];
          console.log(arr[1]);
          this.reportTextArr.push(reportTextObj);
          console.log("日志对象数组：", reportTextObj, this.reportTextArr);
        });
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
