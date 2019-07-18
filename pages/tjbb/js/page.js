var tbIndex = 0;
var rootMenuArr;
var rootMenuArr;
function GetPercent(num, total) {
  /// <summary>
  /// 求百分比
  /// </summary>
  /// <param name="num">当前数</param>
  /// <param name="total">总数</param>
  num = parseFloat(num);
  total = parseFloat(total);
  if (isNaN(num) || isNaN(total)) {
    return "-";
  }
  return total <= 0 ? "0%" : Math.round((num / total) * 10000) / 100.0 + "%";
}
var insertStr = (soure, start, newStr) => {
  return soure.slice(0, start) + newStr + soure.slice(start);
};
myControllers.controller("appController", function(
  $rootScope,
  $scope,
  services,
  $compile
) {
  $scope.leftMenus = [
    {
      short_name: "制作与质检总体统计",
      full_name: "电子卷宗制作与质检总体统计报表"
    },
    {
      short_name: "制作与质检总体情况",
      full_name: "电子卷宗制作与质检总体情况报表"
    },
    {
      short_name: "随案生成制作数量统计",
      full_name: "电子卷宗随案生成制作数量统计报表"
    },
    {
      short_name: "随案生成制作率统计",
      full_name: "电子卷宗随案生成制作率统计报表"
    },
    {
      short_name: "随案生成合格与不合格数量统计",
      full_name: "电子卷宗随案生成合格与不合格数量统计报表"
    },
    {
      short_name: "卷宗生成合格率统计",
      full_name: "电子卷宗生成合格率统计报表"
    },
    {
      short_name: "随案生成案件类型分布统计",
      full_name: "电子卷宗随案生成案件类型分布统计报表"
    },
    {
      short_name: "卷宗随案生成质量问题分布统计",
      full_name: "电子卷宗随案生成质量问题分布统计报表"
    },
    {
      short_name: "卷宗随案生成制作数量排行榜",
      full_name: "电子卷宗随案生成制作数量排行榜"
    },
    {
      short_name: "卷宗随案生成合格数量排行榜",
      full_name: "电子卷宗随案生成合格数量排行榜"
    },
    {
      short_name: "年度卷宗制作与质检总体趋势",
      full_name: "最近一年电子卷宗制作与质检总体趋势报表"
    }
  ];
  //time begain
  function uniq(array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i]);
      }
    }
    return temp;
  }
  //begin
  //获得上个月在昨天这一天的日期
  function getLastSixMonthYestdy(date) {
    var daysInMonth = new Array(
      [0],
      [31],
      [28],
      [31],
      [30],
      [31],
      [30],
      [31],
      [31],
      [30],
      [31],
      [30],
      [31]
    );
    var strYear = date.getFullYear();
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    var ystM = 6 - strMonth;
    if (strYear % 4 == 0 && strYear % 100 != 0) {
      daysInMonth[2] = 29;
    }
    if (strMonth < 7) {
      strYear -= 1;
      strMonth = 12 - ystM;
    } else {
      strMonth -= 6;
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
    if (strMonth < 10) {
      strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
      strDay = "0" + strDay;
    }
    datastr = strYear + "-" + strMonth + "-" + strDay;
    return datastr;
  }
  //获得上一年在昨天这一天的日期
  function getLastYearYestdy(date) {
    var strYear = date.getFullYear() - 1;
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    if (strMonth < 10) {
      strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
      strDay = "0" + strDay;
    }
    datastr = strYear + "-" + strMonth + "-" + strDay;
    return datastr;
  }
  //日期转时间戳
  function transdate(endTime) {
    var date = new Date();
    date.setFullYear(endTime.substring(0, 4));
    date.setMonth(endTime.substring(5, 7) - 1);
    date.setDate(endTime.substring(8, 10));
    date.setHours(endTime.substring(11, 13));
    date.setMinutes(endTime.substring(14, 16));
    date.setSeconds(endTime.substring(17, 19));
    return Date.parse(date) / 1000;
  }
  var staNum = new Date().dateFormat("Y-m-d") + " 00:00:12";
  staNum = transdate(staNum);
  var endNum = new Date().dateFormat("Y-m-d") + " 00:00:12";
  endNum = transdate(endNum);
  var todayNum = new Date().dateFormat("Y-m-d") + " 00:00:12";
  function getDateStr3(date) {
    var year = "";
    var month = "";
    var day = "";
    var now = date;
    year = "" + now.getFullYear();
    if (now.getMonth() + 1 < 10) {
      month = "0" + (now.getMonth() + 1);
    } else {
      month = "" + (now.getMonth() + 1);
    }
    if (now.getDate() < 10) {
      day = "0" + now.getDate();
    } else {
      day = "" + now.getDate();
    }
    return year + "-" + month + "-" + day;
  }
  /**
   * 获得相对当前周AddWeekCount个周的起止日期
   * AddWeekCount为0代表当前周   为-1代表上一个周   为1代表下一个周以此类推
   * **/

  function getWeekStartAndEnd(AddWeekCount) {
    //起止日期数组
    var startStop = new Array();
    //一天的毫秒数
    var millisecond = 1000 * 60 * 60 * 24;
    //获取当前时间
    var currentDate = new Date();
    //相对于当前日期AddWeekCount个周的日期
    currentDate = new Date(
      currentDate.getTime() + millisecond * 7 * AddWeekCount
    );
    //返回date是一周中的某一天
    var week = currentDate.getDay();
    //返回date是一个月中的某一天
    var month = currentDate.getDate();
    //减去的天数
    var minusDay = week != 0 ? week - 1 : 6;
    //获得当前周的第一天
    var currentWeekFirstDay = new Date(
      currentDate.getTime() - millisecond * minusDay
    );
    //获得当前周的最后一天
    var currentWeekLastDay = new Date(
      currentWeekFirstDay.getTime() + millisecond * 6
    );
    //添加至数组
    startStop.push(getDateStr3(currentWeekFirstDay));
    startStop.push(getDateStr3(currentWeekLastDay));

    return startStop;
  }
  var date = new Date();
  var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  var lastenddate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    day
  );
  function timeFormat(date) {
    if (!date || typeof date === "string") {
      this.error("参数异常，请检查...");
    }
    var y = date.getFullYear(); //年
    var m = date.getMonth() + 1; //月
    var d = date.getDate(); //日

    return y + "-" + m + "-" + d;
  }
  function showWeekFirstDay() {
    var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
    date.setDate(date.getDate() - weekday + 1); //往前算（weekday-1）天，年份、月份会自动变化
    return timeFormat(date);
  }
  //上周最后一天
  function getlastWeekLastDay() {
    return getWeekStartAndEnd(-1)[1];
  }
  //上周第一天
  function getlastWeekFirstDay() {
    return getWeekStartAndEnd(-1)[0];
  }

  //获取当月第一天
  function getCurrentMonthFirst() {
    var date = new Date();
    date.setDate(1);
    return date;
  }
  var curDate = new Date();
  // var laDateEnd = $rootScope.getDateStr(new Date(), "datetime");
  // var laDateStart = laDateEnd.substring(0, 10) + " 00:00:00";
  var laDateEnd = $rootScope
    .getDateStr(new Date(), "datetime")
    .substring(0, 10);
  var laDateStart = laDateEnd.substring(0, 10);
  var todayTime = $rootScope.getDateStr(curDate, "datetime").substring(0, 10); //今天
  var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //昨天
  var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000); //明天
  var thisWeekFirsrDay = showWeekFirstDay(); //本周第一天日期
  var lastWeekFirstDay = getlastWeekFirstDay(); //上周第一天
  var lastWeekLastDay = getlastWeekLastDay(); //上周最后一天
  var thisMonthFirsrDay = $rootScope
    .getDateStr(getCurrentMonthFirst(), "datetime")
    .substring(0, 10); //本月第一天
  var lastMonthFirsrDay = $rootScope
    .getDateStr(
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      "datetime"
    )
    .substring(0, 10); //上月第一天
  var lastMonthLastDay = $rootScope
    .getDateStr(lastenddate, "datetime")
    .substring(0, 10); //上月最后一天
  preDate = $rootScope.getDateStr(preDate, "datetime").substring(0, 10); //昨天
  nextDate = $rootScope.getDateStr(nextDate, "datetime").substring(0, 10); //昨天
  //end
  //从sessionStorage中获取用户的类型
  if (sessionStorage.rootUserInfo) {
    var rootUserInfostr = sessionStorage.rootUserInfo;
    rootUserInfo = JSON.parse(rootUserInfostr);
    rootMenuArr = rootUserInfo.roleMenus;
    var minNum;
    for (var i = 0; i < rootMenuArr.length; i++) {
      for (var j = i; j < rootMenuArr.length; j++) {
        if (rootMenuArr[i] > rootMenuArr[j]) {
          minNum = rootMenuArr[j];
          rootMenuArr[j] = rootMenuArr[i];
          rootMenuArr[i] = minNum;
        }
      }
    }
  } else {
    layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
    services._userlogic({ type: "logout" }).success(function(res) {
      if (window.top != window.self) {
        top.location.href = $rootScope.ctxPath + "login.html";
      }
    });
  }
  $scope.courtList = [];
  $scope.allAreaList = [];
  $scope.getAllCourtList = function() {
    services._getAllCourtList().success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        var lisdatas = res.data;
        var courtIdArr = [];
        for (let index = 0; index < lisdatas.length; index++) {
          const element = lisdatas[index];
          $scope.courtList = res.data;
          courtIdArr.push(element.courtId);
        }
        // $scope.param.courtIdStrings = courtIdArr.join("-");
      } else {
        layer.msg("未获取到相关法院列表 ", { offset: ["325px", "780px"] });
      }
    });
  };
  $scope.getAllAreaList = function() {
    services._getAllAreaList().success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        $scope.allAreaList = res.data;
        $scope.allAreaList.unshift({
          courtAreaName: "全部地区",
          courtId: ""
        });
        $scope.getTableJson($scope.param, "");
      } else {
        layer.msg("未获取到相关地区列表 ", { offset: ["325px", "780px"] });
      }
    });
  };
  $scope.getAllRoomsByCourtId = function(id) {
    var parmR = {
      courtId: id
    };
    services._getAllRoomListByCourtId(parmR).success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        $scope.allRoomsList = res.data;
        $scope.allRoomsList.unshift({
          courtRoomName: "全部庭室",
          courtRoomId: ""
        });
      } else {
        layer.msg("未获取到相关庭室列表 ", { offset: ["325px", "780px"] });
      }
    });
  };
  $scope.getCbrList = function(parmC) {
    services._getAllCbrList(parmC).success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        $scope.allCbrList = res.data;
        $scope.allCbrList.unshift({
          userFullName: "全部法官",
          cbrId: ""
        });
      } else {
        layer.msg("未获取到相关法官列表 ", { offset: ["325px", "780px"] });
      }
    });
  };
  $scope.getAllCourtList();
  $scope.getAllAreaList();
  //书讯快递循环垂直向上滚动
  if (rootMenuArr[0] == 1) {
    $scope.param = {
      courtIdStrings: "",
      courtRoomIdStrings: "",
      cbrIdStrings: "",
      queryFlag: "",
      indexFlag: "",
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime
    };
    $scope.suianParam = {
      courtId: "",
      courtRoomId: "",
      cbrId: "",
      flag: false,
      laDateStart: $scope.param.laDateStart,
      laDateEnd: $scope.param.laDateEnd
    };
    $scope.trendParam = {
      courtId: "",
      courtRoomId: "",
      cbrId: "",
      flag: false
    };
  } else if (rootMenuArr[0] == 2) {
    $scope.param = {
      courtIdStrings: rootUserInfo.courtId,
      courtRoomIdStrings: "",
      cbrIdStrings: "",
      queryFlag: 1,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime
    };
    $scope.suianParam = {
      courtId: rootUserInfo.courtId,
      courtRoomId: "",
      cbrId: "",
      flag: true,
      laDateStart: $scope.param.laDateStart,
      laDateEnd: $scope.param.laDateEnd
    };
    $scope.trendParam = {
      courtId: rootUserInfo.courtId,
      courtRoomId: "",
      cbrId: "",
      flag: true
    };
    $scope.courtList = [rootUserInfo.courtName];
    $scope.getAllRoomsByCourtId(rootUserInfo.courtId);
    $(".select_box_area").hide();
  } else if (rootMenuArr[0] == 3) {
    $scope.param = {
      courtIdStrings: rootUserInfo.courtId,
      courtRoomIdStrings: rootUserInfo.courtRoomId,
      cbrIdStrings: "",
      queryFlag: 2,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime
    };
    $scope.suianParam = {
      courtId: rootUserInfo.courtId,
      courtRoomId: rootUserInfo.courtRoomId,
      cbrId: "",
      flag: true,
      laDateStart: $scope.param.laDateStart,
      laDateEnd: $scope.param.laDateEnd
    };
    $scope.trendParam = {
      courtId: rootUserInfo.courtId,
      courtRoomId: rootUserInfo.courtRoomId,
      cbrId: "",
      flag: true
    };
    $scope.courtList = [rootUserInfo.courtName];
    $scope.courtList = [rootUserInfo.courtRoomName];
    var parmCbr = {
      courtId: rootUserInfo.courtId,
      courtRoomId: rootUserInfo.courtRoomId
    };
    $scope.getCbrList(parmCbr);
    $(".select_box_area").hide();
  } else if (rootMenuArr[0] == 4) {
    $scope.param = {
      courtIdStrings: rootUserInfo.courtId,
      courtRoomIdStrings: rootUserInfo.courtRoomId,
      cbrIdStrings: rootUserInfo.userCode,
      queryFlag: 2,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime
    };
    $scope.suianParam = {
      courtId: rootUserInfo.courtId,
      courtRoomId: rootUserInfo.courtRoomId,
      cbrId: rootUserInfo.userCode,
      flag: true,
      laDateStart: $scope.param.laDateStart,
      laDateEnd: $scope.param.laDateEnd
    };
    $scope.trendParam = {
      courtId: rootUserInfo.courtId,
      courtRoomId: rootUserInfo.courtRoomId,
      cbrId: rootUserInfo.userCode,
      flag: true
    };
    $scope.courtList = [rootUserInfo.courtName];
    $scope.courtList = [rootUserInfo.courtRoomName];
    $scope.courtList = [rootUserInfo.userFullName];
    $(".select_box_area").hide();
  } else {
    layer.msg("没有查看权限", { offset: ["325px", "780px"] });
    return;
  }

  $scope.bottimeScope =
    $scope.param.laDateStart + " 至 " + $scope.param.laDateEnd;
  $scope.timeScope = $scope.param.laDateStart + " 至 " + $scope.param.laDateEnd;
  $scope.selectTime = function($event) {
    $scope.timeScope = $event.target.innerHTML;
    if ($scope.timeScope == "本月") {
      $scope.param.laDateStart = thisMonthFirsrDay;
      $scope.param.laDateEnd = todayTime;
      $scope.suianParam.laDateStart = thisMonthFirsrDay;
      $scope.suianParam.laDateEnd = todayTime;
    } else if ($scope.timeScope == "上月") {
      $scope.param.laDateStart = lastMonthFirsrDay;
      $scope.param.laDateEnd = lastMonthLastDay;
      $scope.suianParam.laDateStart = lastMonthFirsrDay;
      $scope.suianParam.laDateEnd = lastMonthLastDay;
    } else if ($scope.timeScope == "本周") {
      $scope.param.laDateStart = thisWeekFirsrDay;
      $scope.param.laDateEnd = todayTime;
      $scope.suianParam.laDateStart = thisWeekFirsrDay;
      $scope.suianParam.laDateEnd = todayTime;
    } else if ($scope.timeScope == "上周") {
      $scope.param.laDateStart = lastWeekFirstDay;
      $scope.param.laDateEnd = lastWeekLastDay;
      $scope.suianParam.laDateStart = lastWeekFirstDay;
      $scope.suianParam.laDateEnd = lastWeekLastDay;
    } else if ($scope.timeScope == "今天") {
      $scope.param.laDateStart = todayTime;
      $scope.param.laDateEnd = nextDate;
      $scope.suianParam.laDateStart = todayTime;
      $scope.suianParam.laDateEnd = nextDate;
    } else if ($scope.timeScope == "昨天") {
      $scope.param.laDateStart = preDate;
      $scope.param.laDateEnd = todayTime;
      $scope.suianParam.laDateStart = preDate;
      $scope.suianParam.laDateEnd = todayTime;
    } else if ($scope.timeScope == "近半年") {
      $scope.param.laDateStart = getLastSixMonthYestdy(new Date());
      $scope.param.laDateEnd = todayTime;
      $scope.suianParam.laDateStart = getLastSixMonthYestdy(new Date());
      $scope.suianParam.laDateEnd = todayTime;
    } else if ($scope.timeScope == "近一年") {
      $scope.param.laDateStart = getLastYearYestdy(new Date());
      $scope.param.laDateEnd = todayTime;
      $scope.suianParam.laDateStart = getLastYearYestdy(new Date());
      $scope.suianParam.laDateEnd = todayTime;
    }
    // $scope.search();
  };
  $scope.timeZidingyi = function() {
    $scope.layerfunTree1 = layer.open({
      type: 1,
      title: "自定义时间",
      area: ["700px", "75px"],
      skin: "layui-layer-rim",
      offset: ["150px", "580px"],
      content: $("#timeForm"),
      scrollbar: false
    });
  };
  $("#startTime").datetimepicker({
    timepicker: false,
    value: "2019-06-05",
    format: "y-m-d",
    startDate: new Date(),
    maxDate: new Date(),
    onSelectDate: function(dateText, inst) {
      $scope.param.laDateStart = $rootScope
        .getDateStr(dateText, "datetime")
        .substring(0, 10);
      staNum = dateText.dateFormat("Y-m-d");
      staNum = transdate(staNum);
      if (staNum > endNum) {
        layer.msg("开始时间不能大于结束时间", { offset: ["325px", "780px"] });
        return;
      }
      // $("#startTime").val(
      //   $("#startTime")
      //     .val()
      //     .substring(0, 10)
      // );
      // $("#endTime").val(
      //   $("#endTime")
      //     .val()
      //     .substring(0, 10)
      // );
    },
    onShow: function(dateText, inst) {
      // $("#startTime").val(
      //   $("#startTime")
      //     .val()
      //     .substring(0, 10)
      // );
      // $("#endTime").val(
      //   $("#endTime")
      //     .val()
      //     .substring(0, 10)
      // );
    }
  });
  $("#endTime").datetimepicker({
    timepicker: false,
    value: "2019-06-05",
    format: "y-m-d",
    startDate: new Date(),
    // maxDate: new Date(),
    onSelectDate: function(dateText, inst) {
      $scope.param.laDateEnd = $rootScope
        .getDateStr(dateText, "datetime")
        .substring(0, 10);
      endNum = dateText.dateFormat("Y-m-d");
      endNum = transdate(endNum);
      if (endNum < staNum) {
        layer.msg("结束时间不能小于开始时间", { offset: ["325px", "780px"] });
      }
      // $("#startTime").val(
      //   $("#startTime")
      //     .val()
      //     .substring(0, 10)
      // );
      // $("#endTime").val(
      //   $("#endTime")
      //     .val()
      //     .substring(0, 10)
      // );
    },
    onShow: function(dateText, inst) {
      // $("#startTime").val(
      //   $("#startTime")
      //     .val()
      //     .substring(0, 10)
      // );
      // $("#endTime").val(
      //   $("#endTime")
      //     .val()
      //     .substring(0, 10)
      // );
    }
  });

  if (rootMenuArr[0] == 1) {
    $scope.namesList = {
      areaName: "",
      courtName: "",
      roomName: "",
      cbrName: ""
    };
  } else if (rootMenuArr[0] == 2) {
    $scope.namesList = {
      areaName: "",
      courtName: rootUserInfo.courtName,
      roomName: "",
      cbrName: ""
    };
  } else if (rootMenuArr[0] == 3) {
    $scope.namesList = {
      areaName: "",
      courtName: rootUserInfo.courtName,
      roomName: rootUserInfo.courtRoomName,
      cbrName: ""
    };
  } else if (rootMenuArr[0] == 4) {
    $scope.namesList = {
      areaName: "",
      courtName: rootUserInfo.courtName,
      roomName: rootUserInfo.courtRoomName,
      cbrName: rootUserInfo.userFullName
    };
  }
  $scope.saveTimeScope = function() {
    if (endNum < staNum) {
      layer.msg("开始时间不能大于结束时间", { offset: ["325px", "780px"] });
      return;
    } else {
      $scope.param.laDateStart = $scope.param.laDateStart.substring(0, 10);
      $scope.param.laDateEnd = $scope.param.laDateEnd.substring(0, 10);
      $scope.suianParam.laDateStart = $scope.param.laDateStart.substring(0, 10);
      $scope.suianParam.laDateEnd = $scope.param.laDateEnd.substring(0, 10);
      // $scope.A();
      $scope.timeScope =
        $scope.param.laDateStart + " 至 " + $scope.param.laDateEnd;
      layer.closeAll();
    }
  };

  $("#co_input").click(function() {
    if ($scope.param.courtIdStrings == "") {
      layer.msg("请先选择所属地区", { offset: ["325px", "780px"] });
    }
  });
  $("#tz_input").click(function() {
    if ($scope.param.courtIdStrings == "") {
      layer.msg("请先选择所属法院", { offset: ["325px", "780px"] });
    }
  });
  $("#cbr_name").click(function() {
    if (
      $scope.param.courtRoomIdStrings == "" ||
      $scope.namesList.roomName == "全部庭室" ||
      $("#tz_input").val() == "全部庭室"
    ) {
      layer.msg("请先选择所属庭室", { offset: ["325px", "780px"] });
    }
  });
  $scope.selectItemClick = function(item) {
    $(".selectInput").val(item.courtName);
    $scope.param.courtIdStrings = item.courtId;

    $scope.namesList.roomName = "全部庭室";
    $scope.param.courtRoomIdStrings = "";
    $scope.param.cbrIdStrings = "";
    $("#tz_input").val($scope.namesList.roomName);
    $("#cbr_name").val("全部法官");
    if (item.courtName != "全部法院") {
      $scope.getAllRoomsByCourtId(item.courtId);
      $scope.param.queryFlag = 1;
    } else {
      $scope.param.queryFlag = 0;
      // $scope.param.courtIdStrings = "";
      $scope.param.courtRoomIdStrings = "";
      $scope.param.cbrIdStrings = "";
      $scope.allRoomsList = [
        // {
        //   courtRoomName: "全部庭室",
        //   courtRoomId: ""
        // }
      ];
      $scope.allCbrList = [
        // {
        //   userFullName: "全部法官",
        //   cbrId: ""
        // }
      ];
    }
    $scope.param.courtRoomIdStrings = "";
    $scope.suianParam.flag = true;
    $scope.suianParam.courtId = item.courtId;
    $scope.suianParam.courtRoomId = "";
    $scope.suianParam.cbrId = "";
    $scope.trendParam.flag = true;
    $scope.trendParam.courtId = item.courtId;
    $scope.trendParam.courtRoomId = "";
    $scope.trendParam.cbrId = "";
    // $scope.search();
    $("#courtList").hide();
  };

  $scope.selArea = function(item) {
    if (item.courtAreaName == "全部地区") {
      $scope.param.queryFlag = "";
      $scope.param.courtIdStrings = "";
      $scope.param.courtRoomIdStrings = "";
      $scope.param.cbrIdStrings = "";
      $scope.allRoomsList = [];
      $scope.allCbrList = [];
      $scope.allcourtsArr = [];
      $scope.namesList.courtName = "全部法院";
      $scope.namesList.areaName = item.courtAreaName;
      $scope.suianParam.courtId = "";
      $scope.suianParam.courtRoomId = "";
      $scope.suianParam.cbrId = "";
      $scope.trendParam.flag = false;
      $scope.trendParam.courtId = "";
      $scope.trendParam.courtRoomId = "";
      $scope.trendParam.cbrId = "";
      $("#co_input").val($scope.namesList.courtName);
      $("#tz_input").val("全部庭室");
      $("#cbr_name").val("全部法官");
    } else {
      $scope.param.queryFlag = 0;

      $scope.namesList.courtName = "全部法院";
      $scope.namesList.areaName = item.courtAreaName;
      $("#co_input").val($scope.namesList.courtName);
      $("#tz_input").val("全部庭室");
      $("#cbr_name").val("全部法官");

      $scope.param.courtIdStrings = "";
      $scope.param.courtRoomIdStrings = "";
      $scope.param.cbrIdStrings = "";
      $scope.suianParam.flag = false;
      $scope.suianParam.courtId = item.courtId;
      $scope.suianParam.courtRoomId = "";
      $scope.suianParam.cbrId = "";
      $scope.trendParam.flag = false;
      $scope.trendParam.courtId = "";
      $scope.trendParam.courtRoomId = "";
      $scope.trendParam.cbrId = "";
      services
        ._getAllCourtListJson({ courtId: item.courtId })
        .success(function(res) {
          if (res.code == 0) {
            $scope.allcourtsArr = [];
            $scope.allcourtsArr.push(res.data);
            var childrenARR = [];
            var courts = [];
            childrenARR = res.data.children;
            if (childrenARR.length > 0) {
              $scope.allcourtsArr = $scope.allcourtsArr.concat(childrenARR);
            }
            for (let index = 0; index < $scope.allcourtsArr.length; index++) {
              const element = $scope.allcourtsArr[index];
              courts.push(element.courtId);
            }
            $scope.allcourtsArr.unshift({
              courtName: "全部法院",
              courtId: courts.join("-")
            });
            $scope.param.courtIdStrings = courts.join("-");
            // $scope.search();
          } else {
            layer.msg("未获取到相关法院列表 ", { offset: ["325px", "780px"] });
          }
        });
    }
  };
  $scope.selCourt = function(item) {
    $scope.namesList.courtName = item.courtName;
    $scope.param.courtIdStrings = item.courtId;
    $scope.namesList.roomName = "全部庭室";
    $("#tz_input").val($scope.namesList.roomName);
    $scope.param.courtRoomIdStrings = "";
    $scope.suianParam.flag = true;
    $scope.suianParam.courtId = item.courtId;
    $scope.suianParam.courtRoomId = "";
    $scope.suianParam.cbrId = "";
    $scope.trendParam.flag = true;
    $scope.trendParam.courtId = item.courtId;
    $scope.trendParam.courtRoomId = "";
    $scope.trendParam.cbrId = "";
  };
  $scope.selRoom = function(item) {
    $scope.namesList.roomName = item.courtRoomName;
    $scope.param.courtRoomIdStrings = item.courtRoomId;
    $scope.namesList.cbrName = "全部法官";
    $("#cbr_name").val($scope.namesList.cbrName);
    $scope.param.cbrIdStrings = "";

    $scope.param.courtRoomIdStrings = item.courtRoomId;
    $scope.suianParam.flag = true;
    $scope.suianParam.courtRoomId = item.courtRoomId;
    $scope.suianParam.cbrId = "";
    $scope.trendParam.flag = true;
    $scope.trendParam.courtRoomId = item.courtRoomId;
    $scope.trendParam.cbrId = "";
    var paramC = {
      courtId: $scope.param.courtIdStrings,
      courtRoomId: $scope.param.courtRoomIdStrings
    };
    if (item.courtRoomName != "全部庭室") {
      $scope.getCbrList(paramC);
      $scope.param.queryFlag = 2;
    } else {
      $scope.param.queryFlag = 1;
      $scope.param.courtRoomIdStrings = "";
      $scope.param.cbrIdStrings = "";
      $scope.allCbrList = [
        {
          // userFullName: "全部法官",
          // cbrId: ""
        }
      ];
    }
    // $scope.search();
  };
  $scope.selCbr = function(item) {
    if (item.userFullName == "全部法官") {
      $scope.namesList.cbrName = item.userFullName;
      $scope.param.cbrIdStrings = "";

      $scope.suianParam.flag = true;
      $scope.suianParam.cbrId = "";
      $scope.trendParam.flag = true;
      $scope.trendParam.cbrId = "";
    } else {
      $scope.namesList.cbrName = item.userFullName;
      $scope.param.cbrIdStrings = item.userCode;
      $scope.suianParam.flag = true;
      $scope.suianParam.cbrId = item.userCode;
      $scope.trendParam.flag = true;
      $scope.trendParam.cbrId = item.userCode;
    }

    // $scope.search();
  };
  $scope.search = function() {
    $scope.getTableJson($scope.param, tbIndex);
  };
  //模糊搜索
  initSearchInput();
  function fuzzySearch(e) {
    var that = this;
    //获取列表的ID
    var listId = $(this).attr("list");

    //列表
    var list = $("#" + listId + " div");
    //列表项数组  包列表项的id、内容、元素
    var listArr = [];
    //遍历列表，将列表信息存入listArr中
    $.each(list, function(index, item) {
      var obj = {
        eleId: item.getAttribute("id"),
        eleName: item.innerHTML,
        ele: item
      };
      listArr.push(obj);
    });

    //current用来记录当前元素的索引值
    var current = 0;
    //showList为列表中和所输入的字符串匹配的项
    var showList = [];
    //为文本框绑定键盘引起事件
    $(this).keyup(function(e) {
      //如果输入空格自动删除
      this.value = this.value.replace(" ", "");
      //列表框显示
      $("#" + listId).show();
      if (e.keyCode == 38) {
        current--;
        if (current <= 0) {
          current = 0;
        }
      } else if (e.keyCode == 40) {
        current++;
        if (current >= showList.length) {
          current = showList.length - 1;
        }
      } else if (e.keyCode == 13) {
        //如果按下回车，将此列表项的内容填充到文本框中
        $(that).val(showList[current].innerHTML);
        //下拉框隐藏
        $("#" + listId).hide();
      } else {
        //文本框中输入的字符串
        var searchVal = $(that).val();
        showList = [];
        //将和所输入的字符串匹配的项存入showList
        //将匹配项显示，不匹配项隐藏
        $.each(listArr, function(index, item) {
          if (item.eleName.indexOf(searchVal) != -1) {
            item.ele.style.display = "block";
            showList.push(item.ele);
          } else {
            item.ele.style.display = "none";
          }
        });
        current = 0;
      }
      //设置当前项的背景色及位置
      $.each(showList, function(index, item) {
        if (index == current) {
          item.style.background = "#00273f";
          $("#" + listId).scrollTop(item.offsetTop);
        } else {
          item.style.background = "";
        }
      });
      //设置下拉框的高度
      //212为列表框的最大高度
      if (
        212 >
        $("#" + listId + " div")
          .eq(0)
          .height() *
          showList.length
      ) {
        $("#" + listId).height(
          $("#" + listId + " div")
            .eq(0)
            .height() * showList.length
        );
      } else {
        $("#" + listId).height(212);
      }
    });
  }

  $("#fayuan_input_case").on("focus", function() {
    fuzzySearch.call(this);
    $("#courtList").show();
  });
  function initSearchInput() {
    //给下拉箭头绑定点击事件  点击下拉箭头显示/隐藏对应的列表
    //输入框的类名为selectInput
    //下拉箭头的类名为picture_click、dropDowns
    //下拉列表的类名为selectList
    for (var i = 0; i < $(".picture_click").length; i++) {
      $(".picture_click")
        .eq(i)
        .click(function() {
          $(this)
            .parent()
            .find(".selectList")
            .toggle();
        });
    }

    //为列表中的每一项绑定鼠标经过事件
    $(".selectList div").mouseenter(function() {
      $(this)
        .css("background", "#00273f")
        .siblings()
        .css("background", "");
    });
    //为列表中的每一项绑定单击事件
    $(".selectList div").click(function() {
      //文本框为选中项的值
      $(".selectInput").val($(this).html());
      //下拉框隐藏
      $(this)
        .parent()
        .hide();
    });

    //点击下拉框外部的时候使下拉框隐藏
    var dropDowns = document.getElementsByClassName("dropDowns");
    var selectList = document.getElementsByClassName("selectList");
    document.body.onclick = function(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;
      for (var i = 0; i < dropDowns.length; i++) {
        if (target != dropDowns[i] && target != selectList[i]) {
          selectList[i].style.display = "none";
        }
      }
    };
  }
  //模糊搜索end
  //old code
  $scope.active = 0;
  $scope.table_t_title = $scope.leftMenus[0].full_name;
  $scope.leftMenu_click = function(i) {
    $scope.active = i;
    tbIndex = i;
    $scope.table_t_title = $scope.leftMenus[i].full_name;
    $scope.getTableJson($scope.param, i);
  };
  $scope.court_obj = {};
  $scope.parmTimeList = ["今天", "昨天", "本周", "上周", "本月", "上月"];
  $scope._selTime = function(item, e) {
    $scope.param.paramsTime = item;
  };
  $scope._clearParmTime = function() {
    $scope.param.paramsTime = "";
  };
  $scope._clearCourts = function() {
    $scope.param.courts_name = [];
  };
  //打印
  $scope.printExcle = function() {
    $("#yichuli-table").datagrid("print", "");
    // bdhtml=window.document.body.innerHTML;
    // sprnstr="<!--startprint-->";
    // eprnstr="<!--endprint-->";
    // prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
    // prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
    // window.document.body.innerHTML=prnhtml;
    // window.print();
    // setTimeout(function(){
    //   window.location.reload();
    // },200)
  };
  //导出
  $scope.exportExcle = function() {
    $("#yichuli-table").datagrid("resize");
    setTimeout(function() {
      $("#yichuli-table").datagrid("toExcel", "");
    }, 500);
  };

  $scope.getTableJson = function(param, index) {
    if (index == 0) {
      $(".shijian-select").show();
      services._getAllIndexDatas(param).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          $scope.create_table_flag = true;
          $scope.create_echarts_flag0 = false;
          $scope.create_echarts_flag1 = false;
          $scope.create_echarts_flag2 = false;
          $scope.create_echarts_flag3 = false;
          $scope.create_echarts_flag4 = false;
          $scope.create_echarts_flag5 = false;
          $scope.create_echarts_flag6 = false;
          $scope.create_echarts_flag7 = false;
          $scope.create_echarts_flag8 = false;
          $scope.create_echarts_flag9 = false;
          $scope.create_echarts_flag10 = false;
          var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          $scope.tableJson.splice(dataI, 1);
          setTimeout(function() {
            $scope.initTable0($scope.tableJson);
          }, 1000);
          var datagrid0 = [];
          for (var index = 0; index < res.data.length; index++) {
            var element = res.data[index];
            // if (rootMenuArr[0] == 1||$scope.param.queryFlag == 0) {
            //   datagrid0[index] = {
            //     city: element.courtName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     合格数量: element.passCaseCount
            //   };
            // }  else if (rootMenuArr[0] == 2||$scope.param.queryFlag == 1) {
            //   datagrid0[index] = {
            //     city: element.courtRoomName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     合格数量: element.passCaseCount
            //   };
            // } else if (rootMenuArr[0] == 3||$scope.param.queryFlag == 2) {
            //   datagrid0[index] = {
            //     city: element.cbrName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     合格数量: element.passCaseCount
            //   };
            // } else if (rootMenuArr[0] == 4) {
            //   // datagrid0[index] = {
            //   //   city: element.courtRoomName,
            //   //   总案件量: element.caseCount,
            //   //   上传案件数量: element.uploadCaseCount,
            //   //   合格数量: element.passCaseCount
            //   // };
            // }
            if ($scope.param.queryFlag == "") {
              datagrid0[index] = {
                city: element.courtName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if (
              $scope.param.queryFlag == 0 &&
              $scope.param.queryFlag != ""
            ) {
              datagrid0[index] = {
                city: element.courtName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if ($scope.param.queryFlag == 1) {
              datagrid0[index] = {
                city: element.courtRoomName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if ($scope.param.queryFlag == 2) {
              datagrid0[index] = {
                city: element.cbrName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if (rootMenuArr[0] == 4) {
              // datagrid0[index] = {
              //   city: element.courtRoomName,
              //   总案件量: element.caseCount,
              //   上传案件数量: element.uploadCaseCount,
              //   合格数量: element.passCaseCount
              // };
            }
          }
          drawTjbbChart0(datagrid0);
          // $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
          $scope.tableJson = [];
          $scope.initTable0($scope.tableJson);
        }
      });
    } else if (index == 1) {
      $(".shijian-select").show();
      $scope.create_table_flag = true;
      $scope.create_echarts_flag0 = false;
      $scope.create_echarts_flag1 = false;
      $scope.create_echarts_flag2 = false;
      $scope.create_echarts_flag3 = false;
      $scope.create_echarts_flag4 = false;
      $scope.create_echarts_flag5 = false;
      $scope.create_echarts_flag6 = false;
      $scope.create_echarts_flag7 = false;
      $scope.create_echarts_flag8 = false;
      $scope.create_echarts_flag9 = false;
      $scope.create_echarts_flag10 = false;
      services._getAllIndexDatas(param).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          $scope.tableJson.splice(dataI, 1);
          $scope.initTable1($scope.tableJson);
          var datagrid1 = [];
          for (var index = 0; index < res.data.length; index++) {
            var element = res.data[index];
            // if (rootMenuArr[0] == 1||$scope.param.queryFlag == 0) {
            //   datagrid1[index] = {
            //     city: element.courtName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     随案生成批次: element.uploadIndex,
            //     扫描上传页数: element.totalFileNum
            //   };
            // } else if (rootMenuArr[0] == 2 ||$scope.param.queryFlag == 1) {
            //   datagrid1[index] = {
            //     city: element.courtRoomName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     随案生成批次: element.uploadIndex,
            //     扫描上传页数: element.totalFileNum
            //   };
            // } else if (rootMenuArr[0] == 3||$scope.param.queryFlag == 2) {
            //   datagrid1[index] = {
            //     city: element.courtName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     随案生成批次: element.uploadIndex,
            //     扫描上传页数: element.totalFileNum
            //   };
            // } else if (rootMenuArr[0] == 4) {
            //   // datagrid1[index] = {
            //   //   city: element.courtName,
            //   //   总案件量: element.caseCount,
            //   //   上传案件数量: element.uploadCaseCount,
            //   //   随案生成批次: element.uploadIndex,
            //   //   扫描上传页数: element.totalFileNum
            //   // };
            // }
            if ($scope.param.queryFlag == "") {
              datagrid1[index] = {
                city: element.courtName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                随案生成批次: element.uploadIndex,
                扫描上传页数: element.totalFileNum
              };
            } else if (
              $scope.param.queryFlag == 0 &&
              $scope.param.queryFlag != ""
            ) {
              datagrid1[index] = {
                city: element.courtName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                随案生成批次: element.uploadIndex,
                扫描上传页数: element.totalFileNum
              };
            } else if ($scope.param.queryFlag == 1) {
              datagrid1[index] = {
                city: element.courtRoomName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                随案生成批次: element.uploadIndex,
                扫描上传页数: element.totalFileNum
              };
            } else if ($scope.param.queryFlag == 2) {
              datagrid1[index] = {
                city: element.cbrName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                随案生成批次: element.uploadIndex,
                扫描上传页数: element.totalFileNum
              };
            } else if (rootMenuArr[0] == 4) {
              // datagrid0[index] = {
              //   city: element.courtRoomName,
              //   总案件量: element.caseCount,
              //   上传案件数量: element.uploadCaseCount,
              //   合格数量: element.passCaseCount
              // };
            }
          }
          drawTjbbChart1(datagrid1);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
          $scope.tableJson = [];
          $scope.initTable1($scope.tableJson);
        }
      });
    } else if (index == 2) {
      $(".shijian-select").show();
      services._getAllIndexDatas(param).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          $scope.create_table_flag = true;
          $scope.create_echarts_flag0 = false;
          $scope.create_echarts_flag1 = false;
          $scope.create_echarts_flag2 = false;
          $scope.create_echarts_flag3 = false;
          $scope.create_echarts_flag4 = false;
          $scope.create_echarts_flag5 = false;
          $scope.create_echarts_flag6 = false;
          $scope.create_echarts_flag7 = false;
          $scope.create_echarts_flag8 = false;
          $scope.create_echarts_flag9 = false;
          $scope.create_echarts_flag10 = false;
          var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          $scope.tableJson.splice(dataI, 1);
          $scope.initTable2($scope.tableJson);
          var datagrid2 = [];
          for (var index = 0; index < res.data.length; index++) {
            var element = res.data[index];
            if ($scope.param.queryFlag == "") {
              datagrid2[index] = {
                city: element.courtName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if (
              $scope.param.queryFlag == 0 &&
              $scope.param.queryFlag != ""
            ) {
              datagrid2[index] = {
                city: element.courtName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if ($scope.param.queryFlag == 1) {
              datagrid2[index] = {
                city: element.courtRoomName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if ($scope.param.queryFlag == 2) {
              datagrid2[index] = {
                city: element.cbrName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if (rootMenuArr[0] == 4) {
              // datagrid0[index] = {
              //   city: element.courtRoomName,
              //   总案件量: element.caseCount,
              //   上传案件数量: element.uploadCaseCount,
              //   合格数量: element.passCaseCount
              // };
            }

            // if (rootMenuArr[0] == 1) {
            //   datagrid2[index] = {
            //     city: element.courtName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     未上传案件数量: element.unUploadCaseCount
            //   };
            // } else if (rootMenuArr[0] == 2) {
            //   datagrid2[index] = {
            //     city: element.courtRoomName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     未上传案件数量: element.unUploadCaseCount
            //   };
            // } else if (rootMenuArr[0] == 3) {
            //   datagrid2[index] = {
            //     city: element.cbrName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     未上传案件数量: element.unUploadCaseCount
            //   };
            // } else if (rootMenuArr[0] == 4) {
            // }
          }
      
          drawTjbbChart2(datagrid2);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
          $scope.tableJson = [];
          $scope.initTable2($scope.tableJson);
        }
      });
    } else if (index == 3) {
      $(".shijian-select").show();
      $scope.create_table_flag = true;
      $scope.create_echarts_flag0 = false;
      $scope.create_echarts_flag1 = false;
      $scope.create_echarts_flag2 = false;
      $scope.create_echarts_flag3 = false;
      $scope.create_echarts_flag4 = false;
      $scope.create_echarts_flag5 = false;
      $scope.create_echarts_flag6 = false;
      $scope.create_echarts_flag7 = false;
      $scope.create_echarts_flag8 = false;
      $scope.create_echarts_flag9 = false;
      $scope.create_echarts_flag10 = false;
      services._getAllIndexDatas(param).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          var dataI = res.data.length - 1;
          var tongjiData = res.data[dataI];
          $scope.tableJson = res.data;
          $scope.tableJson.splice(dataI, 1);
          $scope.initTable3($scope.tableJson);
          var datagrid3 = [];
          for (var index = 0; index < res.data.length; index++) {
            var element = res.data[index];
            // if (rootMenuArr[0] == 1) {
            //   datagrid3[index] = {
            //     city: element.courtName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     未上传案件数量: element.unUploadCaseCount
            //   };
            // } else if (rootMenuArr[0] == 2) {
            //   datagrid3[index] = {
            //     city: element.courtRoomName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     未上传案件数量: element.unUploadCaseCount
            //   };
            // } else if (rootMenuArr[0] == 3) {
            //   datagrid3[index] = {
            //     city: element.cbrName,
            //     总案件量: element.caseCount,
            //     上传案件数量: element.uploadCaseCount,
            //     未上传案件数量: element.unUploadCaseCount
            //   };
            // } else if (rootMenuArr[0] == 4) {
            // }
            if ($scope.param.queryFlag == "") {
              datagrid3[index] = {
                city: element.courtName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                未上传案件数量: element.unUploadCaseCount
              };
            } else if (
              $scope.param.queryFlag == 0 &&
              $scope.param.queryFlag != ""
            ) {
              datagrid3[index] = {
                city: element.courtName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                未上传案件数量: element.unUploadCaseCount
              };
            } else if ($scope.param.queryFlag == 1) {
              datagrid3[index] = {
                city: element.courtRoomName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                未上传案件数量: element.unUploadCaseCount
              };
            } else if ($scope.param.queryFlag == 2) {
              datagrid3[index] = {
                city: element.cbrName,
                总案件量: element.caseCount,
                上传案件数量: element.uploadCaseCount,
                未上传案件数量: element.unUploadCaseCount
              };
            } else if (rootMenuArr[0] == 4) {
              // datagrid0[index] = {
              //   city: element.courtRoomName,
              //   总案件量: element.caseCount,
              //   上传案件数量: element.uploadCaseCount,
              //   合格数量: element.passCaseCount
              // };
            }
          }
          drawTjbbChart3(datagrid3);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
          $scope.tableJson = [];
          $scope.initTable3($scope.tableJson);
        }
      });
    } else if (index == 4) {
      $(".shijian-select").show();
      $scope.create_table_flag = true;
      $scope.create_echarts_flag0 = false;
      $scope.create_echarts_flag1 = false;
      $scope.create_echarts_flag2 = false;
      $scope.create_echarts_flag3 = false;
      $scope.create_echarts_flag4 = false;
      $scope.create_echarts_flag5 = false;
      $scope.create_echarts_flag6 = false;
      $scope.create_echarts_flag7 = false;
      $scope.create_echarts_flag8 = false;
      $scope.create_echarts_flag9 = false;
      $scope.create_echarts_flag10 = false;
      services._getAllIndexDatas(param).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          $scope.tableJson.splice(dataI, 1);
          $scope.initTable4($scope.tableJson);
          var datagrid4 = [];
          for (var index = 0; index < res.data.length; index++) {
            var element = res.data[index];

            // if (rootMenuArr[0] == 1) {
            //   datagrid4[index] = {
            //     city: element.courtName,
            //     合格数量: element.passCaseCount,
            //     不合格数量: element.unPassCaseCount
            //   };
            // } else if (rootMenuArr[0] == 2) {
            //   datagrid4[index] = {
            //     city: element.courtRoomName,
            //     合格数量: element.passCaseCount,
            //     不合格数量: element.unPassCaseCount
            //   };
            // } else if (rootMenuArr[0] == 3) {
            //   datagrid4[index] = {
            //     city: element.cbrName,
            //     合格数量: element.passCaseCount,
            //     不合格数量: element.unPassCaseCount
            //   };
            // } else if (rootMenuArr[0] == 4) {
            // }

            if ($scope.param.queryFlag == "") {
              datagrid4[index] = {
                city: element.courtName,
                合格数量: element.passCaseCount,
                不合格数量: element.unPassCaseCount
              };
            } else if (
              $scope.param.queryFlag == 0 &&
              $scope.param.queryFlag != ""
            ) {
              datagrid4[index] = {
                city: element.courtName,
                合格数量: element.passCaseCount,
                不合格数量: element.unPassCaseCount
              };
            } else if ($scope.param.queryFlag == 1) {
              datagrid4[index] = {
                city: element.courtRoomName,
                合格数量: element.passCaseCount,
                不合格数量: element.unPassCaseCount
              };
            } else if ($scope.param.queryFlag == 2) {
              datagrid4[index] = {
                city: element.cbrName,
                合格数量: element.passCaseCount,
                不合格数量: element.unPassCaseCount
              };
            } else if (rootMenuArr[0] == 4) {
              // datagrid0[index] = {
              //   city: element.courtRoomName,
              //   总案件量: element.caseCount,
              //   上传案件数量: element.uploadCaseCount,
              //   合格数量: element.passCaseCount
              // };
            }
          }
          drawTjbbChart4(datagrid4);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
          $scope.tableJson = [];
          $scope.initTable4($scope.tableJson);
        }
      });
    } else if (index == 5) {
      $(".shijian-select").show();
      $scope.create_table_flag = true;
      $scope.create_echarts_flag0 = false;
      $scope.create_echarts_flag1 = false;
      $scope.create_echarts_flag2 = false;
      $scope.create_echarts_flag3 = false;
      $scope.create_echarts_flag4 = false;
      $scope.create_echarts_flag5 = false;
      $scope.create_echarts_flag6 = false;
      $scope.create_echarts_flag7 = false;
      $scope.create_echarts_flag8 = false;
      $scope.create_echarts_flag9 = false;
      $scope.create_echarts_flag10 = false;
      services._getAllIndexDatas(param).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          $scope.tableJson.splice(dataI, 1);
          $scope.initTable5($scope.tableJson);
          var datagrid5 = [];
          for (var index = 0; index < res.data.length; index++) {
            var element = res.data[index];

            // if (rootMenuArr[0] == 1) {
            //   datagrid5[index] = {
            //     city: element.courtName,
            //     合格数量: element.passCaseCount,
            //     不合格数量: element.unPassCaseCount
            //   };
            // } else if (rootMenuArr[0] == 2) {
            //   datagrid5[index] = {
            //     city: element.courtRoomName,
            //     合格数量: element.passCaseCount,
            //     不合格数量: element.unPassCaseCount
            //   };
            // } else if (rootMenuArr[0] == 3) {
            //   datagrid5[index] = {
            //     city: element.cbrName,
            //     合格数量: element.passCaseCount,
            //     不合格数量: element.unPassCaseCount
            //   };
            // } else if (rootMenuArr[0] == 4) {
            // }
            if ($scope.param.queryFlag == "") {
              datagrid5[index] = {
                city: element.courtName,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if (
              $scope.param.queryFlag == 0 &&
              $scope.param.queryFlag != ""
            ) {
              datagrid5[index] = {
                city: element.courtName,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if ($scope.param.queryFlag == 1) {
              datagrid5[index] = {
                city: element.courtRoomName,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if ($scope.param.queryFlag == 2) {
              datagrid5[index] = {
                city: element.cbrName,
                上传案件数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
              };
            } else if (rootMenuArr[0] == 4) {
              // datagrid0[index] = {
              //   city: element.courtRoomName,
              //   总案件量: element.caseCount,
              //   上传案件数量: element.uploadCaseCount,
              //   合格数量: element.passCaseCount
              // };
            }
          }
          drawTjbbChart5(datagrid5);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
          $scope.tableJson = [];
          $scope.initTable5($scope.tableJson);
        }
      });
    } else if (index == 6) {
      
      $(".shijian-select").show();
      $scope.create_table_flag = true;
      $scope.create_echarts_flag0 = false;
      $scope.create_echarts_flag1 = false;
      $scope.create_echarts_flag2 = false;
      $scope.create_echarts_flag3 = false;
      $scope.create_echarts_flag4 = false;
      $scope.create_echarts_flag5 = false;
      $scope.create_echarts_flag6 = false;
      $scope.create_echarts_flag7 = false;
      $scope.create_echarts_flag8 = false;
      $scope.create_echarts_flag9 = false;
      $scope.create_echarts_flag10 = false;
      services._getPieDatas($scope.suianParam).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          // var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          // $scope.tableJson.splice(dataI, 1);
          $scope.initTable6($scope.tableJson);
          var datagrid6 = {
            names: [],
            source: []
          };
          console.log()
          for (var index = 0; index < res.data.length; index++) {
            var element = res.data[index];
            datagrid6.names.push(element.caseTypeName);
            datagrid6.source[index] = {
              value: element.uploadCaseCount,
              name: element.caseTypeName
            };
            if (rootMenuArr[0] == 1) {
            } else if (rootMenuArr[0] == 2) {
            } else if (rootMenuArr[0] == 3) {
            } else if (rootMenuArr[0] == 4) {
            }
          }
          drawTjbbChart6(datagrid6);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关案件类型分布信息 ", {
            offset: ["325px", "780px"]
          });
          $scope.tableJson = [];
          $scope.initTable6($scope.tableJson);
        }
      });
    } else if (index == 7) {
      $(".shijian-select").show();
      $scope.create_table_flag = true;
      $scope.create_echarts_flag0 = false;
      $scope.create_echarts_flag1 = false;
      $scope.create_echarts_flag2 = false;
      $scope.create_echarts_flag3 = false;
      $scope.create_echarts_flag4 = false;
      $scope.create_echarts_flag5 = false;
      $scope.create_echarts_flag6 = false;
      $scope.create_echarts_flag7 = false;
      $scope.create_echarts_flag8 = false;
      $scope.create_echarts_flag9 = false;
      $scope.create_echarts_flag10 = false;
      //未完
      var ctParam = {};
      services._getAllIndexDatas(ctParam).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          // var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          // $scope.tableJson.splice(dataI, 1);
          $scope.initTable7($scope.tableJson);
          var datagrid7 = {
            names: [],
            source: []
          };
          for (var index = 0; index < res.data.length; index++) {
            var element = res.data[index];
            if ($scope.param.queryFlag == "") {
              datagrid7.names.push(element.courtName);
              datagrid7.source[index] = {
                value: element.caseCount,
                name: element.caseTypeName
              };
            } else if (
              $scope.param.queryFlag == 0 &&
              $scope.param.queryFlag != ""
            ) {
              datagrid7.names.push(element.courtName);
              datagrid7.source[index] = {
                value: element.caseCount,
                name: element.caseTypeName
              };
            } else if ($scope.param.queryFlag == 1) {
              datagrid7.names.push(element.courtRoomName);
              datagrid7.source[index] = {
                value: element.caseCount,
                name: element.caseTypeName
              };
            } else if ($scope.param.queryFlag == 2) {
              datagrid7.names.push(element.cbrName);
              datagrid7.source[index] = {
                value: element.caseCount,
                name: element.caseTypeName
              };
            } else if (rootMenuArr[0] == 4) {
              // datagrid0[index] = {
              //   city: element.courtRoomName,
              //   总案件量: element.caseCount,
              //   上传案件数量: element.uploadCaseCount,
              //   合格数量: element.passCaseCount
              // };
            }
            // if (rootMenuArr[0] == 1) {
            //   datagrid7.names.push(element.courtName);
            //   datagrid7.source[index] = {
            //     value: element.caseCount,
            //     name: element.caseTypeName
            //   };
            // } else if (rootMenuArr[0] == 2) {
            //   datagrid7.names.push(element.courtRoomName);
            //   datagrid7.source[index] = {
            //     value: element.caseCount,
            //     name: element.caseTypeName
            //   };
            // } else if (rootMenuArr[0] == 3) {
            //   datagrid7.names.push(element.cbrName);
            //   datagrid7.source[index] = {
            //     value: element.caseCount,
            //     name: element.caseTypeName
            //   };
            // } else if (rootMenuArr[0] == 4) {
            // }
          }
          drawTjbbChart7(datagrid7);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
          $scope.tableJson = [];
          $scope.initTable7($scope.tableJson);
        }
      });
    } else if (index == 8) {
      $(".shijian-select").show();
      $scope.create_table_flag = true;
      $scope.create_echarts_flag0 = false;
      $scope.create_echarts_flag1 = false;
      $scope.create_echarts_flag2 = false;
      $scope.create_echarts_flag3 = false;
      $scope.create_echarts_flag4 = false;
      $scope.create_echarts_flag5 = false;
      $scope.create_echarts_flag6 = false;
      $scope.create_echarts_flag7 = false;
      $scope.create_echarts_flag8 = false;
      $scope.create_echarts_flag9 = false;
      $scope.create_echarts_flag10 = false;
      $scope.suianParam.indexFlag = 1;
      services._getAllIndexDatas($scope.param).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          $scope.tableJson.splice(dataI, 1);
          $scope.initTable8($scope.tableJson);
          var datagrid8 = [];
          for (var index = 0; index < $scope.tableJson.length; index++) {
            var element = $scope.tableJson[index];

            if (rootMenuArr[0] == 1) {
              datagrid8[index] = {
                product: element.courtName,
                制作数量: element.uploadCaseCount
              };
            } else if (rootMenuArr[0] == 2) {
              datagrid8[index] = {
                product: element.courtRoomName,
                制作数量: element.uploadCaseCount
              };
            } else if (rootMenuArr[0] == 3) {
              datagrid8[index] = {
                product: element.cbrName,
                制作数量: element.uploadCaseCount
              };
            } else if (rootMenuArr[0] == 4) {
            }
          }
          drawTjbbChart8(datagrid8);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
          $scope.tableJson8 = [];
          $scope.initTable8($scope.tableJson);
        }
      });
    } else if (index == 9) {
      $(".shijian-select").show();
      $scope.create_table_flag = true;
      $scope.create_echarts_flag0 = false;
      $scope.create_echarts_flag1 = false;
      $scope.create_echarts_flag2 = false;
      $scope.create_echarts_flag3 = false;
      $scope.create_echarts_flag4 = false;
      $scope.create_echarts_flag5 = false;
      $scope.create_echarts_flag6 = false;
      $scope.create_echarts_flag7 = false;
      $scope.create_echarts_flag8 = false;
      $scope.create_echarts_flag9 = false;
      $scope.create_echarts_flag10 = false;
      $scope.suianParam.indexFlag = 2;
      services._getAllIndexDatas($scope.param).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          $scope.tableJson.splice(dataI, 1);
          $scope.initTable9($scope.tableJson);
          var datagrid9 = [];
          for (var index = 0; index < res.data.length; index++) {
            for (var index = 0; index < $scope.tableJson.length; index++) {
              var element = $scope.tableJson[index];

              if (rootMenuArr[0] == 1) {
                datagrid9[index] = {
                  city: element.courtName,
                  合格数量: element.passCaseCount
                };
              } else if (rootMenuArr[0] == 2) {
                datagrid9[index] = {
                  city: element.courtName,
                  合格数量: element.passCaseCount
                };
              } else if (rootMenuArr[0] == 3) {
                datagrid9[index] = {
                  city: element.courtName,
                  合格数量: element.passCaseCount
                };
              } else if (rootMenuArr[0] == 4) {
              }
            }
          }
          drawTjbbChart9(datagrid9);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
          $scope.tableJson = [];
          $scope.initTable9($scope.tableJson);
        }
      });
    } else if (index == 10) {
      $(".shijian-select").hide();
      $scope.create_table_flag = true;
      $scope.create_echarts_flag0 = false;
      $scope.create_echarts_flag1 = false;
      $scope.create_echarts_flag2 = false;
      $scope.create_echarts_flag3 = false;
      $scope.create_echarts_flag4 = false;
      $scope.create_echarts_flag5 = false;
      $scope.create_echarts_flag6 = false;
      $scope.create_echarts_flag7 = false;
      $scope.create_echarts_flag8 = false;
      $scope.create_echarts_flag9 = false;
      $scope.create_echarts_flag10 = false;
      var endParam = { courtId: "", flag: true, courtRoomId: "" };
      if (rootMenuArr[0] == 1) {
      } else if (rootMenuArr[0] == 2) {
        endParam.courtId = rootUserInfo.courtId;
      } else if (rootMenuArr[0] == 3) {
        endParam.courtId = rootUserInfo.courtId;
        endParam.courtRoomId = rootUserInfo.courtRoomId;
      } else if (rootMenuArr[0] == 4) {
        endParam.courtId = rootUserInfo.courtId;
        endParam.courtRoomId = rootUserInfo.courtRoomId;
      }
      services._getCaseCountTrend(endParam).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          // var dataI = res.data.length - 1;
          $scope.tableJson = res.data;
          // $scope.tableJson.splice(dataI, 1);
          $scope.initTable10($scope.tableJson);
          var datagrid10 = {
            times: [],
            allCaseNum: [],
            upLoadCaseNum: [],
            passCaseCount: []
          };
          var linshiDatas = res.data;
          for (let index = 0; index < linshiDatas.length; index++) {
            const element = linshiDatas[index];
            element.months = insertStr(element.months, 4, "-");
            datagrid10.times.push(element.months);
            datagrid10.allCaseNum.push(element.caseCount);
            datagrid10.upLoadCaseNum.push(element.uploadCaseCount);
            datagrid10.passCaseCount.push(element.passCaseCount);
          }
          drawTjbbChart10(datagrid10);
          $("#yichuli-table").datagrid("resize");
        } else {
          layer.msg("获取总体趋势数据 ", { offset: ["325px", "780px"] });
          $scope.tableJson = [];
          $scope.initTable10($scope.tableJson);
        }
      });
    }
  };
  $scope.create_table_flag = true;
  $scope.create_echarts_flag0 = false;
  $scope.create_echarts_flag1 = false;
  $scope.create_echarts_flag2 = false;
  $scope.create_echarts_flag3 = false;
  $scope.create_echarts_flag4 = false;
  $scope.create_echarts_flag5 = false;
  $scope.create_echarts_flag6 = false;
  $scope.create_echarts_flag7 = false;
  $scope.create_echarts_flag8 = false;
  $scope.create_echarts_flag9 = false;
  $scope.create_echarts_flag10 = false;
  $scope.echarts_btn_text = "生成图表";
  $scope.createEcharts = function() {
    if (tbIndex == 0) {
      $scope.create_echarts_flag0 = !$scope.create_echarts_flag0;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 1) {
      $scope.create_echarts_flag1 = !$scope.create_echarts_flag1;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 2) {
      $scope.create_echarts_flag2 = !$scope.create_echarts_flag2;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 3) {
      $scope.create_echarts_flag3 = !$scope.create_echarts_flag3;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 4) {
      $scope.create_echarts_flag4 = !$scope.create_echarts_flag4;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 5) {
      $scope.create_echarts_flag5 = !$scope.create_echarts_flag5;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 6) {
      $scope.create_echarts_flag6 = !$scope.create_echarts_flag6;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 7) {
      $scope.create_echarts_flag7 = !$scope.create_echarts_flag7;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 8) {
      $scope.create_echarts_flag8 = !$scope.create_echarts_flag8;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 9) {
      $scope.create_echarts_flag9 = !$scope.create_echarts_flag9;
      $scope.create_table_flag = !$scope.create_table_flag;
    } else if (tbIndex == 10) {
      $scope.create_echarts_flag10 = !$scope.create_echarts_flag10;
      $scope.create_table_flag = !$scope.create_table_flag;
    }
    if (!$scope.create_echarts_flag) {
      $scope.echarts_btn_text = "生成图表";
    } else {
      $scope.echarts_btn_text = "生成表格";
    }
  };
  $scope.initTable0 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "courtName",
            title: "所属",
            width: "24%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              if ($scope.param.queryFlag == "") {
                result = row.areaName;
              }
              if ($scope.param.queryFlag == "0") {
                result = row.courtName;
              }
              if ($scope.param.queryFlag == 1) {
                result = row.courtRoomName;
              }
              if ($scope.param.queryFlag == 2) {
                result = row.cbrName;
              }
              return result;
            }
          },
          {
            field: "caseCount",
            title: "总案件量",
            width: "25%",
            align: "center"
          },
          {
            field: "uploadCaseCount",
            title: "上传案件数量",
            width: "25%",
            align: "center"
          },
          {
            field: "passCaseCount",
            title: "合格数量",
            width: "25%",
            align: "center",
            hidden: false
          }
        ]
      ],
      data: $scope.tableJson,
      height: "97%",
      width: "100%",
      isScroll: true,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };
  $scope.initTable1 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "courtName",
            title: "所属",
            width: "20%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              if ($scope.param.queryFlag == "") {
                result = row.areaName;
              }
              if ($scope.param.queryFlag == "0") {
                result = row.courtName;
              }
              if ($scope.param.queryFlag == 1) {
                result = row.courtRoomName;
              }
              if ($scope.param.queryFlag == 2) {
                result = row.cbrName;
              }
              return result;
            }
          },
          {
            field: "caseCount",
            title: "总案件量",
            width: "20%",
            align: "center"
          },
          {
            field: "uploadCaseCount",
            title: "上传案件数量",
            width: "20%",
            align: "center"
          },
          {
            field: "uploadIndex",
            title: "随案生成批次",
            width: "19%",
            align: "center",
            hidden: false
          },
          {
            field: "totalFileNum",
            title: "扫描上传页数",
            width: "20%",
            align: "center"
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };

  $scope.initTable2 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "courtName",
            title: "所属",
            width: "25%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              if ($scope.param.queryFlag == "") {
                result = row.areaName;
              }
              if ($scope.param.queryFlag == "0") {
                result = row.courtName;
              }
              if ($scope.param.queryFlag == 1) {
                result = row.courtRoomName;
              }
              if ($scope.param.queryFlag == 2) {
                result = row.cbrName;
              }
              return result;
            }
          },
          {
            field: "caseCount",
            title: "总案件量",
            width: "25%",
            align: "center"
          },
          {
            field: "uploadCaseCount",
            title: "上传案件数量",
            width: "25%",
            align: "center"
          },
          {
            field: "unUploadCaseCount",
            title: "未上传案件数量",
            width: "24%",
            align: "center",
            hidden: false
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };
  $scope.initTable3 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "courtName",
            title: "所属",
            width: "20%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              if ($scope.param.queryFlag == "") {
                result = row.areaName;
              }
              if ($scope.param.queryFlag == "0") {
                result = row.courtName;
              }
              if ($scope.param.queryFlag == 1) {
                result = row.courtRoomName;
              }
              if ($scope.param.queryFlag == 2) {
                result = row.cbrName;
              }
              return result;
            }
          },
          {
            field: "caseCount",
            title: "总案件量",
            width: "20%",
            align: "center"
          },
          {
            field: "uploadCaseCount",
            title: "上传案件数量",
            width: "20%",
            align: "center"
          },
          {
            field: "unUploadCaseCount",
            title: "未上传案件数量",
            width: "20%",
            align: "center",
            hidden: false
          },
          {
            field: "uploadRate",
            title: "制作率",
            width: "19%",
            align: "center",
            hidden: false
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };
  $scope.initTable4 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "courtName",
            title: "所属",
            width: "33%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              if ($scope.param.queryFlag == "") {
                result = row.areaName;
              }
              if ($scope.param.queryFlag == "0") {
                result = row.courtName;
              }
              if ($scope.param.queryFlag == 1) {
                result = row.courtRoomName;
              }
              if ($scope.param.queryFlag == 2) {
                result = row.cbrName;
              }
              return result;
            }
          },
          {
            field: "passCaseCount",
            title: "合格数量",
            width: "33%",
            align: "center"
          },
          {
            field: "unPassCaseCount",
            title: "不合格数量",
            width: "33%",
            align: "center"
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };
  $scope.initTable5 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "courtName",
            title: "所属",
            width: "25%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              if ($scope.param.queryFlag == "") {
                result = row.areaName;
              }
              if ($scope.param.queryFlag == "0") {
                result = row.courtName;
              }
              if ($scope.param.queryFlag == 1) {
                result = row.courtRoomName;
              }
              if ($scope.param.queryFlag == 2) {
                result = row.cbrName;
              }
              return result;
            }
          },
          {
            field: "uploadCaseCount",
            title: "上传案件数量",
            width: "25%",
            align: "center"
          },
          {
            field: "passCaseCount",
            title: "合格数量",
            width: "25%",
            align: "center"
          },
          {
            field: "passRate",
            title: "合格率",
            width: "24%",
            align: "center"
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };
  $scope.initTable6 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "caseTypeName",
            title: "案件类型",
            width: "33%",
            align: "center"
          },
          {
            field: "uploadCaseCount",
            title: "上传案件数量",
            width: "33%",
            align: "center"
          },
          {
            field: "caseCountRate",
            title: "占比",
            width: "33%",
            align: "center"
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };
  $scope.initTable7 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "courtName",
            title: "所属",
            width: "49%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              if ($scope.param.queryFlag == "") {
                result = row.areaName;
              }
              if ($scope.param.queryFlag == "0") {
                result = row.courtName;
              }
              if ($scope.param.queryFlag == 1) {
                result = row.courtRoomName;
              }
              if ($scope.param.queryFlag == 2) {
                result = row.cbrName;
              }
              return result;
            }
          },
          {
            field: "buhege",
            title: "不合格原因",
            width: "50%",
            align: "center"
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };
  $scope.initTable8 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "courtName",
            title: "所属",
            width: "49%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              if ($scope.param.queryFlag == "") {
                result = row.areaName;
              }
              if ($scope.param.queryFlag == "0") {
                result = row.courtName;
              }
              if ($scope.param.queryFlag == 1) {
                result = row.courtRoomName;
              }
              if ($scope.param.queryFlag == 2) {
                result = row.cbrName;
              }
              return result;
            }
          },
          {
            field: "uploadCaseCount",
            title: "电子卷宗制作数量",
            width: "50%",
            align: "center"
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };
  $scope.initTable9 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "courtName",
            title: "所属",
            width: "49%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              if ($scope.param.queryFlag == "") {
                result = row.areaName;
              }
              if ($scope.param.queryFlag == "0") {
                result = row.courtName;
              }
              if ($scope.param.queryFlag == 1) {
                result = row.courtRoomName;
              }
              if ($scope.param.queryFlag == 2) {
                result = row.cbrName;
              }
              return result;
            }
          },
          {
            field: "passCaseCount",
            title: "合格案件数量",
            width: "50%",
            align: "center"
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };
  $scope.initTable10 = function() {
    $("#yichuli-table").datagrid({
      columns: [
        [
          {
            field: "months",
            title: "月份",
            width: "25%",
            align: "center",
            formatter: function(value, row, index) {
              var result = "";
              var id = row.months;
              id = insertStr(id, 4, "-");
              result = "<span>" + id + "</span>";
              return result;
            }
          },
          {
            field: "caseCount",
            title: "总案件数量",
            width: "25%",
            align: "center"
          },
          {
            field: "uploadCaseCount",
            title: "上传案件数量",
            width: "25%",
            align: "center"
          },
          {
            field: "passCaseCount",
            title: "合格案件数量",
            width: "25%",
            align: "center"
          }
        ]
      ],
      data: $scope.tableJson,
      pagination: false,
      collapsible: true,
      singleSelect: true,
      rownumbers: true,
      striped: true,
      height: "97%",
      width: "100%",
      isScroll: true,
      onSelect: function(rowindex, row) {
        $scope.selectRow = row;
      }
    });
  };

  function drawTjbbChart0(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart0"));
    var option = {
      //电子卷宗制作与质检总体统计报表
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "电子卷宗制作与质检总体统计报表 ",
        top: 15,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        left: "30"
      },
      grid: {
        // 控制图的大小，调整下面这些值就可以，
        x: 80,
        x2: 30,
        y2: 100 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      legend: {
        textStyle: {
          color: "#c3e7ff"
        },
        right: 60,
        top: 15
      },
      tooltip: {},
      dataset: {
        dimensions: ["city", "总案件量", "上传案件数量", "合格数量"],
        source: datagrid
      },

      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          },
          rotate: -30
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      series: [
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#ea7f31"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#eff143"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#6dc051"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart1(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart1"));
    var option = {
      //电子卷宗制作与质检总体统计报表
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "电子卷宗制作与质检总体统计报表 ",
        top: 15,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        left: "30"
      },
      grid: {
        // 控制图的大小，调整下面这些值就可以，
        x: 80,
        x2: 10,
        y2: 30 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      legend: {
        textStyle: {
          color: "#c3e7ff"
        },
        right: 60,
        top: 15
      },
      tooltip: {},
      dataset: {
        dimensions: [
          "city",
          "总案件量",
          "上传案件数量",
          "随案生成批次",
          "扫描上传页数"
        ],
        source: datagrid
      },

      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      series: [
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#ea7f31"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#eff143"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#6dc051"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["rgb(117,117,200)"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart2(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart2"));
    var option = {
      //电子卷宗制作与质检总体统计报表
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "电子卷宗制作与质检总体统计报表 ",
        top: 15,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        left: "30"
      },
      grid: {
        // 控制图的大小，调整下面这些值就可以，
        x: 80,
        x2: 10,
        y2: 30 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      legend: {
        textStyle: {
          color: "#c3e7ff"
        },
        right: 60,
        top: 15
      },
      tooltip: {},
      dataset: {
        dimensions: ["city", "总案件量", "上传案件数量", "未上传案件数量"],
        source: datagrid
      },

      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      series: [
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#ea7f31"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#eff143"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#6dc051"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart3(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart3"));
    var option = {
      //电子卷宗制作与质检总体统计报表
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "电子卷宗制作与质检总体统计报表 ",
        top: 15,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        left: "30"
      },
      grid: {
        // 控制图的大小，调整下面这些值就可以，
        x: 80,
        x2: 10,
        y2: 30 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      legend: {
        textStyle: {
          color: "#c3e7ff"
        },
        right: 60,
        top: 15
      },
      tooltip: {},
      dataset: {
        dimensions: ["city", "总案件量", "上传案件数量", "未上传案件数量"],
        source: datagrid
      },

      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      series: [
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#ea7f31"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#eff143"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#6dc051"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart4(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart4"));
    var option = {
      //电子卷宗制作与质检总体统计报表
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "电子卷宗制作与质检总体统计报表 ",
        top: 15,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        left: "30"
      },
      grid: {
        // 控制图的大小，调整下面这些值就可以，
        x: 80,
        x2: 10,
        y2: 30 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      legend: {
        textStyle: {
          color: "#c3e7ff"
        },
        right: 60,
        top: 15
      },
      tooltip: {},
      dataset: {
        dimensions: ["city", "合格数量", "不合格数量"],
        source: datagrid
      },

      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      series: [
        // {
        //   type: "bar",
        //   barWidth: 10,
        //   itemStyle: {
        //     emphasis: {
        //       shadowBlur: 10,
        //       shadowOffsetX: 0
        //       // shadowColor: "rgba(0, 0, 0, 0.5)"
        //     },
        //     normal: {
        //       color: ["#ea7f31"],
        //       label: {
        //         show: false, //开启显示
        //         position: "top", //在上方显示
        //         textStyle: {
        //           //数值样式
        //           color: "white",
        //           fontSize: 10
        //         }
        //       }
        //     }
        //   }
        // },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#eff143"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#6dc051"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart5(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart5"));
    var option = {
      //电子卷宗制作与质检总体统计报表
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "电子卷宗制作与质检总体统计报表 ",
        top: 15,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        left: "30"
      },
      grid: {
        // 控制图的大小，调整下面这些值就可以，
        x: 80,
        x2: 10,
        y2: 30 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      legend: {
        textStyle: {
          color: "#c3e7ff"
        },
        right: 60,
        top: 15
      },
      tooltip: {},
      dataset: {
        dimensions: ["city", "上传案件数量", "合格数量"],
        source: datagrid
      },

      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          },
          rotate: -30
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      series: [
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#ea7f31"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#eff143"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart6(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart6"));
    var option = {
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 0,
        right: 30
      },
      title: {
        text: "电子卷宗质量检查情况分布图(全省）",
        top: 00,
        left: 0,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 14
        },
        left: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "horizontal",
        textStyle: {
          color: "#c3e7ff"
        },
        bottom: 30,
        left: 30,
        data: datagrid.names
      },
      series: [
        {
          name: " ",
          type: "pie",
          radius: ["50%", "65%"],
          center: ["50%", "50%"],
          // radius: "50%",
          // center: ["50%", "50%"],
          data: datagrid.source,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: function(params) {
                // build a color map as your need.
                var colorList = [
                  "rgb(27,237,185)",
                  "rgb(13,155,143)",
                  "rgb(128,214,64)",
                  "#99BBFF",
                  "#ea7f31",
                  "#eff143",
                  "#0074D9",
                  "#7FDBFF",
                  "#39CCCC",
                  "#3D9970",
                  "#B10DC9",
                  "#FFDC00",
                  "#FF851B",
                  "#85144b",
                  "#AAAAAA",
                  "#F012BE"
                ];
                return colorList[params.dataIndex];
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart7(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart7"));
    var option = {
      //电子卷宗制作与质检总体统计报表
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "电子卷宗制作与质检总体统计报表 ",
        top: 15,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        left: "30"
      },
      grid: {
        // 控制图的大小，调整下面这些值就可以，
        x: 80,
        x2: 10,
        y2: 30 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      legend: {
        textStyle: {
          color: "#c3e7ff"
        },
        right: 60,
        top: 15
      },
      tooltip: {},
      dataset: {
        dimensions: ["city", "总案件量", "上传案件数量", "合格数量"],
        source: datagrid
      },

      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      series: [
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#ea7f31"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#eff143"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        },
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#6dc051"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart8(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart8"));
    var option = {
      //电子卷宗制作与质检总体统计报表
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "电子卷宗制作与质检总体统计报表 ",
        top: 15,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        left: "30"
      },
      grid: {
        // 控制图的大小，调整下面这些值就可以，
        x: 80,
        x2: 30,
        y2: 40 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      legend: {
        textStyle: {
          color: "#c3e7ff"
        },
        right: 60,
        top: 15
      },
      tooltip: {},
      dataset: {
        dimensions: ["product", "制作数量"],
        source: datagrid
      },

      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          },
          rotate: -15
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -35
        }
      },
      series: [
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#ea7f31"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart9(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart9"));
    var option = {
      //电子卷宗制作与质检总体统计报表
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "电子卷宗制作与质检总体统计报表 ",
        top: 15,
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        left: "30"
      },
      grid: {
        // 控制图的大小，调整下面这些值就可以，
        x: 80,
        x2: 10,
        y2: 30 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
      },
      legend: {
        textStyle: {
          color: "#c3e7ff"
        },
        right: 60,
        top: 15
      },
      tooltip: {},
      dataset: {
        dimensions: ["city", "合格数量"],
        source: datagrid
      },

      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      series: [
        {
          type: "bar",
          barWidth: 10,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0
              // shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: ["#ea7f31"],
              label: {
                show: false, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "white",
                  fontSize: 10
                }
              }
            }
          }
        }
      ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  function drawTjbbChart10(datagrid) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("tjbb_chart10"));
    var option = {
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: "下载图片",
            excludeComponents: ["toolbox"],
            backgroundColor: "rgba(1, 45, 74,1)",
            iconStyle: {
              color: "#c3e7ff",
              borderColor: "#c3e7ff"
            },
            pixelRatio: 2
          }
        },
        top: 10,
        right: 30
      },
      title: {
        text: "本年电子卷宗制作与质检趋势图",
        textStyle: {
          //标题颜色
          color: "#c3e7ff",
          fontSize: 16
        },
        top: 12,
        left: 12
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["总案件数量", "已上传案件数量", "合格案件数量"],
        textStyle: {
          color: "#c3e7ff"
        },
        top: 15,
        right: 80
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        },
        boundaryGap: false,
        data: datagrid.times
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff",
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#c3e7ff"
          }
          // rotate: -40
        }
      },
      series: [
        {
          name: "总案件数量",
          type: "line",
          symbol: "circle", //设定为实心点
          symbolSize: 10, //设定实心点的大小
          itemStyle: {
            normal: {
              color: ["#fd8433"]
            }
          },
          data: datagrid.allCaseNum
        },
        {
          name: "已上传案件数量",
          type: "line",
          symbol: "circle", //设定为实心点
          symbolSize: 10, //设定实心点的大小
          itemStyle: {
            normal: {
              // color:["#864efb"]
              color: ["#66aede"]
            }
          },
          data: datagrid.upLoadCaseNum
        },
        {
          name: "合格案件数量",
          type: "line",
          symbol: "circle", //设定为实心点
          symbolSize: 10, //设定实心点的大小
          itemStyle: {
            normal: {
              // color:["#0064fa"]
              color: ["#90ec7d"]
            }
          },
          data: datagrid.passCaseCount
        }
      ]
    };
    myChart.setOption(option);
    setTimeout(function() {
      window.onresize = function() {
        myChart.resize();
      };
    }, 200);
  }
  $(function() {
    //tree begin
    var treeStr = "";

    for (var index = 0; index < $scope.court_obj.length; index++) {
      var element = $scope.court_obj[index];
      var treeChildStr = "";
      for (var i = 0; i < element.children.length; i++) {
        var child = element.children[i];
        treeChildStr +=
          '<span class="nowrap" title="' +
          element.court_name +
          '" style="width:85%;"><input type="checkbox" class="tree_node_child_checkbox">' +
          child.court_name +
          " </span><br>";
      }
      treeStr +=
        ' <div class="tree_node top_tree_node rela">' +
        ' <div class="div_inline top_div_inline abso"><input type="button" value="-" class="tree_node_toggle_button"></div>' +
        ' <div class="div_inline bot_div_inline tree_node_parent">' +
        '     <input type="checkbox" class="tree_node_parent_checkbox"><span class="nowrap" title="' +
        element.court_name +
        '" style="width:85%;">' +
        element.court_name +
        "</span>" +
        '     <div class="tree_node_child">' +
        treeChildStr +
        "     </div>" +
        " </div>" +
        "</div>";
    }

    $(".tree_content").html(treeStr);
    // 为所有的父节点添加点击事件
    $(".tree_node_parent_checkbox").click(function() {
      // 获取父节点是否选中
      var isChange = $(this).prop("checked");
      if (isChange) {
        // 如果选中,则父节点下的所有的子节点都选中
        // 获取当前checkbox节点的兄弟节点下的所有的checkbox子节点选中
        // $(this).next().find(".tree_node_child_checkbox").prop("checked", true);
        var court_name = $(this)
          .siblings("span")
          .text();
        $scope.param.courts_name.push(court_name);
        if ($scope.param.courts_text == "全部法院") {
          $scope.param.courts_text = "";
          $scope.param.courts_name = [];
          $scope.param.courts_id = [];
        }

        $scope.param.courts_text = $scope.param.courts_text + court_name;
        $("#fayuan_input").val($scope.param.courts_text);
      } else {
        // 未选中，取消全选
        // 获取当前checkbox节点的兄弟节点下的所有的checkbox子节点选中
        // $(this).next().find(".tree_node_child_checkbox").removeAttr("checked");
      }
    });
    // 为所有的子节点添加点击事件
    $(".tree_node_child_checkbox").click(function(e) {
      e.stopPropagation();
      // 获取选中的节点的父节点下的所有子节点选中的数量
      var length = $(this)
        .parent()
        .find(".tree_node_child_checkbox:checked").length;
      // 判断当前结点是否选中
      if ($(this).prop("checked")) {
        // 选中
        // 如果当前节点选中后,所有的选中节点数量1，选中父节点
        if ($scope.param.courts_text == "全部法院") {
          $scope.param.courts_text = "";
          $scope.param.courts_name = [];
          $scope.param.courts_id = [];
        }
        $scope.param.courts_text =
          $scope.param.courts_text +
          "、" +
          $(this)
            .parent()
            .text();
        $("#fayuan_input").val($scope.param.courts_text);
        if (length == 1) {
          // 选中父节点
          // $(this).parent().prev().prop("checked", true);
        }
      } else {
        // 节点未选中
        if (length == 0) {
          // 取消父节点的选中状态
          // $(this).parent().prev().removeAttr("checked");
        }
      }
    });
    $(".tree_node_child>.nowrap").click(function(e) {
      // e.stopPropagation();
      if (
        $(this)
          .find("input")
          .prop("checked") == false
      ) {
        $(this)
          .find("input")
          .prop("checked", true);
      } else {
        $(this)
          .find("input")
          .prop("checked", false);
        $(this)[0].title;
        $("#fayuan_input").val($scope.param.courts_text);
      }
    });
    $(".tree_node_parent>.nowrap").click(function(e) {
      // e.stopPropagation();

      if (
        $(this)
          .siblings("input")
          .prop("checked") == false
      ) {
        $(this)
          .siblings("input")
          .prop("checked", true);
      } else {
        $(this)
          .siblings("input")
          .prop("checked", false);
      }
    });
    $(".my_drop").click(function(e) {
      e.stopPropagation();
    });
    // 为所有的切换按钮添加点击事件
    $(".tree_node_toggle_button").click(function() {
      // 获取需要隐藏或显示的节点
      var $toggle_node = $(this)
        .parent()
        .next()
        .find(".tree_node_child");
      $toggle_node.toggle(); // 切换隐藏或显示
      // 切换按钮的显示
      if ($toggle_node.is(":visible")) {
        $(this).val("-");
      } else {
        $(this).val("+");
      }
    });
    // tree end
  });
});
