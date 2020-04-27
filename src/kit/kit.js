// 将对象列表转换成json字符串
export function formateObjList(objList, jsonStr) {
  // 如果前端有输入，存入对象数组，则将对象数组存入一个对象并转为string
  if (objList.headers[0].key != "") {
    let headersObj = {};
    for (let i = 0; i < objList.headers.length; i++) {
      let key = objList.headers[i].key;
      let val = objList.headers[i].value;
      headersObj[key] = val;
    }
    jsonStr.headers = JSON.stringify(headersObj);
  } else {
    // 如果header为空，则传入空字符串
    jsonStr.headers = "";
  }
  // 如果前端有输入，存入对象数组，则将对象数组存入一个对象并转为string
  console.log("表单数据显示：", JSON.stringify(objList.params));
  if (objList.params[0].key != "") {
    let paramsObj = {};
    for (let i = 0; i < objList.params.length; i++) {
      var key = objList.params[i].key;
      var val = objList.params[i].value;
      paramsObj[key] = val;
      console.log("遍历表单数据key：", objList.params[i].key);
    }
    console.log("表单对象数组转对象后显示：：", JSON.stringify(paramsObj));
    if (jsonStr.methods.includes("post")) {
      jsonStr.body = JSON.stringify(paramsObj);
    } else if (jsonStr.methods.includes("get")) {
      jsonStr.params = JSON.stringify(paramsObj);
    }
  } else {
    // 如果参数为空，则传空字符串
    jsonStr.body = "";
    jsonStr.params = "";
  }
  return jsonStr;
}

// 将json字符串转换成对象列表
export function JSONStrToObjList(jsonStr) {
  let objList = [];
  // 转换header字符串变为object
  let Obj = JSON.parse(jsonStr);
  console.log("转换后的jsonObj：", Obj);
  // 将默认的信息头数组首行空数据删除
  objList.shift();
  // 遍历信息头对象，并将key，value分别push到数组下
  for (let i = 0; i < Object.keys(Obj).length; i++) {
    objList.push({
      value: Object.values(Obj)[i],
      key: Object.keys(Obj)[i]
    });
  }
  return objList;
}
