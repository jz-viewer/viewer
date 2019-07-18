var courtClick,
  buhegeClick,
  yuejuanClick,
  pizhuClick,
  heshiClick,
  initTable,
  serverIp ,
  pO;
var getCaseTbaleJsonList;
var getTbaleJsonList;
var rootUserInfo = {};
var rootMenuArr = [];
var initFlag = 2;
var yuejuanParm = {
  caseId: "",
  courtId: "",
  checkCaseResult: ""
};
myControllers.controller("appController", function(
  $rootScope,
  $scope,
  services,
  $window,
  $location
) {
  //解析url,获取url中需要的参数
  function urlParse() {
    var url = window.location.search;
    var obj = {};
    var reg = /[?&][^?&]+=[^?&]+/g;
    var arr = url.match(reg);

    if (arr) {
      arr.forEach(function(item) {
        var tempArr = item.substring(1).split("=");
        var key = decodeURIComponent(tempArr[0]);
        var val = decodeURIComponent(tempArr[1]);
        obj[key] = val;
      });
    }
    return obj;
  }
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
  var TimeTo = $rootScope.getDateStr(new Date(), "datetime");
  var TimeFrom = TimeTo.substring(0, 5) + "01-01 00:00:00";
  // var TimeTo = "";
  // var TimeFrom = "";
  $scope.court_obj = {};
  $scope.namesList = {
    courtName: "",
    roomName: "",
    cbrName: "",
    hegeName: "",
    caseTypeName: "",
    spcxName: "",
    ajjdName: ""
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
        $scope.allRoomsList = [];
        layer.msg(" 未获取到相关庭室列表 ", { offset: ["325px", "780px"] });
      }
    });
  };
  $scope.courtList = [];
  $scope.getAllCourtList = function() {
    services._getAllCourtList().success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        var lisdatas = res.data;
        for (let index = 0; index < lisdatas.length; index++) {
          const element = lisdatas[index];
          $scope.courtList = res.data;
        }
      } else {
        layer.msg(" 未获取到相关法院列表 ", { offset: ["325px", "780px"] });
      }
    });
  };
  $scope.getAllCourtList();
  $scope.getCbrList = function(parmC) {
    services._getAllCbrList(parmC).success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        $scope.allCbrList = res.data;
        $scope.allCbrList.unshift({
          userFullName: "全部法官",
          userCode: ""
        });
      } else {
        layer.msg(" 未获取到相关法官列表 ", { offset: ["325px", "780px"] });
      }
    });
  };
  // $scope.getCbrList = function(cbrParam) {
  //   services._getAllCbrList(cbrParam).success(function(res) {
  //     if (res.code == 0&&res.data.length>0) {
  //       $scope.roomCbrList = res.data;
  //     } else {
  //       layer.msg(" 未获取到相关法官列表 ", { offset: ["325px", "780px"] });
  //     }
  //   });
  // };
  $scope.paramInit = {
    courtIdStrings: "",
    courtRoomIdStrings: "",
    cbrIdStrings: "",
    queryFlag: "",
    // laDateStart: thisMonthFirsrDay,
    laDateStart: "2017-01-01",
    laDateEnd: todayTime
  };
  getCaseTbaleJsonList = function(columns, param) {
    services._getCaseInfoList(param).success(function(res) {
      if (res.code == 0) {
        $scope.tableJson = res.data;
        initTable(columns);
        $scope.load(param);
      }
    });
  };
  cbrClick = function(cbrId) {
    $(".zlcx-list-export").hide();
    // $(".zlcx-list-print").hide();
    $(".case-list-export").show();
    $(".r_content_tool ").css({
      height: "60px"
    });
    // $(".case-list-print").show();
    $(".top_search").addClass("r_60");
    initFlag = 2;
    $(".case_fayuan").css({
      display: "inline-block"
    });
    $(".init_fayuan").hide();
    $(".select_c_box_case,.select_box_cbr,.select_box_room").css({
      display: "inline-block"
    });
    $("#myPager").show();
    $(".t_content").css({
      height: "550px"
    });
    $(".select_c_box_court").css("marginTop", "15px");
    if (rootUserInfo.roleMenus[0] == 4) {
      $scope.param.courtRoomId = rootUserInfo.courtRoomId;
      $scope.param.courtId = rootUserInfo.courtId;
      $scope.paramInit.cbrIdStrings = rootUserInfo.userCode;
      $scope.paramInit.courtRoomIdStrings = rootUserInfo.courtRoomId;
      $scope.paramInit.courtIdStrings = rootUserInfo.courtId;
    } else if (rootUserInfo.roleMenus[0] == 3) {
      $scope.param.courtRoomId = rootUserInfo.courtRoomId;
      $scope.param.courtId = rootUserInfo.courtId;
      $scope.paramInit.courtRoomIdStrings = rootUserInfo.courtRoomId;
      $scope.paramInit.courtIdStrings = rootUserInfo.courtId;
    } else if (rootUserInfo.roleMenus[0] == 2) {
      $scope.param.courtId = rootUserInfo.courtId;
      $scope.paramInit.courtIdStrings = rootUserInfo.courtId;
    } else {
      $scope.param.courtId = $("#fayuan_input")[0].name;
      $scope.param.courtId = $("#fayuan_input_case")[0].name;
    }
    $scope.param.cbrId = cbrId;
    $scope.paramInit.cbrIdStrings = cbrId;
    var curl =
      "/caseCheck/caseStatistics/queryCaseCount2?courtIdStrings=" +
      $scope.param.courtId +
      "&courtRoomIdStrings=&cbrIdStrings=" +
      cbrId +
      "&queryFlag=2&indexFlag=2&laDateStart=" +
      $scope.paramInit.laDateStart +
      "&laDateEnd=" +
      $scope.paramInit.laDateEnd;
    $.ajax({
      url: curl,
      // async: false,
      type: "GET",
      success: function(res) {
        if (res.code == 0) {
          $(".faguan_text").text(res.data[0].cbrName);
          $("#cbr_name").val(res.data[0].cbrName);
        }
      }
    });
    getCaseTbaleJsonList(columnsCase, $scope.param);
  };
  getTbaleJsonList = function(columns, param) {
    if (rootMenuArr[0] == 2) {
      $scope.paramInit.courtIdStrings = rootUserInfo.courtId;
      $scope.paramInit.queryFlag = 1;
      setTimeout($scope.getAllRoomsByCourtId(rootUserInfo.courtId), 1000);
      $(".select_box_room,.tingshi_text").css({
        display: "inline-block"
      });
      columns = columnsRooms;
    } else if (rootMenuArr[0] == 3) {
      columns = columnscbr;
      var cbrparam = {
        courtId: rootUserInfo.courtId,
        courtRoomId: rootUserInfo.courtRoomId
      };
      $scope.getCbrList(cbrparam);
      $scope.paramInit.courtRoomIdStrings = rootUserInfo.courtRoomId;
      $scope.paramInit.queryFlag = 2;
      $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
        display: "inline-block"
      });
    } else if (rootMenuArr[0] == 4) {
      // $(".case_fayuan").css({
      //   display: "inline-block"
      // });
      // $(".init_fayuan").hide();
      // $(".select_c_box_case,.select_box_cbr,.select_box_room").css({
      //   display: "inline-block"
      // });
      // $("#myPager").show();
      // $(".t_content").css({
      //   height: "550px"
      // });
      // $(".select_c_box_court").css("marginTop", "15px");
      // $scope.param.cbrId = rootUserInfo.userCode;
      // $scope.param.courtId = rootUserInfo.courtId;
      // var curl =
      //   "/caseCheck/caseStatistics/queryCaseCount2?courtIdStrings=" +
      //   $scope.param.courtId +
      //   "&courtRoomIdStrings=&cbrIdStrings=" +
      //   $scope.param.cbrId +
      //   "&queryFlag=2&indexFlag=2&laDateStart=" +
      //   $scope.paramInit.laDateStart +
      //   "&laDateEnd=" +
      //   $scope.paramInit.laDateEnd;
      // $.ajax({
      //   url: curl,
      //   async: false,
      //   type: "GET",
      //   success: function(res) {
      //     if (res.code == 0) {
      //       console.log(res)
      //       $(".faguan_text").text(res.data[0].cbrName);
      //       $("#cbr_name").val(res.data[0].cbrName);
      //     }
      //   }
      // });
      // cbrClick($scope.param.cbrId);
      // getTbaleJsonList(columnscbr, $scope.paramInit);
      // getCaseTbaleJsonList(columnsCase, $scope.param);
      // return
    }
    $(".top_search").addClass("r_60");
    $(".zlcx-list-export").hide();
    // $(".zlcx-list-print").hide();
    $(".case-list-export").show();
    $(".r_content_tool ").css({
      height: "60px"
    });
    // $(".case-list-print").show();
    initFlag = 2;
    $(".fayuan_text").val(rootUserInfo.courtName);
    $("#fayuan_input_case").val(rootUserInfo.courtName);
    $scope.getAllRoomsByCourtId(rootUserInfo.courtId);
    $("#myPager").show();
    // $scope.getUserInfo();
    if (rootMenuArr[0] == 1) {
      $scope.param = {
        courtId: rootUserInfo.courtId,
        courtRoomId: "",
        cbrId: "",
        caseTypeId: "",
        spcxId: "",
        caseStatus: "",
        checkCaseResult: "",
        caseName: "",
        queryAreaFlag: false,
        checkCaseMessageFlag: true,
        // laDateStart: thisMonthFirsrDay,
        laDateStart: "2017-01-01",
        laDateEnd: todayTime,
        currentPage: 1,
        pageSize: 10
      };
      $scope.getAllCourtList();
      $("#tz_input").val("全部庭室");
      $scope.getAllRoomsByCourtId(rootUserInfo.courtId);
    } else if (rootMenuArr[0] == 2) {
      $scope.param = {
        courtId: rootUserInfo.courtId,
        courtRoomId: "",
        cbrId: "",
        caseTypeId: "",
        spcxId: "",
        caseStatus: "",
        checkCaseResult: "",
        caseName: "",
        queryAreaFlag: false,
        checkCaseMessageFlag: true,
        // laDateStart: thisMonthFirsrDay,
        laDateStart: "2017-01-01",
        laDateEnd: todayTime,
        currentPage: 1,
        pageSize: 10
      };
      $scope.courtList = [rootUserInfo.courtName];
      $scope.getAllRoomsByCourtId(rootUserInfo.courtId);
      $("#fayuan_input").val(rootUserInfo.courtName);
      $scope.paramInit.queryFlag = 1;
      getTbaleJsonList(columnsRooms, $scope.paramInit);
      $(".select_box_room,.tingshi_text").css({
        display: "inline-block"
      });
    } else if (rootMenuArr[0] == 3) {
      $scope.param = {
        courtId: rootUserInfo.courtId,
        courtRoomId: rootUserInfo.courtRoomId,
        cbrId: "",
        caseTypeId: "",
        spcxId: "",
        caseStatus: "",
        checkCaseResult: "",
        caseName: "",
        queryAreaFlag: false,
        checkCaseMessageFlag: true,
        // laDateStart: thisMonthFirsrDay,
        laDateStart: "2017-01-01",
        laDateEnd: todayTime,
        currentPage: 1,
        pageSize: 10
      };
      $scope.courtList = [rootUserInfo.courtName];
      $scope.allRoomsList = [rootUserInfo.courtRoomName];
      var ccbrparam = {
        courtId: rootUserInfo.courtId,
        courtRoomId: rootUserInfo.courtRoomId
      };
      $("#fayuan_input").val(rootUserInfo.courtName);
      $("#tz_input").val(rootUserInfo.courtRoomName);
      $scope.getCbrList(ccbrparam);
      $scope.paramInit.courtRoomIdStrings = rootUserInfo.courtRoomId;
      $scope.paramInit.queryFlag = 2;
      getTbaleJsonList(columnscbr, $scope.paramInit);
      $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
        display: "inline-block"
      });
    } else if (rootMenuArr[0] == 4) {
      $scope.param = {
        courtId: rootUserInfo.courtId,
        courtRoomId: rootUserInfo.courtRoomId,
        cbrId: rootUserInfo.userCode,
        caseTypeId: "",
        spcxId: "",
        caseStatus: "",
        checkCaseResult: "",
        caseName: "",
        queryAreaFlag: false,
        checkCaseMessageFlag: true,
        // laDateStart: thisMonthFirsrDay,
        laDateStart: "2017-01-01",
        laDateEnd: todayTime,
        currentPage: 1,
        pageSize: 10
      };
      $scope.allCbrList = [
        {
          userFullName: rootUserInfo.userFullName,
          userCode: rootUserInfo.userCode
        }
      ];
      $("#fayuan_input").val(rootUserInfo.courtName);
      $("#tz_input").val(rootUserInfo.courtRoomName);
      $("#cbr_name").val(rootUserInfo.userFullName);
      $(".faguan_text").text(rootUserInfo.userFullName);
      $scope.paramInit.queryFlag = 2;
      // getTbaleJsonList(columnscbr, $scope.paramInit);
      $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
        display: "inline-block"
      });
    }
    // $scope.load();
    $(".t_content").css({
      height: "550px"
    });
    $("#cbr_name,.cbr_name-addon").click(function() {
      if (
        $scope.param.courtRoomIdStrings == "" ||
        $scope.namesList.roomName == "全部庭室" ||
        $("#tz_input").val() == "全部庭室"
      ) {
        layer.msg("请先选择所属庭室", { offset: ["325px", "780px"] });
      }
    });
    $("#spcx_input,.spcx_input-addon").click(function() {
      if ($scope.param.caseTypeId == "") {
        layer.msg("请先选择案件类型", { offset: ["325px", "780px"] });
      }
    });
    // $(".tingshi_text").text("全部庭室");
    // $(".faguan_text").text("全部法官");
    $(
      ".select_c_box_case,.select_box_room,.select_box_cbr,.tingshi_text,.faguan_text"
    ).css({
      display: "inline-block"
    });
    $(".select_c_box_court").css("marginTop", "15px");
    $(".case_fayuan").css({
      display: "inline-block"
    });
    $(".init_fayuan").hide();
    // getTbaleJsonList(columnsCaseCode);
    // $scope.load();
    // services._getAllIndexDatas(param).success(function(res) {
    //   if (res.code == 0 && res.data.length > 0) {
    //     $scope.tableJson = res.data;
    //     $scope.tableJson.splice(res.data.length - 1, 1);
    //     initTable(columns);
    //   } else {
    //     $scope.tableJson = [];
    //     initTable(columns);
    //     layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
    //   }
    // });
  };

  getTbaleJsonListSearch = function(columns, param) {
    if ($scope.paramInit.queryFlag == 0) {
    } else if ($scope.paramInit.queryFlag == 1) {
      $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
        display: "inline-block"
      });
    } else if ($scope.paramInit.queryFlag == 2) {
    }
    services._getAllIndexDatas(param).success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        $scope.tableJson = res.data;
        $scope.tableJson.splice(res.data.length - 1, 1);
        initTable(columns);
      } else {
        $scope.tableJson = [];
        initTable(columns);
        layer.msg("未获取到相关统计信息 ", { offset: ["325px", "780px"] });
      }
    });
  };
  pO = urlParse();
  $scope.load = function() {
    console.log(111)
    if (pO.source == 1) {
      $scope.param.checkCaseResult = 1;
      $scope.namesList.hegeName = "不合格";
      // $scope.param.caseName = pO.name;
      $scope.param.caseId = pO.name;
      $("#fayuan_input_case").val("全部法院");
    } else if(pO.source == 2){
      $scope.param.checkCaseResult = 1;
      $scope.namesList.hegeName = "不合格";
      // $scope.param.caseName = pO.name;
      $scope.param.caseId = pO.name;
      services._getAllCourtList().success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          var lisdatas = res.data;
          for (let index = 0; index < lisdatas.length; index++) {
            const element = lisdatas[index];
            $scope.courtList = res.data;
            for (let index = 0; index < $scope.courtList.length; index++) {
              const element = $scope.courtList[index];
              if(element.courtId == pO.courtId){
                if(rootMenuArr[0] == 4){
                $("#fayuan_input_case").val(element.courtName);
                $("#fayuan_input_case").css({
                  pointerEvents: "none"
                })
              }
            }
            }
          }
        } else {
          layer.msg(" 未获取到相关法院列表 ", { offset: ["325px", "780px"] });
        }
      });
      var parmR = {
        courtId: pO.courtId
      };
      services._getAllRoomListByCourtId(parmR).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          $scope.allRoomsList = res.data;
          for (let index = 0; index < $scope.allRoomsList.length; index++) {
            const element = $scope.allRoomsList[index];
            if(element.courtRoomId == pO.courtRoomId){
              if(rootMenuArr[0] == 4){
                $("#tz_input").val(element.courtRoomName);
                $("#tz_input,.tz_input_addon").css({
                  pointerEvents: "none"
                })
              }
             
            }
          }
        } else {
          $scope.allRoomsList = [];
          layer.msg(" 未获取到相关庭室列表 ", { offset: ["325px", "780px"] });
        }
      });
     var parmC = {
      courtId: pO.courtId,
      courtRoomId:pO.courtRoomId
      };
      services._getAllCbrList(parmC).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          $scope.allCbrList = res.data;
          for (let index = 0; index < $scope.allCbrList.length; index++) {
            const element = $scope.allCbrList[index];
            if(element.userCode == pO.cbrId){
              if(rootMenuArr[0] == 4){
              $("#cbr_name").val(element.userFullName);
              $("#cbr_name,.cbr_input_addon").css({
                pointerEvents: "none"
              })
            }
          }
          }
        } else {
          layer.msg(" 未获取到相关法官列表 ", { offset: ["325px", "780px"] });
        }
      });
    }else if (pO.source == 3) {
      $scope.param.checkCaseResult = 1;
      $scope.namesList.hegeName = "不合格";
      $scope.param.courtId = pO.courtId;
      // $scope.param.checkCaseResult = 1;
    } else if (pO.source == 4) {
      $scope.param.checkCaseResult = 1;
      $scope.namesList.hegeName = "不合格";
      $scope.param.courtId = pO.courtId;
      $scope.param.courtRoomId = pO.courtRoomId;
      $scope.param.cbrId = pO.cbrId;
      // $scope.param.checkCaseResult = 1;
      services._getAllCourtList().success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          var lisdatas = res.data;
          for (let index = 0; index < lisdatas.length; index++) {
            const element = lisdatas[index];
            $scope.courtList = res.data;
            for (let index = 0; index < $scope.courtList.length; index++) {
              const element = $scope.courtList[index];
              if(element.courtId == pO.courtId){
                if(rootMenuArr[0] == 4){
                $("#fayuan_input_case").val(element.courtName);
                $("#fayuan_input_case").css({
                  pointerEvents: "none"
                })
              }
            }
            }
          }
        } else {
          layer.msg(" 未获取到相关法院列表 ", { offset: ["325px", "780px"] });
        }
      });
      var parmR = {
        courtId: pO.courtId
      };
      services._getAllRoomListByCourtId(parmR).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          $scope.allRoomsList = res.data;
          for (let index = 0; index < $scope.allRoomsList.length; index++) {
            const element = $scope.allRoomsList[index];
            if(element.courtRoomId == pO.courtRoomId){
              if(rootMenuArr[0] == 4){
              $("#tz_input").val(element.courtRoomName);
              $("#tz_input,.tz_input_addon").css({
                pointerEvents: "none"
              })
            }
          }
          }
        } else {
          $scope.allRoomsList = [];
          layer.msg(" 未获取到相关庭室列表 ", { offset: ["325px", "780px"] });
        }
      });
     var parmC = {
      courtId: pO.courtId,
      courtRoomId:pO.courtRoomId
      };
      services._getAllCbrList(parmC).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          $scope.allCbrList = res.data;
          for (let index = 0; index < $scope.allCbrList.length; index++) {
            const element = $scope.allCbrList[index];
            if(element.userCode == pO.cbrId){
              if(rootMenuArr[0] == 4){
              $("#cbr_name").val(element.userFullName);
              $("#cbr_name,.cbr_input_addon").css({
                pointerEvents: "none"
              })
            }
          }
          }
        } else {
          layer.msg(" 未获取到相关法官列表 ", { offset: ["325px", "780px"] });
        }
      });
     
    }else if(pO.source == 99){
      var myobj = $scope.param;
      $scope.param = {};
       $scope.param = {
        courtId: myobj.courtId,
        courtRoomId: myobj.courtRoomId,
        cbrId: myobj.cbrId,
        caseTypeId: myobj.caseTypeId,
        spcxId: myobj.spcxId,
        caseStatus: myobj.caseStatus,
        checkCaseResult: myobj.checkCaseResult,
        caseName: myobj.caseName,
        queryAreaFlag: myobj.queryAreaFlag,
        checkCaseMessageFlag: myobj.checkCaseMessageFlag,
        // laDateStart: thisMonthFirsrDay,
        laDateStart:myobj.laDateStart,
        laDateEnd: myobj.laDateEnd,
        currentPage: 1,
        pageSize: 10
      };
    }
    services._getCaseInfoList($scope.param).success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        // $scope.param.pages = (res.total % param.pageSize == 0) ? parseInt(res.total / param.pageSize) : parseInt((parseInt(res.total / param.pageSize) + 1));
        $scope.tableJson = res.data;
        
        $("#myPager").show();
        for (let index = 0; index < $scope.tableJson.length; index++) {
          var elements = $scope.tableJson[index];
          for (let key in elements) {
            if (elements[key] == null) {
              elements[key] = " ";
            }
          }
        }
        initTable(columnsCaseCode);
        initTable0();
        if (rootMenuArr[0] == 1) {
          $(".heshi-btn").show();
        }
        serverIp = res.data[0].serverIp;

        if ($scope._myPagerSetPager) {
          $scope._myPagerSetPager($scope.param, res);
        }
      } else {
        $scope.tableJson = [];
        initTable(columnsCaseCode);
        layer.msg("未获取到相关案件信息");
        if ($scope._myPagerSetPager) {
          $scope.param.currentPage = "";
          $scope._myPagerSetPager($scope.param, res);
        }
      }
    });
  };
  console.log(rootMenuArr)
  if (rootMenuArr[0] == 1) {
    $scope.paramInit = {
      courtIdStrings: "",
      courtRoomIdStrings: "",
      cbrIdStrings: "",
      queryFlag: "",
      indexFlag: 1,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime
    };
    $scope.param = {
      courtId: rootUserInfo.courtId,
      courtRoomId: "",
      cbrId: "",
      caseTypeId: "",
      spcxId: "",
      caseStatus: "",
      checkCaseResult: "",
      caseName: "",
      queryAreaFlag: false,
      checkCaseMessageFlag: true,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime,
      currentPage: 1,
      pageSize: 10
    };
    $scope.getAllCourtList();
    $scope.getAllRoomsByCourtId(rootUserInfo.courtId);
    $scope.load();
  } else if (rootMenuArr[0] == 2) {
    $scope.paramInit = {
      courtIdStrings: rootUserInfo.courtId,
      courtRoomIdStrings: "",
      cbrIdStrings: "",
      queryFlag: 0,
      indexFlag: 1,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime
    };
    $scope.param = {
      courtId: rootUserInfo.courtId,
      courtRoomId: "",
      cbrId: "",
      caseTypeId: "",
      spcxId: "",
      caseStatus: "",
      checkCaseResult: "",
      caseName: "",
      queryAreaFlag: false,
      checkCaseMessageFlag: true,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime,
      currentPage: 1,
      pageSize: 10
    };
    $scope.courtList = [rootUserInfo.courtName];
    $scope.getAllRoomsByCourtId(rootUserInfo.courtId);
    $("#fayuan_input").val(rootUserInfo.courtName);
    $scope.paramInit.queryFlag = 1;
    // getTbaleJsonList(columnsRooms, $scope.paramInit);
    $scope.load();
    $(".select_box_room,.tingshi_text").css({
      display: "inline-block"
    });
  } else if (rootMenuArr[0] == 3) {
    $scope.paramInit = {
      courtIdStrings: rootUserInfo.courtId,
      courtRoomIdStrings: rootUserInfo.courtRoomId,
      cbrIdStrings: "",
      queryFlag: "",
      indexFlag: 1,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      queryAreaFlag: false,
      laDateEnd: todayTime
    };
    $scope.param = {
      courtId: rootUserInfo.courtId,
      courtRoomId: rootUserInfo.courtRoomId,
      cbrId: "",
      caseTypeId: "",
      spcxId: "",
      caseStatus: "",
      checkCaseResult: "",
      caseName: "",
      queryAreaFlag: false,
      checkCaseMessageFlag: true,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime,
      currentPage: 1,
      pageSize: 10
    };
    $scope.courtList = [rootUserInfo.courtName];
    $scope.allRoomsList = [rootUserInfo.courtRoomName];
    var ccbrparam = {
      courtId: rootUserInfo.courtId,
      courtRoomId: rootUserInfo.courtRoomId
    };
    $("#fayuan_input").val(rootUserInfo.courtName);
    $("#tz_input").val(rootUserInfo.courtRoomName);
    $scope.getCbrList(ccbrparam);
    $scope.paramInit.courtRoomIdStrings = rootUserInfo.courtRoomId;
    $scope.paramInit.queryFlag = 2;
    // getTbaleJsonList(columnscbr, $scope.paramInit);
    $scope.load();
    $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
      display: "inline-block"
    });
  } else if (rootMenuArr[0] == 4) {
    $scope.paramInit = {
      courtIdStrings: rootUserInfo.courtId,
      courtRoomIdStrings: rootUserInfo.courtRoomId,
      cbrIdStrings: rootUserInfo.userCode,
      queryFlag: "",
      indexFlag: 1,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime
    };
    $scope.param = {
      courtId: rootUserInfo.courtId,
      courtRoomId: rootUserInfo.courtRoomId,
      cbrId: rootUserInfo.userCode,
      caseTypeId: "",
      spcxId: "",
      caseStatus: "",
      checkCaseResult: "",
      caseName: "",
      queryAreaFlag: false,
      checkCaseMessageFlag: true,
      // laDateStart: thisMonthFirsrDay,
      laDateStart: "2017-01-01",
      laDateEnd: todayTime,
      currentPage: 1,
      pageSize: 10
    };
    $scope.allCbrList = [
      {
        userFullName: rootUserInfo.userFullName,
        userCode: rootUserInfo.userCode
      }
    ];
    $scope.namesList.cbrName = rootUserInfo.userFullName;
    $("#fayuan_input").val(rootUserInfo.courtName);
    $("#tz_input").val(rootUserInfo.courtRoomName);
    $("#cbr_name").val(rootUserInfo.userFullName);
    $scope.paramInit.queryFlag = 2;
    // getTbaleJsonList(columnscbr, $scope.paramInit);
    $scope.load();
    $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
      display: "inline-block"
    });
  }

  $scope.bottimeScope =
    $scope.paramInit.laDateStart + " 至 " + $scope.paramInit.laDateEnd;
  $scope.timeScope =
    $scope.paramInit.laDateStart + " 至 " + $scope.paramInit.laDateEnd;
  $scope.selectTime = function($event) {
    $scope.timeScope = $event.target.innerHTML;
    if ($scope.timeScope == "本月") {
      $scope.paramInit.laDateStart = thisMonthFirsrDay;
      $scope.paramInit.laDateEnd = todayTime;
      $scope.param.laDateStart = thisMonthFirsrDay;
      $scope.param.laDateEnd = todayTime;
    } else if ($scope.timeScope == "上月") {
      $scope.paramInit.laDateStart = lastMonthFirsrDay;
      $scope.paramInit.laDateEnd = lastMonthLastDay;
      $scope.param.laDateStart = lastMonthFirsrDay;
      $scope.param.laDateEnd = lastMonthLastDay;
    } else if ($scope.timeScope == "本周") {
      $scope.paramInit.laDateStart = thisWeekFirsrDay;
      $scope.paramInit.laDateEnd = todayTime;
      $scope.param.laDateStart = thisWeekFirsrDay;
      $scope.paramparamInit.laDateEnd = todayTime;
    } else if ($scope.timeScope == "上周") {
      $scope.paramInit.laDateStart = lastWeekFirstDay;
      $scope.paramInit.laDateEnd = lastWeekLastDay;
      $scope.param.laDateStart = lastWeekFirstDay;
      $scope.param.laDateEnd = lastWeekLastDay;
    } else if ($scope.timeScope == "今天") {
      $scope.paramInit.laDateStart = todayTime;
      $scope.paramInit.laDateEnd = nextDate;
      $scope.param.laDateStart = todayTime;
      $scope.param.laDateEnd = nextDate;
    } else if ($scope.timeScope == "昨天") {
      $scope.paramInit.laDateStart = preDate;
      $scope.paramInit.laDateEnd = todayTime;
      $scope.param.laDateStart = preDate;
      $scope.param.laDateEnd = todayTime;
    } else if ($scope.timeScope == "近半年") {
      $scope.paramInit.laDateStart = getLastSixMonthYestdy(new Date());
      $scope.paramInit.laDateEnd = todayTime;
      $scope.param.laDateStart = getLastSixMonthYestdy(new Date());
      $scope.param.laDateEnd = todayTime;
    } else if ($scope.timeScope == "近一年") {
      $scope.paramInit.laDateStart = getLastYearYestdy(new Date());
      $scope.paramInit.laDateEnd = todayTime;
      $scope.param.laDateStart = getLastYearYestdy(new Date());
      $scope.param.laDateEnd = todayTime;
    }
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

  $scope.anJianJieDuanList = [
    {
      name: "全部",
      id: ""
    },
    {
      name: "新移送",
      id: 1
    },
    {
      name: "立案登记",
      id: 2
    },
    {
      name: "立案审查",
      id: 3
    },
    {
      name: "立案审批",
      id: 4
    },
    {
      name: "等待分派",
      id: 5
    },
    {
      name: "等待确认",
      id: 6
    },
    {
      name: "正在审理",
      id: 7
    },
    {
      name: "立案待结",
      id: 8
    },
    {
      name: "结案报批",
      id: 9
    },
    {
      name: "已经结案",
      id: 10
    },
    {
      name: "已经归档",
      id: 11
    }
  ];

  $scope.hegeList = [
    { name: "全部", id: "" },
    { name: "合格", id: 0 },
    { name: "不合格", id: 1 }
  ];
  $scope.getAllSpcxList = function(caseTypeId) {
    var paramS = {
      caseTypeId: caseTypeId
    };
    services._getSPcxJson(paramS).success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        $scope.allSpcxList = res.data;
        $scope.allSpcxList.unshift({
          spcxName: "全部",
          spcxId: ""
        });
      } else {
        layer.msg("未获取到相关审判程序", { offset: ["325px", "780px"] });
      }
    });
  };
  $scope.getAllCaseTypeList = function() {
    services._getCaseTypeJson().success(function(res) {
      if (res.code == 0 && res.data.length > 0) {
        $scope.allCaseTypeList = res.data;
        $scope.allCaseTypeList.unshift({
          caseTypeName: "全部类型",
          caseTypeId: ""
        });
      } else {
        layer.msg("未获取到相关案件类型", { offset: ["325px", "780px"] });
      }
    });
  };
  //书讯快递循环垂直向上滚动
  if (rootMenuArr[0] == 1) {
    $scope.namesList = {
      courtName: "",
      roomName: "",
      cbrName: "",
      hegeName: "",
      caseTypeName: "",
      spcxName: "",
      ajjdName: ""
    };
  } else if (rootMenuArr[0] == 2) {
    $scope.namesList = {
      courtName: rootUserInfo.courtName,
      roomName: "",
      cbrName: "",
      hegeName: "",
      caseTypeName: "",
      spcxName: "",
      ajjdName: ""
    };
  } else if (rootMenuArr[0] == 3) {
    $scope.namesList = {
      courtName: rootUserInfo.courtName,
      roomName: rootUserInfo.courtRoomName,
      cbrName: "",
      hegeName: "",
      caseTypeName: "",
      spcxName: "",
      ajjdName: ""
    };
  } else if (rootMenuArr[0] == 4) {
    $scope.namesList = {
      courtName: rootUserInfo.courtName,
      roomName: rootUserInfo.courtRoomName,
      cbrName: rootUserInfo.userFullName,
      hegeName: "",
      caseTypeName: "",
      spcxName: "",
      ajjdName: ""
    };
  }

  $scope.selCourt = function(item) {
    $scope.namesList.courtName = item.courtName;
    $scope.param.courtId = item.courtId;
  };
  $scope.selRoom = function(item) {
    $scope.allCbrList = [];
    if (item.courtRoomName == "全部庭室") {
      $scope.namesList.roomName = item.courtRoomName;
      $scope.param.courtRoomId = item.courtRoomId;
      $scope.paramInit.courtRoomIdStrings = item.courtRoomId;
      $scope.paramInit.queryFlag = 1;
      $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
        display: "inline-block"
      });
      $scope.param.cbrId = "";
      $scope.paramInit.cbrIdStrings = "";
      $("#cbr_name").val("全部法官");

      var paramC = {
        courtId: $scope.paramInit.courtIdStrings,
        courtRoomId: $scope.param.courtRoomId
      };
    } else {
      $scope.namesList.roomName = item.courtRoomName;
      $scope.param.courtRoomId = item.courtRoomId;
      $scope.paramInit.courtRoomIdStrings = item.courtRoomId;
      $scope.paramInit.queryFlag = 2;
      $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
        display: "inline-block"
      });
      $scope.param.cbrId = "";
      $scope.paramInit.cbrIdStrings = "";
      $("#cbr_name").val("全部法官");
      var paramC = {
        courtId: $scope.param.courtId,
        courtRoomId: $scope.param.courtRoomId
      };
      $scope.getCbrList(paramC);
    }
  };
  $scope.selCbr = function(item) {
    if (item.userFullName != "全部法官" && item.userFullName == null) {
      layer.msg("该法官没有承办案件", { offset: ["325px", "780px"] });
      return;
    } else {
      $scope.namesList.cbrName = item.userFullName;
      $scope.param.cbrId = item.userCode;
      $scope.paramInit.cbrIdStrings = item.userCode;
      $scope.paramInit.queryFlag = 2;
      $("#cbr_name").val(item.userFullName);
    }
  };
  $scope.selHege = function(item) {
    $scope.namesList.hegeName = item.name;
    $scope.param.checkCaseResult = item.id;
  };
  $scope.selCaseType = function(item) {
    if (item.caseTypeId == "") {
      $scope.namesList.caseTypeName = item.caseTypeName;
      $scope.param.caseTypeId = item.caseTypeId;
      $scope.namesList.spcxName = "全部";
      $scope.param.spcxId = "";
      $scope.allSpcxList = [];
    } else {
      $scope.namesList.caseTypeName = item.caseTypeName;
      $scope.param.caseTypeId = item.caseTypeId;
      $scope.getAllSpcxList(item.caseTypeId);
      $scope.namesList.spcxName = "全部";
      $scope.param.spcxId = "";
    }
  };
  $scope.selSpcx = function(item) {
    $scope.namesList.spcxName = item.spcxName;
    $scope.param.spcxId = item.spcxId;
  };
  $scope.selAjjd = function(item) {
    $scope.namesList.ajjdName = item.name;
    $scope.param.caseStatus = item.id;
  };
  $scope.getAllCaseTypeList();

  $scope._clearParmTime = function() {
    $scope.timeScope = "";
  };
  $scope.areaList = [{ courtAreaName: "全部地区", courtId: "" }];
  var courtArr = [];
  var courtIdArr = [];
  $scope._selCourt = function(item, e) {
    if (item.courtAreaName == "全部地区") {
      if (
        !$(e.target)
          .find("span")
          .hasClass("duihao")
      ) {
        $(e.target)
          .parent()
          .parent()
          .find("span")
          .addClass("duihao");
        for (let index = 1; index < $scope.areaList.length; index++) {
          const element = $scope.areaList[index];
          courtIdArr.push(element.courtId);
        }
      } else {
        $(e.target)
          .parent()
          .parent()
          .find("span")
          .removeClass("duihao");
        courtIdArr = [];
      }
      $scope.courtsText = "";
      $scope.courtRoomIdStrings = "";
    } else {
      $(".arae_list li:nth-child(1)")
        .find("span")
        .removeClass("duihao");
      $(e.target)
        .find("span")
        .toggleClass("duihao");
      if (
        !$(e.target)
          .find("span")
          .hasClass("duihao")
      ) {
        var index = $.inArray(item.courtId, courtIdArr);
        courtIdArr.splice(index, 1);
        courtArr.splice(index, 1);
        $scope.courtsText = courtArr.join("、");
      } else {
        courtArr.push(item.courtAreaName);
        courtArr = uniq(courtArr);
        courtIdArr.push(item.courtId);
        $scope.courtsText = courtArr.join("、");
      }
    }
  };

  $("#startTime").datetimepicker({
    timepicker: false,
    value: "2019-06-05",
    format: "y-m-d",
    startDate: new Date(),
    maxDate: new Date(),
    onSelectDate: function(dateText, inst) {
      $scope.paramInit.laDateStart = $rootScope
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
      $scope.paramInit.laDateEnd = $rootScope
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

  $scope.saveTimeScope = function() {
    if (endNum < staNum) {
      layer.msg("开始时间不能大于结束时间", { offset: ["325px", "780px"] });
      return;
    } else {
      $scope.param.laDateStart = $scope.param.laDateStart.substring(0, 10);
      $scope.param.laDateEnd = $scope.param.laDateEnd.substring(0, 10);
      // $scope.A();
      $scope.timeScope =
        $scope.param.laDateStart + " 至 " + $scope.param.laDateEnd;
      layer.closeAll();
    }
  };
  $scope.getAllAreaList = function() {
    services._getAllAreaList().success(function(res) {
      if (res.code == 0) {
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          $scope.areaList.push(element);
        }
      }
    });
  };
  $scope.getAllAreaList();
  $scope.reset = function() {
    // window.location.reload();
    initFlag = 2;
  };
  $(function() {
    $scope.search = function() {
      pO.source = 99;
     
      if (initFlag == 1) {
        if ($scope.paramInit.queryFlag == "") {
          getTbaleJsonListSearch(columnsCourts, $scope.paramInit);
        } else if ($scope.paramInit.queryFlag == 0) {
          getTbaleJsonListSearch(columnsCourt, $scope.paramInit);
        } else if ($scope.paramInit.queryFlag == 1) {
          getTbaleJsonListSearch(columnsRooms, $scope.paramInit);
        } else if ($scope.paramInit.queryFlag == 2) {
          getTbaleJsonListSearch(columnscbr, $scope.paramInit);
        }
        if ($scope.paramInit.courtRoomIdStrings == "") {
          $(".tingshi_text").text("全部庭室");
        } else {
          $(".tingshi_text").text($scope.namesList.roomName);
        }
        if ($scope.paramInit.cbrIdStrings == "") {
          $(".faguan_text").text("全部法官");
        } else {
          $(".faguan_text").text($scope.namesList.cbrName);
        }
        $(".fayuan_text").text($(".selectInput").val());

        $scope.bottimeScope = $scope.timeScope;
        // getTbaleJsonList(columnsCourts, $scope.paramInit);
      }
      if (initFlag == 2) {
        $scope.param.currentPage = 1;
        $scope.param.pageSize = 10;
        $scope.load();
        if ($scope.param.courtRoomId == "") {
          $(".tingshi_text").text("全部庭室");
        } else {
          $(".tingshi_text").text($scope.namesList.roomName);
        }
        if ($scope.param.cbrId == "") {
          $(".faguan_text").text("全部法官");
        } else {
          $(".faguan_text").text($scope.namesList.cbrName);
        }
        $(".fayuan_text").text($(".selectInput").val());

        $scope.bottimeScope = $scope.timeScope;
        // getTbaleJsonList(columnsCourts, $scope.paramInit);
      }
    };
    //打印
    $scope.printExcle = function() {
      $("#yichuli-table").datagrid("print", "");
    };
    // $scope.printExcleCse = function() {
    //   $("#print-content1").show();
    //   $("#print-content").hide();
    //   $("#daying-table").datagrid("resize");
    //   setTimeout(function() {
    //     $("#daying-table").datagrid("print", "");
    //     $("#print-content1").hide();
    //     $("#print-content").show();
    //     $("#yichuli-table").datagrid("resize");
    //   }, 100);
    // };
    //导出
    $scope.exportExcle = function() {
      $("#yichuli-table").datagrid("toExcel", "");
    };
    $scope.exportExcleCase = function() {
      // services._exportCaseList($scope.param).success(function(res) {
      //   if (res.code == 0) {
      //   } else {
      //   }
      // });
      var curl =
        "/caseCheck//export/exportCaseList?courtId=" +
        $scope.param.courtId +
        "&courtRoomId=" +
        $scope.param.courtRoomId +
        "&cbrId=" +
        $scope.param.cbrId +
        "&caseTypeId=" +
        $scope.param.caseTypeId +
        "&spcxId=" +
        $scope.param.spcxId +
        "&caseStatus=" +
        $scope.param.caseStatus +
        "&checkCaseResult=" +
        $scope.param.checkCaseResult +
        "&queryAreaFlag=" +
        $scope.param.queryAreaFlag +
        "&checkCaseMessageFlag=" +
        $scope.param.checkCaseMessageFlag +
        "&laDateStart=" +
        $scope.param.laDateStart +
        "&laDateEnd=" +
        $scope.param.laDateEnd +
        "&caseName=" +
        $scope.param.caseName;
      "&laDateEnd=" + $scope.paramInit.laDateEnd;
      window.location.href = curl;
    };

    if (rootMenuArr[0] == 1) {
      getTbaleJsonList(columnsCourts, $scope.paramInit);
    } else if (rootMenuArr[0] == 2) {
      getTbaleJsonList(columnsCourt, $scope.paramInit);
    } else if (rootMenuArr[0] == 3) {
      getTbaleJsonList(columnsRooms, $scope.paramInit);
    } else if (rootMenuArr[0] == 4) {
      //  var paramC = {
      //   courtId: $scope.param.courtId,
      //   courtRoomId: $scope.param.courtRoomId
      // };
      // $scope.getCbrList(paramC);
      // getTbaleJsonList(columnscbr, $scope.paramInit);
      // $scope.load();
      $scope.paramInit.courtIdStrings = rootUserInfo.courtId;
      $scope.paramInit.courtRoomIdStrings = rootUserInfo.courtRoomId;
      $scope.paramInit.cbrIdStrings = rootUserInfo.userCode;
      $scope.param = {
        courtId: rootUserInfo.courtId,
        courtRoomId: rootUserInfo.courtRoomId,
        cbrId: rootUserInfo.userCode,
        caseTypeId: "",
        spcxId: "",
        caseStatus: "",
        checkCaseResult: "",
        caseName: "",
        queryAreaFlag: false,
        checkCaseMessageFlag: true,
        // laDateStart: thisMonthFirsrDay,
        laDateStart: "2017-01-01",
        laDateEnd: todayTime,
        currentPage: 1,
        pageSize: 10
      };
      $scope.allCbrList = [
        {
          userFullName: rootUserInfo.userFullName,
          userCode: rootUserInfo.userCode
        }
      ];
      $("#fayuan_input").val(rootUserInfo.courtName);
      $("#tz_input").val(rootUserInfo.courtRoomName);
      $("#cbr_name").val(rootUserInfo.userFullName);
      $(".faguan_text").text(rootUserInfo.userFullName);
      $scope.paramInit.queryFlag = 2;
      // getTbaleJsonList(columnscbr, $scope.paramInit);
      $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
        display: "inline-block"
      });
      $scope.search();
    }

    if (document.title == "质量查询") {
      $(".menu_box li", parent.document)
        .eq(1)
        .addClass("active");
    }
    courtAllClick = function(areaId) {
      services._getAllCourtListJson({ courtId: areaId }).success(function(res) {
        if (res.code == 0) {
          if (res.data.parentId == 0) {
            $scope.paramInit.courtIdStrings = areaId;
            $scope.paramInit.queryFlag = 1;
            getTbaleJsonListSearch(columnsRooms, $scope.paramInit);
            $(".select_box_room,.tingshi_text").css({
              display: "inline-block"
            });
          } else {
            var curl = "/caseCheck/court/queryByCourtId?courtId=" + areaId;
            var courtIds = "";
            $.ajax({
              url: curl,
              // async: false,
              type: "GET",
              success: function(res) {
                if (res.code == 0) {
                  var childrenData = res.data.children,
                    newwArrs = [];
                  for (let index = 0; index < childrenData.length; index++) {
                    const element = childrenData[index];
                    newwArrs.push(element.courtId);
                  }
                  newwArrs.push(areaId);
                  courtIds = newwArrs.join("-");
                  $scope.paramInit.courtIdStrings = courtIds;
                  $scope.paramInit.queryFlag = 0;
                  getTbaleJsonListSearch(columnsCourt, $scope.paramInit);
                } else {
                  layer.msg("未获取到相关法院列表", {
                    offset: ["325px", "780px"]
                  });
                }
              },
              error: function(e) {
                layer.msg("未获取到相关法院列表", {
                  offset: ["325px", "780px"]
                });
              }
            });
            var url =
              "/caseCheck/caseStatistics/queryCaseCount2?courtIdStrings=" +
              areaId +
              "&courtRoomIdStrings=&cbrIdStrings=&queryFlag=0&indexFlag=1&laDateStart=" +
              $scope.paramInit.laDateStart +
              "&laDateEnd=" +
              $scope.paramInit.laDateEnd;
            $.ajax({
              url: url,
              // async: false,
              type: "GET",
              success: function(res) {
                if (res.code == 0 && res.data.length > 0) {
                  $(".fayuan_text").text(res.data[0].courtName + "及下辖法院");
                  $("#fayuan_input").val(res.data[0].courtName + "及下辖法院");
                  $("#fayuan_input_case").val(
                    res.data[0].courtName + "及下辖法院"
                  );
                  $("#fayuan_input")[0].name = res.data[0].courtId;
                  $("#fayuan_input_case")[0].name = res.data[0].courtId;
                } else {
                  layer.msg("未获取到相关法院数据", {
                    offset: ["325px", "780px"]
                  });
                }
              },
              error: function(e) {
                layer.msg("未获取到相关法院数据", {
                  offset: ["325px", "780px"]
                });
              }
            });
            $(".select_c_box_case,.select_box_room,.select_box_cbr").hide();
          }
        } else {
          layer.msg("未获取到相关法院数据", { offset: ["325px", "780px"] });
        }
      });
    };
    courtClick = function(courtId) {
      $scope.paramInit.courtIdStrings = courtId;
      $scope.paramInit.queryFlag = 1;
      getTbaleJsonListSearch(columnsRooms, $scope.paramInit);
      setTimeout($scope.getAllRoomsByCourtId(courtId), 1000);
      $(".select_box_room,.tingshi_text").css({
        display: "inline-block"
      });
    };
    roomClick = function(courtRoomId) {
      $scope.paramInit.queryFlag = 2;
      $scope.paramInit.courtRoomIdStrings = courtRoomId;
      var cbrparam = {
        courtId: $scope.paramInit.courtIdStrings,
        courtRoomId: courtRoomId
      };
      $scope.getCbrList(cbrparam);
      getTbaleJsonListSearch(columnscbr, $scope.paramInit);

      $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
        display: "inline-block"
      });
    };

    buhegeClick = function(id) {
      $(".zlcx-list-export").hide();
      // $(".zlcx-list-print").hide();
      $(".r_content_tool ").css({
        height: "60px"
      });
      $(".case-list-export").show();
      // $(".case-list-print").show();
      $(".top_search").addClass("r_60");
      initFlag = 2;
      $("#myPager").show();
      $(".t_content").css({
        height: "550px"
      });
      setTimeout(function() {
        if ($scope.selectRow.areaId) {
          $scope.param.courtId = $scope.selectRow.areaId;
        } else if (
          $scope.selectRow.courtId &&
          $scope.selectRow.courtRoomId == ""
        ) {
          $scope.param.courtId = $scope.selectRow.courtId;
        }
        if ($scope.selectRow.courtRoomId != "") {
          $scope.param.courtId = $scope.selectRow.courtId;
          $scope.param.courtRoomId = $scope.selectRow.courtRoomId;
        }
        if (
          $scope.selectRow.cbrId != "" &&
          $scope.selectRow.cbrId != undefined
        ) {
          $scope.param.courtId = $scope.selectRow.courtId;
          $scope.param.courtRoomId = $scope.selectRow.courtRoomId;
          $scope.param.cbrId = $scope.selectRow.cbrId;
        }
        $scope.param.checkCaseResult = 1;
        $scope.load();
      }, 30);
      // $scope.param.courtId =

      $(".select_c_box_case,.select_box_cbr,.select_box_room").css({
        display: "inline-block"
      });
      $(".select_c_box_court").css("marginTop", "15px");
      // getTbaleJsonList(columnsCase,$scope.param);
    };

    yuejuanClick = function(id) {
      window.open(
        serverIp +
          "/viewer/model/common_filespreview/page.html?zjflag=true&caseInfoId=" +
          id
      );
      // setTimeout(function() {
      //   yuejuanParm.courtId = $scope.param.courtId;
      //   yuejuanParm.checkCaseResult = $scope.selectRow.checkCaseResult;
      //   window.open(
      //     "/zjview/pages/filespreview/page.html?zjflag=true&caseId=" +
      //       id +
      //       "&courtId=" +
      //       yuejuanParm.courtId +
      //       "&checkCaseResult=" +
      //       yuejuanParm.checkCaseResult
      //   );
      // }, 50);
    };
    pizhuClick = function() {
      $scope.layerfunTreeAdd = layer.open({
        type: 1,
        title: "请输入批注内容",
        area: ["330px", "180px"],
        skin: "layui-layer-rim",
        content: $("#pizhuForm"),
        scrollbar: false
      });
    };
    heshiClick = function() {
      $scope.layerfunTreeAdd = layer.open({
        type: 1,
        title: "核实",
        area: ["320px", "280px"],
        skin: "layui-layer-rim",
        content: $("#heshiForm"),
        scrollbar: false
      });
    };
    $scope.hegeStateTextList = [
      {
        name: "合格",
        id: 0
      },
      {
        name: "不合格",
        id: 1
      }
    ];
    $scope.selHeshiMsgList = [
      {
        name: "已上传",
        id: 1
      },
      {
        name: "已修正",
        id: 2
      },
      {
        name: "系统判定错误",
        id: 3
      },
      {
        name: "其他",
        id: 4
      }
    ];

    $scope.selHeshiMsg = function(item) {
      $scope.selHeshiMsgText = item.name;
    };
    $scope.hegeState = function(item) {
      $scope.hegeStateText = item.name;
    };
    $scope.pizhuMsgText = "";
    $scope.savePizhu = function() {
      if ($scope.pizhuMsgText == "") {
        layer.msg("批注内容不能为空", { offset: ["325px", "780px"] });
        return;
      }
      var pzParam = {
        courtId: $scope.param.courtId,
        caseId: $scope.selectRow.caseId,
        dealCaseMessage: $scope.pizhuMsgText
      };
      services._getDealCaseMessage(pzParam).success(function(res) {
        if (res.code == 0) {
          layer.msg("批注成功", { offset: ["325px", "780px"] });
          $scope.load();
        } else {
          layer.msg("批注 ", { offset: ["325px", "780px"] });
        }
      });
      layer.closeAll();
    };
    $scope.cancelpizhu = function() {
      layer.close($scope.layerfunTreeAdd);
      $scope.layerfunTreeAdd = null;
    };
    $scope.saveHeshi = function() {
      $scope.param.courtId;
      var paramHs = {
        courtId: $scope.param.courtId,
        caseId: $scope.selectRow.caseId
      };
      if ($scope.hegeStateText == "不合格") {
        layer.msg("该案件状态已为不合格", { offset: ["325px", "780px"] });
        return;
      }

      services._getCheckCaseResult(paramHs).success(function(res) {
        if (res.code == 0) {
          layer.msg("核实成功", { offset: ["325px", "780px"] });
          $scope.load();
        } else {
          layer.msg("核实 ", { offset: ["325px", "780px"] });
        }
      });
      layer.closeAll();
    };
    $scope.cancelSaveHeshir = function() {
      layer.closeAll();
    };
    initTable = function(columns) {
      $("#yichuli-table").datagrid({
        // $("#daichuli-top-table").datagrid({
        columns: columns,
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
          // console.log($scope.selectRow);
        }
      });
    };
    initTable0 = function() {
      $("#daying-table").datagrid({
        // $("#daichuli-top-table").datagrid({
        columns: columnsDaying,
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
          // console.log($scope.selectRow);
        }
      });
    };
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
        $scope.paramInit.courts_name.push(court_name);
        if ($scope.paramInit.courts_text == "全部地区") {
          $scope.paramInit.courts_text = "";
          $scope.paramInit.courts_name = [];
          $scope.paramInit.courts_id = [];
        }

        $scope.paramInit.courts_text =
          $scope.paramInit.courts_text + court_name;
        $("#fayuan_input").val($scope.paramInit.courts_text);
        $("#fayuan_input_case").val($scope.paramInit.courts_text);
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
        if ($scope.paramInit.courts_text == "全部地区") {
          $scope.paramInit.courts_text = "";
          $scope.paramInit.courts_name = [];
          $scope.paramInit.courts_id = [];
        }
        $scope.paramInit.courts_text =
          $scope.paramInit.courts_text +
          "、" +
          $(this)
            .parent()
            .text();
        $("#fayuan_input").val($scope.paramInit.courts_text);
        $("#fayuan_input_case").val($scope.paramInit.courts_text);
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
        $("#fayuan_input").val($scope.paramInit.courts_text);
        $("#fayuan_input_case").val($scope.paramInit.courts_text);
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
        console.log($(this)[0].title);
      } else {
        $(this)
          .siblings("input")
          .prop("checked", false);
        console.log($(this)[0].title);
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
    $(".left_box_menu li").click(function() {
      var index = $(this).index();
      $(".left_box_menu li").removeClass("active");
      $(".left_box_menu li")
        .eq(index)
        .addClass("active");
      if (index == 0) {
        $(".zlcx-list-export").show();
        // $(".zlcx-list-print").show();
        $(".case-list-export").hide();
        // $(".case-list-print").hide();
        initFlag = 2;
        $("#myPager").hide();
        $("#fayuan_input").val("全部地区");
        $(".t_content").css({
          height: "6500px"
        });
        $(
          ".select_c_box_case,.select_box_room,.select_box_cbr,.tingshi_text,.faguan_text"
        ).hide();
        $(".select_c_box_court").css("marginTop", "40px");
        $(".init_fayuan").css({
          display: "inline-block"
        });
        $(".case_fayuan").hide();
        // getTbaleJsonList(columnsCourts, $scope.paramInit);
        // window.location.reload();
      } else if (index == 1) {
        $(".top_search").addClass("r_60");
        $(".zlcx-list-export").hide();
        // $(".zlcx-list-print").hide();
        $(".case-list-export").show();
        $(".r_content_tool ").css({
          height: "60px"
        });
        // $(".case-list-print").show();
        initFlag = 2;
        $(".fayuan_text").val(rootUserInfo.courtName);
        $("#fayuan_input_case").val(rootUserInfo.courtName);
        $scope.getAllRoomsByCourtId(rootUserInfo.courtId);
        $("#myPager").show();
        // $scope.getUserInfo();
        if (rootMenuArr[0] == 1) {
          $scope.param = {
            courtId: rootUserInfo.courtId,
            courtRoomId: "",
            cbrId: "",
            caseTypeId: "",
            spcxId: "",
            caseStatus: "",
            checkCaseResult: "",
            caseName: "",
            queryAreaFlag: false,
            checkCaseMessageFlag: true,
            // laDateStart: thisMonthFirsrDay,
            laDateStart: "2017-01-01",
            laDateEnd: todayTime,
            currentPage: 1,
            pageSize: 10
          };
          $scope.getAllCourtList();
          $("#tz_input").val("全部庭室");
          $scope.getAllRoomsByCourtId(rootUserInfo.courtId);
        } else if (rootMenuArr[0] == 2) {
          $scope.param = {
            courtId: rootUserInfo.courtId,
            courtRoomId: "",
            cbrId: "",
            caseTypeId: "",
            spcxId: "",
            caseStatus: "",
            checkCaseResult: "",
            caseName: "",
            queryAreaFlag: false,
            checkCaseMessageFlag: true,
            // laDateStart: thisMonthFirsrDay,
            laDateStart: "2017-01-01",
            laDateEnd: todayTime,
            currentPage: 1,
            pageSize: 10
          };
          $scope.courtList = [rootUserInfo.courtName];
          $scope.getAllRoomsByCourtId(rootUserInfo.courtId);
          $("#fayuan_input").val(rootUserInfo.courtName);
          $scope.paramInit.queryFlag = 1;
          getTbaleJsonList(columnsRooms, $scope.paramInit);
          $(".select_box_room,.tingshi_text").css({
            display: "inline-block"
          });
        } else if (rootMenuArr[0] == 3) {
          $scope.param = {
            courtId: rootUserInfo.courtId,
            courtRoomId: rootUserInfo.courtRoomId,
            cbrId: "",
            caseTypeId: "",
            spcxId: "",
            caseStatus: "",
            checkCaseResult: "",
            caseName: "",
            queryAreaFlag: false,
            checkCaseMessageFlag: true,
            // laDateStart: thisMonthFirsrDay,
            laDateStart: "2017-01-01",
            laDateEnd: todayTime,
            currentPage: 1,
            pageSize: 10
          };
          $scope.courtList = [rootUserInfo.courtName];
          $scope.allRoomsList = [rootUserInfo.courtRoomName];
          var ccbrparam = {
            courtId: rootUserInfo.courtId,
            courtRoomId: rootUserInfo.courtRoomId
          };
          $("#fayuan_input").val(rootUserInfo.courtName);
          $("#tz_input").val(rootUserInfo.courtRoomName);
          $scope.getCbrList(ccbrparam);
          $scope.paramInit.courtRoomIdStrings = rootUserInfo.courtRoomId;
          $scope.paramInit.queryFlag = 2;
          getTbaleJsonList(columnscbr, $scope.paramInit);
          $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
            display: "inline-block"
          });
        } else if (rootMenuArr[0] == 4) {
          $scope.param = {
            courtId: rootUserInfo.courtId,
            courtRoomId: rootUserInfo.courtRoomId,
            cbrId: rootUserInfo.userCode,
            caseTypeId: "",
            spcxId: "",
            caseStatus: "",
            checkCaseResult: "",
            caseName: "",
            queryAreaFlag: false,
            checkCaseMessageFlag: true,
            // laDateStart: thisMonthFirsrDay,
            laDateStart: "2017-01-01",
            laDateEnd: todayTime,
            currentPage: 1,
            pageSize: 10
          };
          $scope.allCbrList = [
            {
              userFullName: rootUserInfo.userFullName,
              userCode: rootUserInfo.userCode
            }
          ];
          $("#fayuan_input").val(rootUserInfo.courtName);
          $("#tz_input").val(rootUserInfo.courtRoomName);
          $("#cbr_name").val(rootUserInfo.userFullName);
          $(".faguan_text").text(rootUserInfo.userFullName);
          $scope.paramInit.queryFlag = 2;
          // getTbaleJsonList(columnscbr, $scope.paramInit);
          $(".select_box_cbr,.select_box_room,.tingshi_text,.faguan_text").css({
            display: "inline-block"
          });
        }
        // $scope.load();
        $(".t_content").css({
          height: "550px"
        });
        $("#cbr_name,.cbr_name-addon").click(function() {
          if (
            $scope.param.courtRoomIdStrings == "" ||
            $scope.namesList.roomName == "全部庭室" ||
            $("#tz_input").val() == "全部庭室"
          ) {
            layer.msg("请先选择所属庭室", { offset: ["325px", "780px"] });
          }
        });
        $("#spcx_input,.spcx_input-addon").click(function() {
          if ($scope.param.caseTypeId == "") {
            layer.msg("请先选择案件类型", { offset: ["325px", "780px"] });
          }
        });
        // $(".tingshi_text").text("全部庭室");
        // $(".faguan_text").text("全部法官");
        $(
          ".select_c_box_case,.select_box_room,.select_box_cbr,.tingshi_text,.faguan_text"
        ).css({
          display: "inline-block"
        });
        $(".select_c_box_court").css("marginTop", "15px");
        $(".case_fayuan").css({
          display: "inline-block"
        });
        $(".init_fayuan").hide();
        // getTbaleJsonList(columnsCaseCode);
      }
    });
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
      $scope.selectItemClick = function(item) {
        $(".selectInput").val(item.courtName);
        $scope.param.courtId = item.courtId;
        $scope.param.courtRoomId = "";
        $scope.param.cbrId = "";
        $scope.paramInit.courtIdStrings = item.courtId;
        $scope.paramInit.courtRoomIdStrings = "";
        $scope.paramInit.cbrIdStrings = "";
        $("#tz_input").val("全部庭室");
        $("#cbr_name").val("全部法官");
        $scope.getAllRoomsByCourtId(item.courtId);
        $("#courtList").hide();
      };
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
  });
});
