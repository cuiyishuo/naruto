<template>
  <div>测试报告页2</div>
</template>

<script>
import { getLastReport } from "../../network/report/report.js";

export default {
  data() {
    return {};
  },
  created() {
    console.log("初始化页面数据");
    getLastReport().then(res => {
      console.log(res.data.data);
    });
  }
};
</script>

<style lang="less" scoped></style>
