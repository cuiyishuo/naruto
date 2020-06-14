<template>
  <div>测试报告页2</div>
</template>

<script>
import {
  getLastReport,
  getCurrentReport
} from "../../network/report/report.js";

export default {
  data() {
    return {};
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
      // 轮询调用请求build的接口方法
      console.log("截取的buildId的：", buildId);
      this.t = setInterval(() => {
        this.getCurrentBuild(buildObj);
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
    }
  }
};
</script>

<style lang="less" scoped></style>
