var initFailCaesLIst;
var timer1 = null;
var timer2 = null;
var courtClick;
var rootMenuArr = [];
var rootUserInfo = {};
var userInfoObj = {};
var showMenusArr = [];
var court_obj = {};
var courtParam = {
  courtId: ""
};
var courtParamArr = [];
var initUserInfo = {};
var allCourts = {
  courtId: "",
  courtName: "全部法院",
  children: []
};
xcPiedatas = {
  names: [],
  source: []
};
xcChart8datas = {
  times: [],
  allCaseNum: [],
  upLoadCaseNum: [],
  passCaseCount: []
};
byChart6datas = {
  times: [],
  allCaseNum: [],
  upLoadCaseNum: [],
  passCaseCount: []
};
tzChart4datas = {
  times: [],
  allCaseNum: [],
  upLoadCaseNum: [],
  passCaseCount: []
};
fgChart1datas = {
  times: [],
  allCaseNum: [],
  upLoadCaseNum: [],
  passCaseCount: []
};
byPiedatas = {
  names: [],
  source: []
};
tzPiedatas = {
  names: [],
  source: []
};
var xcChart1Datas = [];
var byChart1Datas = [];
var byChart1DatasMore = [];
var tzChart1Datas = [];
var tzChart1DatasMore = [];
var xcChart2Datas = [
  { value: 0, name: "上传案件数量" },
  { value: 0, name: "未上传案件数量" }
];
var byChart2Datas = [
  { value: 0, name: "上传案件数量" },
  { value: 0, name: "未上传案件数量" }
];
var xcChart6Datas = [
  { value: 0, name: "合格数量" },
  { value: 0, name: "不合格数量" }
];
var byChart3Datas = [
  { value: 0, name: "合格数量" },
  { value: 0, name: "不合格数量" }
];
var fgChart2Datas = [
  { value: 0, name: "合格数量" },
  { value: 0, name: "不合格数量" }
];
var fgChart4Datas = [];
var xccityDatasChatr3 = {
  cityNames: [],
  citySource: []
};
var xccityDatasChatr7 = {
  cityNames: [],
  citySource: []
};
var xcBuHeGeDatas = [];
var xcBuHeGeCaseDatas = [];
var courtSliderStr = "";
var insertStr = (soure, start, newStr) => {
  return soure.slice(0, start) + newStr + soure.slice(start);
};
var caseNameClick;
var cbrCaseNameClick;
Array.prototype.removeItem = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
myControllers.controller("appController", function(
  $rootScope,
  $scope,
  services,
  $window,
  $location
) {
  services._isUserlogic().success(function(res) {
    if (res.code == "0") {
      $rootScope.userInfo = res.data;
      // //将用户信息存储在sessionStorage中
      //   var rootUserInfo = res.data;
      //   var rootUserInfoStr = JSON.stringify(rootUserInfo); //转换json
      //   sessionStorage.rootUserInfo = rootUserInfoStr;
      //   //$scope.goMenu();
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
        if (rootMenuArr[0] == 2) {
          $(".J_iframe", parent.document).css({
            height: "1370px"
          });
        } else if (rootMenuArr[0] == 3) {
          $(".J_iframe", parent.document).css({
            height: "1125px"
          });
        } else if (rootMenuArr[0] == 4) {
          $(".J_iframe", parent.document).css({
            height: "1135px"
          });
        }
      } else {
        // layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
        // services._userlogic({ type: "logout" }).success(function(res) {
        //   if (window.top != window.self) {
        //     top.location.href = $rootScope.ctxPath + "login.html";
        //   }
        // });
      }
    } else {
      window.location.href = "./login.html";
    }
  });
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

  //从sessionStorage中获取用户的类型
  $scope.caseInfoShow = false;
  $scope.shijiaoShow = true;
  $scope.param = {
    courtIdStrings: "",
    courtRoomIdStrings: "",
    cbrIdStrings: "",
    queryFlag: "",
    indexFlag: 1,
    // laDateStart: thisMonthFirsrDay,
    laDateStart: "2017-01-01",
    laDateEnd: todayTime
  };
  $scope.byparam = {
    courtIdStrings: "",
    courtRoomIdStrings: "",
    cbrIdStrings: "",
    queryFlag: 1,
    indexFlag: 1,
    // laDateStart: thisMonthFirsrDay,
    laDateStart: "2017-01-01",
    laDateEnd: todayTime
  };
  $scope.tzparam = {
    courtIdStrings: "",
    courtRoomIdStrings: "",
    cbrIdStrings: "",
    queryFlag: 2,
    indexFlag: 1,
    // laDateStart: thisMonthFirsrDay,
    laDateStart: "2017-01-01",
    laDateEnd: todayTime
  };
  $scope.pieparam = {
    courtId: "",
    courtRoomId: "",
    cbrId: "",
    flag: false,
    laDateStart: "2017-01-01",
    laDateEnd: todayTime
  };
  $scope.chatr8param = {
    courtId: "",
    courtRoomId: "",
    cbrId: "",
    flag: false
  };
  $scope.fgChart4Param = {
    courtId: "",
    cbrId: ""
  };
  $scope.xcTop10ZhizuoDatas = [];
  $scope.xcTop10JuanzongDatas = [];
  $scope.xctongjiData = {};
  $scope.initXcChart5Data = {
    names: [],
    source: []
  };
  $scope.initByChart5Data = {
    names: [],
    source: []
  };
  $scope.initTzChart3Data = {
    names: [],
    source: []
  };
  $scope.initFgChart3Data = {
    names: [],
    source: []
  };

  $scope.byTop10ZhizuoDatas = [];
  $scope.byTop10JuanzongDatas = [];
  $scope.tzTop10ZhizuoDatas = [];
  $scope.tzTop10JuanzongDatas = [];
  //  获取登录信息

  services._isUserlogic().success(function(res) {
    if (res.code == "0") {
      $rootScope.userInfo = res.data;
      showMenusArr = $rootScope.userInfo.roleMenus;
      if (
        $rootScope.userInfo.userCode == null ||
        $rootScope.userInfo.userCode == ""
      ) {
        $(".t_ul_menu li:nth-child(4)").remove();
      }
      if (
        showMenusArr.join().indexOf("1") == -1 &&
        showMenusArr.join().indexOf("2") == -1 &&
        showMenusArr.join().indexOf("3") == -1 &&
        showMenusArr.join().indexOf("4") == -1
      ) {
        layer.msg("没有查看权限", { offset: ["325px", "780px"] });
        return;
      }
      var minNumM;
      for (var i = 0; i < showMenusArr.length; i++) {
        for (var j = i; j < showMenusArr.length; j++) {
          if (showMenusArr[i] > showMenusArr[j]) {
            minNumM = showMenusArr[j];
            showMenusArr[j] = showMenusArr[i];
            showMenusArr[i] = minNumM;
          }
        }
      }
      courtParam.courtId = $rootScope.userInfo.courtId;
      $scope.getAllCourtList(courtParam);
      var showIndex = showMenusArr[0] - 1;
      $("body .shijiao-boxs >div")
        .eq(showIndex)
        .show();
      for (var index0 = 0; index0 < AllMenusArrNum.length; index0++) {
        var element = AllMenusArrNum[index0];
        if ($.inArray(element, showMenusArr) == -1) {
          hideMenuArr.push(element);
        }
      }
      for (var i = 0; i < showMenusArr.length; i++) {
        var e = showMenusArr[i] - 1;
        $(".chshj_t_ul_menu li")
          .eq(e)
          .show();
        $(".by_t_ul_menu li")
          .eq(e)
          .show();
        $(".tz_t_ul_menu li")
          .eq(e)
          .show();
        $(".fg_t_ul_menu li")
          .eq(e)
          .show();
      }
      // $scope.param.courtIdStrings = $rootScope.userInfo.courtId;
    } else {
      window.location.href = "./login.html";
    }
  });

  $scope.initXcChart5 = function() {
    $scope.initXcChart5Data = {
      names: [],
      source: []
    };
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        var paramT5 = {
          courtId: res.data.courtId
        };

        //获取问题分布统计
        services._getIssueStatistic(paramT5).success(function(res) {
          if (res.code == 0) {
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              $scope.initXcChart5Data.names.push(element.issueName);
              $scope.initXcChart5Data.source.push(element.count);
            }
            drawChart5($scope.initXcChart5Data);
          } else {
            layer.msg("未获取到相关问题分布统计", {
              offset: ["325px", "780px"]
            });
          }
        });
      }
    });
  };
  $scope.initByChart5 = function() {
    $scope.initByChart5Data = {
      names: [],
      source: []
    };
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        var paramT5 = {
          courtId: res.data.courtId,
          flag: true
        };
        services._getIssueStatistic(paramT5).success(function(res) {
          if (res.code == 0) {
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              $scope.initByChart5Data.names.push(element.issueName);
              $scope.initByChart5Data.source.push(element.count);
            }
            bydrawChart5($scope.initByChart5Data);
          } else {
            layer.msg("未获取到相关问题分布统计", {
              offset: ["325px", "780px"]
            });
          }
        });
      }
    });
  };

  $scope.initTzChart3 = function() {
    $scope.initTzChart3Data = {
      names: [],
      source: []
    };
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        var paramT5 = {
          courtId: res.data.courtId,
          courtRoomId: res.data.courtRoomId,
          flag: true
        };
        services._getIssueStatistic(paramT5).success(function(res) {
          if (res.code == 0) {
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              $scope.initTzChart3Data.names.push(element.issueName);
              $scope.initTzChart3Data.source.push(element.count);
            }
            tzdrawChart3($scope.initTzChart3Data);
          } else {
            layer.msg(" 未获取到相关问题分布统计", {
              offset: ["325px", "780px"]
            });
          }
        });
      }
    });
  };

  $scope.initFgChart3 = function() {
    $scope.initFgChart3Data = {
      names: [],
      source: []
    };
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        var paramT5 = {
          courtId: res.data.courtId,
          courtRoomId: res.data.courtRoomId,
          cbrId: res.data.cbrId,
          flag: true
        };
        services._getIssueStatistic(paramT5).success(function(res) {
          if (res.code == 0) {
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              $scope.initFgChart3Data.names.push(element.issueName);
              $scope.initFgChart3Data.source.push(element.count);
            }
            fgdrawChart3($scope.initFgChart3Data);
          } else {
            layer.msg(" 未获取到相关问题分布统计", {
              offset: ["325px", "780px"]
            });
          }
        });
      }
    });
  };
  $scope.initXcChart5();
  $scope.initByChart5();
  $scope.initTzChart3();
  $scope.initFgChart3();
  $scope.initDatas = function() {
    if (
      $("#fayuan_input").val() == "全部法院" ||
      $("#fayuan_input").val() == ""
    ) {
      $scope.param.courtIdStrings = "";
      $scope.param.queryFlag = "";
    } else {
      $scope.param.queryFlag = 0;
    }
    $scope.xctongjiData = {};
    xcChart1Datas = [];
    xcBuHeGeDatas = [];
    xcChart2Datas = [
      { value: 0, name: "上传案件数量" },
      { value: 0, name: "未上传案件数量" }
    ];
    xcChart6Datas = [
      { value: 0, name: "合格数量" },
      { value: 0, name: "不合格数量" }
    ];
    xccityDatasChatr3 = {
      cityNames: [],
      citySource: []
    };
    xccityDatasChatr7 = {
      cityNames: [],
      citySource: []
    };
    $scope.fanhui = function() {
      $(".J_iframe", parent.document).css({
        height: "1745px"
      });
      window.location.reload();
    };
    $scope.param.indexFlag = 1;
    $scope.load = function() {
      $scope.param.checkCaseResult = 1;
      services._getCaseInfoList($scope.param).success(function(res) {
        if (res.code == 0 && res.data.length > 0) {
          $("#caseList-table").datagrid({
            // $("#daichuli-top-table").datagrid({
            columns: [
              [
                {
                  field: "caseName",
                  title: "案号",
                  width: "13%",
                  align: "center"
                },
                {
                  field: "caseTypeName",
                  title: "案件类型",
                  width: "5%",
                  align: "center"
                },
                {
                  field: "spcxName",
                  title: "审判程序",
                  width: "5%",
                  align: "center"
                },
                {
                  field: "courtName",
                  title: "经办法院",
                  width: "12%",
                  align: "center"
                },
                {
                  field: "courtRoomName",
                  title: "庭室",
                  width: "5%",
                  align: "center"
                },
                {
                  field: "cbrName",
                  title: "承办人",
                  width: "5%",
                  align: "center"
                },
                {
                  field: "caseStatus",
                  title: "案件阶段",
                  width: "5%",
                  align: "center",
                  hidden: false,
                  formatter: function(value, row, index) {
                    if (row.caseStatus == "1") {
                      var result = "<span>新移送</span>";
                    } else if (row.caseStatus == "2") {
                      result = "<span>立案登记</span>";
                    } else if (row.caseStatus == "3") {
                      result = "<span>立案审查</span>";
                    } else if (row.caseStatus == "4") {
                      result = "<span>立案审批</span>";
                    } else if (row.caseStatus == "5") {
                      result = "<span>等待分派</span>";
                    } else if (row.caseStatus == "6") {
                      result = "<span>等待确认</span>";
                    } else if (row.caseStatus == "7") {
                      result = "<span>正在审理</span>";
                    } else if (row.caseStatus == "8") {
                      result = "<span>立案待结</span>";
                    } else if (row.caseStatus == "9") {
                      result = "<span>结案报批</span>";
                    } else if (row.caseStatus == "10") {
                      result = "<span>已经结案</span>";
                    } else if (row.caseStatus == "11") {
                      result = "<span>已经归档</span>";
                    } else {
                      result = "<span>--</span>";
                    }
                    return result;
                  }
                },
                {
                  field: "uploadIndex",
                  title: "上传批次",
                  width: "5%",
                  align: "center",
                  hidden: false
                },
                {
                  field: "totalFileNum",
                  title: "页数",
                  width: "5%",
                  align: "center",
                  hidden: false
                },
                {
                  field: "checkCaseResult",
                  title: "是否合格",
                  width: "5%",
                  align: "center",
                  hidden: false,
                  formatter: function(value, row, index) {
                    if (row.checkCaseResult == "1") {
                      var result = "<span style='color:#e92322'>不合格</span>";
                    } else if (row.checkCaseResult == "0") {
                      result = "<span>合格</span>";
                    } else {
                      result = "<span>--</span>";
                    }
                    return result;
                  }
                },
                {
                  field: "failReason",
                  title: "不合格原因",
                  width: "12%",
                  align: "center",
                  hidden: false
                },
                {
                  field: "dealCaseMessage",
                  title: "批注内容",
                  width: "12%",
                  align: "center",
                  hidden: false
                },
                {
                  field: "detail",
                  title: "操作",
                  width: "15%",
                  align: "center",
                  hidden: true,
                  formatter: function(value, row, index) {
                    //function里面的三个参数代表当前字段值，当前行数据对象，行号
                    if (row.caseId) {
                      var str =
                        "<span class='con-code-ico' onclick=\"yuejuanClick('" +
                        row.caseId +
                        "')\">阅卷 </span>";
                      str +=
                        "<span class='con-code-ico' onclick=\"pizhuClick('" +
                        row.caseId +
                        "')\">批注 </span>";
                      if (row.checkCaseResult == 1) {
                        str +=
                          "<span class='con-code-ico' onclick=\"heshiClick('" +
                          row.caseId +
                          "')\">核实</span>";
                      }
                      return str;
                    }
                  }
                }
              ]
            ],
            data: res.data,
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
          if ($scope._myPagerSetPager) {
            $scope._myPagerSetPager($scope.param, res);
          }
        } else {
          $("#caseList-table").datagrid({
            // $("#daichuli-top-table").datagrid({
            columns: [
              [
                {
                  field: "caseName",
                  title: "案号",
                  width: "12%",
                  align: "center"
                },
                {
                  field: "caseTypeName",
                  title: "案件类型",
                  width: "5%",
                  align: "center"
                },
                {
                  field: "spcxName",
                  title: "审判程序",
                  width: "5%",
                  align: "center"
                },
                {
                  field: "courtName",
                  title: "经办法院",
                  width: "12%",
                  align: "center"
                },
                {
                  field: "courtRoomName",
                  title: "庭室",
                  width: "6%",
                  align: "center"
                },
                {
                  field: "cbrName",
                  title: "承办人",
                  width: "4%",
                  align: "center"
                },
                {
                  field: "caseStatus",
                  title: "案件阶段",
                  width: "7%",
                  align: "center",
                  hidden: false,
                  formatter: function(value, row, index) {
                    if (row.caseStatus == "1") {
                      var result = "<span>新移送</span>";
                    } else if (row.caseStatus == "2") {
                      result = "<span>立案登记</span>";
                    } else if (row.caseStatus == "3") {
                      result = "<span>立案审查</span>";
                    } else if (row.caseStatus == "4") {
                      result = "<span>立案审批</span>";
                    } else if (row.caseStatus == "5") {
                      result = "<span>等待分派</span>";
                    } else if (row.caseStatus == "6") {
                      result = "<span>等待确认</span>";
                    } else if (row.caseStatus == "7") {
                      result = "<span>正在审理</span>";
                    } else if (row.caseStatus == "8") {
                      result = "<span>立案待结</span>";
                    } else if (row.caseStatus == "9") {
                      result = "<span>结案报批</span>";
                    } else if (row.caseStatus == "10") {
                      result = "<span>已经结案</span>";
                    } else if (row.caseStatus == "11") {
                      result = "<span>已经归档</span>";
                    } else {
                      result = "<span>--</span>";
                    }
                    return result;
                  }
                },
                {
                  field: "uploadIndex",
                  title: "上传批次",
                  width: "4%",
                  align: "center",
                  hidden: false
                },
                {
                  field: "totalFileNum",
                  title: "页数",
                  width: "4%",
                  align: "center",
                  hidden: false
                },
                {
                  field: "checkCaseResult",
                  title: "是否合格",
                  width: "5%",
                  align: "center",
                  hidden: false,
                  formatter: function(value, row, index) {
                    if (row.checkCaseResult == "1") {
                      var result = "<span style='color:#e92322'>不合格</span>";
                    } else if (row.checkCaseResult == "0") {
                      result = "<span>合格</span>";
                    } else {
                      result = "<span>--</span>";
                    }
                    return result;
                  }
                },
                {
                  field: "failReason",
                  title: "不合格原因",
                  width: "12%",
                  align: "center",
                  hidden: false
                },
                {
                  field: "dealCaseMessage",
                  title: "批注内容",
                  width: "9%",
                  align: "center",
                  hidden: false
                },
                {
                  field: "detail",
                  title: "操作",
                  width: "15%",
                  align: "center",
                  formatter: (value, row, index) => {
                    //function里面的三个参数代表当前字段值，当前行数据对象，行号
                    if (row.caseId) {
                      var str =
                        "<span class='con-code-ico' onclick=\"yuejuanClick('" +
                        row.caseId +
                        "')\">阅卷 </span>";
                      str +=
                        "<span class='con-code-ico' onclick=\"pizhuClick('" +
                        row.caseId +
                        "')\">批注 </span>";
                      if (row.checkCaseResult == 1) {
                        str +=
                          "<span class='con-code-ico' onclick=\"heshiClick('" +
                          row.caseId +
                          "')\">核实</span>";
                      }
                      return str;
                    }
                  }
                }
              ]
            ],
            data: [],
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
          layer.msg("未获取到相关案件列表", { offset: ["325px", "780px"] });
          if ($scope._myPagerSetPager) {
            $scope.param.currentPage = "";
            $scope._myPagerSetPager($scope.param, res);
          }
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
        // $scope.getAllRoomsByCourtId(item.courtId);
        $scope.load();
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
    services._getAllIndexDatas($scope.param).success(function(res) {
      if (res.code == 0) {
        //左侧统计
        var linshiDatas;
        var dataI = res.data.length - 1;
        $scope.xctongjiData = res.data[dataI];
        // getTongjiDtads(xctongjiData);
        //chart1
        linshiDatas = res.data;
        linshiDatas.splice(dataI, 1);
        for (let index = 0; index < linshiDatas.length; index++) {
          const element = linshiDatas[index];
          if ($scope.param.courtIdStrings == "") {
            xcChart1Datas[index] = {
              product: element.areaName,
              总案件量: element.caseCount,
              制作数量: element.uploadCaseCount,
              合格数量: element.passCaseCount,
              areaId: element.areaId
            };
            xcBuHeGeDatas[index] = {
              name: element.areaName,
              value: element.unPassCaseCount,
              id: element.areaId
            };
          } else {
            xcChart1Datas[index] = {
              product: element.courtName,
              总案件量: element.caseCount,
              制作数量: element.uploadCaseCount,
              合格数量: element.passCaseCount,
              areaId: element.areaId
            };
            xcBuHeGeDatas[index] = {
              name: element.courtName,
              value: element.unPassCaseCount,
              id: element.areaId
            };
          }
          if (index < 10) {
            if ($scope.param.courtIdStrings == "") {
              $scope.xcTop10ZhizuoDatas[index] = {
                name: element.areaName,
                value: element.uploadCaseCount
              };
            } else {
              $scope.xcTop10ZhizuoDatas[index] = {
                name: element.courtName,
                value: element.uploadCaseCount
              };
            }
          }
          if ($scope.param.courtIdStrings == "") {
            xccityDatasChatr7.cityNames.push(element.areaName);
          } else {
            xccityDatasChatr7.cityNames.push(element.courtName);
          }
          xccityDatasChatr7.citySource.push(element.uploadCaseCount);
          if ($scope.param.courtIdStrings == "") {
            xccityDatasChatr3.cityNames.push(element.areaName);
          } else {
            xccityDatasChatr3.cityNames.push(element.courtName);
          }
          xccityDatasChatr3.citySource.push(element.uploadCaseCount);
        }
        xccityDatasChatr3.cityNames.reverse()
        xccityDatasChatr3.citySource.reverse()
        xccityDatasChatr7.cityNames.reverse()
        xccityDatasChatr7.citySource.reverse()
        $scope.ckqbCourtId = xcBuHeGeDatas[0].id;
        courtClick = function(id) {
          $scope.ckqbCourtId = id;
          // window.open("../caseInfo/page.html");
          clearInterval(timer2);
          initFailCaesLIst(id);
        };

        $scope.ckquanbu = function() {
          window.open("../shyezhlchx/page.html?courtId="+$scope.ckqbCourtId+"&source=3");
          // $scope.shijiaoShow = false;
          // $scope.caseInfoShow = true;
          // $scope.param.courtId = $scope.ckqbCourtId;
          // $scope.param.currentPage = 1;
          // $scope.param.pageSize = 10;
          // $scope.param.checkCaseMessageFlag = true;
          // $("body,html", parent.document).animate(
          //   {
          //     scrollTop: 0
          //   },
          //   50
          // );
          // $(".J_iframe", parent.document).css({
          //   height: "745px"
          // });
          // $scope.load();
        };

        $scope.fgckquanbu = function() {
          window.open("../shyezhlchx/page.html?courtId="+rootUserInfo.courtId+"&courtRoomId="+rootUserInfo.courtRoomId+"&cbrId="+rootUserInfo.userCode+"&source=4");
          // $scope.shijiaoShow = false;
          // $scope.caseInfoShow = true;
          // $scope.param.courtId = rootUserInfo.courtId;
          // $scope.param.courtRoomId = rootUserInfo.courtRoomId;
          // $scope.param.cbrId = rootUserInfo.userCode;
          // $scope.param.currentPage = 1;
          // $scope.param.pageSize = 10;
          // $scope.param.checkCaseMessageFlag = true;
          // $(".case_fayuan").hide();
          // $("body,html", parent.document).animate(
          //   {
          //     scrollTop: 0
          //   },
          //   50
          // );
          // $(".J_iframe", parent.document).css({
          //   height: "745px"
          // });
          // $scope.load();
        };

        getCourtSliderUlStr();
        drawChart1(xcChart1Datas, $scope.param);
        //chart3
        drawChart3(xccityDatasChatr3);
        drawChart7(xccityDatasChatr7);
        //chart2
        xcChart2Datas[0].value = $scope.xctongjiData.totalUploadCaseCount;
        xcChart2Datas[1].value = $scope.xctongjiData.totalUnUploadCaseCount;
        drawChart2(xcChart2Datas);
        //chart6
        xcChart6Datas[0].value = $scope.xctongjiData.totalPassCaseCount;
        xcChart6Datas[1].value = $scope.xctongjiData.totalUnPassCaseCount;
        drawChart6(xcChart6Datas);
      } else {
        layer.msg(" 未获取到相关问题分布统计", { offset: ["325px", "780px"] });
      }
    });
    $scope.chatr8param = {
      courtId: rootUserInfo.courtId,
      flag: false
    };
    services._getPieDatas($scope.pieparam).success(function(res) {
      if (res.code == 0) {
        var linshiDatas = res.data;
        for (let index = 0; index < linshiDatas.length; index++) {
          const element = linshiDatas[index];
          xcPiedatas.names.push(element.caseTypeName);
          xcPiedatas.source[index] = {
            value: element.uploadCaseCount,
            name: element.caseTypeName
          };
        }
        drawChart4(xcPiedatas);
      } else {
        layer.msg(" 未获取到相关案件类型分布信息", {
          offset: ["325px", "780px"]
        });
      }
    });
    xcChart8datas = {
      times: [],
      allCaseNum: [],
      upLoadCaseNum: [],
      passCaseCount: []
    };

    services._getCaseCountTrend($scope.chatr8param).success(function(res) {
      if (res.code == 0) {
        var linshiDatas = res.data;
        for (let index = 0; index < linshiDatas.length; index++) {
          const element = linshiDatas[index];
          element.months = insertStr(element.months, 4, "-");
          xcChart8datas.times.push(element.months);
          xcChart8datas.allCaseNum.push(element.caseCount);
          xcChart8datas.upLoadCaseNum.push(element.uploadCaseCount);
          xcChart8datas.passCaseCount.push(element.passCaseCount);
        }
        drawChart8(xcChart8datas);
      } else {
        layer.msg(" 未获取到相关年度趋势信息", { offset: ["325px", "780px"] });
      }
    });
  };
  // _getFailCaseInfoList
  $scope.initXcTop10JuanzongDatas = function() {
    $scope.param.indexFlag = 2;
    services._getAllIndexDatas($scope.param).success(function(res) {
      if (res.code == 0) {
        var linshiDatas = res.data;
        linshiDatas.splice(res.data.length - 1, 1);
        for (let index = 0; index < linshiDatas.length; index++) {
          const element = linshiDatas[index];
          if (index < 10) {
            if ($scope.param.courtIdStrings == "") {
              $scope.xcTop10JuanzongDatas[index] = {
                name: element.areaName,
                value: element.passCaseCount
              };
            } else {
              $scope.xcTop10JuanzongDatas[index] = {
                name: element.courtName,
                value: element.passCaseCount
              };
            }
          }
          // if ($scope.param.courtIdStrings == "") {
          //   xccityDatasChatr7.cityNames.push(element.areaName);
          // } else {
          //   xccityDatasChatr7.cityNames.push(element.courtName);
          // }
          // xccityDatasChatr7.citySource.push(element.uploadCaseCount);
        }
        // drawChart7(xccityDatasChatr7);
      } else {
        layer.msg(" 未获取到相关电子卷宗合格数量排行榜", {
          offset: ["325px", "780px"]
        });
      }
    });
  };
  $scope.byChart1Datas = function(param) {
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        if ($rootScope.userInfo.roleMenus.join().indexOf("2") != -1) {
          param.courtIdStrings = $rootScope.userInfo.courtId;
          $scope.chatr8param.courtId = $rootScope.userInfo.courtId;
        } else {
          return;
        }
        param.indexFlag = 0;
        services._getAllIndexDatas(param).success(function(res) {
          if (res.code == 0 && res.data.length > 0) {
            var linshiDatas = res.data;
            linshiDatas.splice(res.data.length - 1, 1);
            for (let index = 0; index < linshiDatas.length; index++) {
              const element = linshiDatas[index];
              byChart1DatasMore[index] = {
                product: element.courtRoomName,
                总案件量: element.caseCount,
                制作数量: element.uploadCaseCount,
                合格数量: element.passCaseCount
                // courtId: element.courtId
              };
              if (index < 10) {
                byChart1Datas[index] = {
                  product: element.courtRoomName,
                  总案件量: element.caseCount,
                  制作数量: element.uploadCaseCount,
                  合格数量: element.passCaseCount
                  // courtId: element.courtId
                };
              }
            }
            bydrawChart1(byChart1Datas);
            bydrawChart1More(byChart1DatasMore);
          } else {
            layer.msg(" 未获取到相关问题分布统计", {
              offset: ["325px", "780px"]
            });
          }
        });
        byChart6datas = {
          times: [],
          allCaseNum: [],
          upLoadCaseNum: [],
          passCaseCount: []
        };
        $scope.chatr8param = {
          courtId: rootUserInfo.courtId,
          flag: true
        };
        services._getCaseCountTrend($scope.chatr8param).success(function(res) {
          if (res.code == 0) {
            var linshiDatas = res.data;
            for (let index = 0; index < linshiDatas.length; index++) {
              const element = linshiDatas[index];
              element.months = insertStr(element.months, 4, "-");
              byChart6datas.times.push(element.months);
              byChart6datas.allCaseNum.push(element.caseCount);
              byChart6datas.upLoadCaseNum.push(element.uploadCaseCount);
              byChart6datas.passCaseCount.push(element.passCaseCount);
            }
            bydrawChart6(byChart6datas);
          } else {
            layer.msg(" 未获取到相关本院年度趋势统计");
          }
        });
      } else {
        layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
        services._userlogic({ type: "logout" }).success(function(res) {
          if (window.top != window.self) {
            top.location.href = $rootScope.ctxPath + "login.html";
          }
        });
      }
    });
  };
  $scope.getOtherInitData = function(param) {
    $scope.byTongjiData = {};
    byChart2Datas = [
      { value: 0, name: "上传案件数量" },
      { value: 0, name: "未上传案件数量" }
    ];
    byChart6Datas = [
      { value: 0, name: "合格数量" },
      { value: 0, name: "不合格数量" }
    ];
    param.indexFlag = 1;
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        param.indexFlag = 1;
        param.queryFlag = 2;
        if ($rootScope.userInfo.roleMenus.join().indexOf("2") != -1) {
          param.courtIdStrings = $rootScope.userInfo.courtId;
          $scope.pieparam.courtId = $rootScope.userInfo.courtId;
        } else {
          return;
        }
        services._getAllIndexDatas(param).success(function(res) {
          if (res.code == 0 && res.data.length > 0) {
            var datak = res.data.length - 1;
            $scope.byTongjiData = res.data[datak];
            var linshiDatas = res.data;
            linshiDatas.splice(res.data.length - 1, 1);
            for (let index = 0; index < linshiDatas.length; index++) {
              const element = linshiDatas[index];
              if (index < 10) {
                if (param.courtIdStrings == "") {
                  $scope.byTop10ZhizuoDatas[index] = {
                    name: element.cbrName,
                    value: element.uploadCaseCount
                  };
                } else {
                  $scope.byTop10ZhizuoDatas[index] = {
                    name: element.cbrName,
                    value: element.uploadCaseCount
                  };
                }
              }
            }

            //bychart2
            byChart2Datas[0].value = $scope.byTongjiData.totalUploadCaseCount;
            byChart2Datas[1].value = $scope.byTongjiData.totalUnUploadCaseCount;
            bydrawChart2(byChart2Datas);
            //bychart3
            byChart3Datas[0].value = $scope.byTongjiData.totalPassCaseCount;
            byChart3Datas[1].value = $scope.byTongjiData.totalUnPassCaseCount;
            //  totalUnUploadCaseCount
            bydrawChart3(byChart3Datas);
          } else {
            layer.msg(" 未获取到相关问题分布统计", {
              offset: ["325px", "780px"]
            });
          }
        });
        services._getPieDatas($scope.pieparam).success(function(res) {
          if (res.code == 0) {
            var lsDatas = res.data;
            for (let index = 0; index < lsDatas.length; index++) {
              const element = lsDatas[index];
              byPiedatas.names.push(element.caseTypeName);
              byPiedatas.source[index] = {
                value: element.caseCount,
                name: element.caseTypeName
              };
            }
            bydrawChart4(byPiedatas);
          } else {
            layer.msg(" 未获取到相关案件类型分布", {
              offset: ["325px", "780px"]
            });
          }
        });
      } else {
        layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
        services._userlogic({ type: "logout" }).success(function(res) {
          if (window.top != window.self) {
            top.location.href = $rootScope.ctxPath + "login.html";
          }
        });
      }
    });
  };
  $scope.initByTop10JuanzongDatas = function(param) {
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        if ($rootScope.userInfo.roleMenus.join().indexOf("2") != -1) {
          param.courtIdStrings = $rootScope.userInfo.courtId;
          param.indexFlag = 2;
          param.queryFlag = 2;
          services._getAllIndexDatas(param).success(function(res) {
            if (res.code == 0) {
              var linshiDatas = res.data;
              linshiDatas.splice(res.data.length - 1, 1);
              for (let index = 0; index < linshiDatas.length; index++) {
                const element = linshiDatas[index];
                if (index < 10) {
                  if ($scope.param.courtIdStrings == "") {
                    $scope.byTop10JuanzongDatas[index] = {
                      name: element.cbrName,
                      value: element.passCaseCount
                    };
                  } else {
                    $scope.byTop10JuanzongDatas[index] = {
                      name: element.cbrName,
                      value: element.passCaseCount
                    };
                  }
                }
              }
            } else {
              layer.msg(" 未获取到相关问题分布统计", {
                offset: ["325px", "780px"]
              });
            }
          });
        } else {
          return;
        }
      } else {
        layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
        services._userlogic({ type: "logout" }).success(function(res) {
          if (window.top != window.self) {
            top.location.href = $rootScope.ctxPath + "login.html";
          }
        });
      }
    });
  };
  $scope.getTzOtherInitDatasMore = function(param) {
    param.indexFlag = 0;
    $scope.tzTongjiData = {};
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        if ($rootScope.userInfo.roleMenus.join().indexOf("3") != -1) {
          param.courtIdStrings = $rootScope.userInfo.courtId;
          param.courtRoomIdStrings = $rootScope.userInfo.courtRoomId;
          $scope.pieparam.courtId = $rootScope.userInfo.courtId;
          $scope.pieparam.courtRoomId = $rootScope.userInfo.courtRoomId;
          $scope.chatr8param.courtRoomId = $rootScope.userInfo.courtRoomId;
        } else {
          return;
        }
        services._getAllIndexDatas(param).success(function(res) {
          if (res.code == 0 && res.data.length > 0) {
            var datak = res.data.length - 1;
            var linshiDatas = res.data;
            linshiDatas.splice(res.data.length - 1, 1);
            for (let index = 0; index < linshiDatas.length; index++) {
              const element = linshiDatas[index];

              if (index < 10) {
                tzChart1Datas[index] = {
                  product: element.cbrName,
                  总案件量: element.caseCount,
                  制作数量: element.uploadCaseCount,
                  合格数量: element.passCaseCount
                };
                if (param.courtIdStrings == "") {
                  $scope.tzTop10ZhizuoDatas[index] = {
                    name: element.cbrName,
                    value: element.uploadCaseCount
                  };
                } else {
                  $scope.tzTop10ZhizuoDatas[index] = {
                    name: element.cbrName,
                    value: element.uploadCaseCount
                  };
                }
              }
            }
            tzdrawChart1(tzChart1Datas);
          } else {
            layer.msg("无相关数据", { offset: ["325px", "780px"] });
          }
        });
        services._getAllIndexDatas(param).success(function(res) {
          if (res.code == 0 && res.data.length > 0) {
            var datak = res.data.length - 1;
            $scope.tzTongjiData = res.data[datak];
            var linshiDatas = res.data;
            linshiDatas.splice(res.data.length - 1, 1);
            for (let index = 0; index < linshiDatas.length; index++) {
              const element = linshiDatas[index];
              if (index < 22) {
                tzChart1DatasMore[index] = {
                  product: element.cbrName,
                  总案件量: element.caseCount,
                  制作数量: element.uploadCaseCount,
                  合格数量: element.passCaseCount
                };
              }
            }
            tzdrawChart1More(tzChart1DatasMore);
          } else {
            layer.msg(" 未获取到相关问题分布统计", {
              offset: ["325px", "780px"]
            });
          }
        });
        services._getPieDatas($scope.pieparam).success(function(res) {
          if (res.code == 0) {
            var linshiDatas = res.data;
            for (let index = 0; index < linshiDatas.length; index++) {
              const element = linshiDatas[index];
              tzPiedatas.names.push(element.caseTypeName);
              tzPiedatas.source[index] = {
                value: element.caseCount,
                name: element.caseTypeName
              };
            }
            tzdrawChart2(tzPiedatas);
          } else {
            layer.msg(" 未获取到相关案件类型分布", {
              offset: ["325px", "780px"]
            });
          }
        });
        tzChart4datas = {
          times: [],
          allCaseNum: [],
          upLoadCaseNum: [],
          passCaseCount: []
        };
        $scope.chatr8param = {
          courtId: $rootScope.userInfo.courtId,
          courtRoomId: $rootScope.userInfo.courtRoomId,
          flag: true
        };
        services._getCaseCountTrend($scope.chatr8param).success(function(res) {
          if (res.code == 0) {
            var linshiDatas = res.data;
            for (let index = 0; index < linshiDatas.length; index++) {
              const element = linshiDatas[index];
              element.months = insertStr(element.months, 4, "-");
              tzChart4datas.times.push(element.months);
              tzChart4datas.allCaseNum.push(element.caseCount);
              tzChart4datas.upLoadCaseNum.push(element.uploadCaseCount);
              tzChart4datas.passCaseCount.push(element.passCaseCount);
            }
            tzdrawChart4(tzChart4datas);
          } else {
            layer.msg(" 未获取到相关庭室年度趋势信息统计", {
              offset: ["325px", "780px"]
            });
          }
        });
      } else {
        layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
        services._userlogic({ type: "logout" }).success(function(res) {
          if (window.top != window.self) {
            top.location.href = $rootScope.ctxPath + "login.html";
          }
        });
      }
    });
  };
  // $scope.getTzOtherInitData = function(param) {
  //   services._isUserlogic().success(function(res) {
  //     param.indexFlag = 1;
  //     if (res.code == 0) {
  //       $rootScope.userInfo = res.data;
  //       if ($rootScope.userInfo.roleMenus.join().indexOf("3") != -1) {
  //         param.courtIdStrings = $rootScope.userInfo.courtId;
  //         param.courtRoomIdStrings = $rootScope.userInfo.courtRoomId;
  //       } else {
  //         return;
  //       }

       
  //     } else {
  //       layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
  //       services._userlogic({ type: "logout" }).success(function(res) {
  //         if (window.top != window.self) {
  //           top.location.href = $rootScope.ctxPath + "login.html";
  //         }
  //       });
  //     }
  //   });
  // };
  $scope.initTzTop10JuanzongDatas = function(param) {
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        param.indexFlag = 2;
        if ($rootScope.userInfo.roleMenus.join().indexOf("3") != -1) {
          param.courtIdStrings = $rootScope.userInfo.courtId;
          param.courtRoomIdStrings = $rootScope.userInfo.courtRoomId;
          services._getAllIndexDatas(param).success(function(res) {
            if (res.code == 0) {
              var linshiDatas = res.data;
              linshiDatas.splice(res.data.length - 1, 1);
              for (let index = 0; index < linshiDatas.length; index++) {
                const element = linshiDatas[index];
                if (index < 10) {
                  if ($scope.param.courtIdStrings == "") {
                    $scope.tzTop10JuanzongDatas[index] = {
                      name: element.cbrName,
                      value: element.passCaseCount
                    };
                  } else {
                    $scope.tzTop10JuanzongDatas[index] = {
                      name: element.cbrName,
                      value: element.passCaseCount
                    };
                  }
                }
              }
            } else {
              layer.msg(" 未获取到相关问题分布统计", {
                offset: ["325px", "780px"]
              });
            }
          });
        } else {
          return;
        }
      } else {
        layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
        services._userlogic({ type: "logout" }).success(function(res) {
          if (window.top != window.self) {
            top.location.href = $rootScope.ctxPath + "login.html";
          }
        });
      }
    });
  };
  $scope.getFgOtherInitDatas = function(param) {
    // if (sessionStorage.rootUserInfo) {
    //   var rootUserInfostr = sessionStorage.rootUserInfo;
    //   rootUserInfo = JSON.parse(rootUserInfostr);
    //   rootMenuArr = rootUserInfo.roleMenus;
    // }
    // param.indexFlag = 0;
    // param.courtIdStrings = rootUserInfo.courtId;
    // param.courtRoomId = rootUserInfo.courtRoomId;
    // param.cbrId = rootUserInfo.userCode;
    $scope.fgTongjiData = {};

    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        if ($rootScope.userInfo.roleMenus.join().indexOf("4") != -1) {
          param.courtIdStrings = $rootScope.userInfo.courtId;
          param.courtRoomIdStrings = $rootScope.userInfo.courtRoomId;
          if ($rootScope.userInfo.userCode == null) {
            $rootScope.userInfo.userCode = "";
            // layer.msg("没有查看法官权限", { offset: ["325px", "780px"] });
            $(".chshj_t_ul_menu li:nth-child(4)").remove();
            return;
          }
          param.cbrIdStrings = $rootScope.userInfo.userCode;
          $scope.getFgChart4Data($scope.fgChart4Param);
        } else {
          // return;
        }
        services._getAllIndexDatas(param).success(function(res) {
          if (res.code == 0 && res.data.length > 0) {
            var datak = res.data.length - 1;
            $scope.fgTongjiData = res.data[datak];
            var linshiDatas = res.data;
            linshiDatas.splice(res.data.length - 1, 1);
            fgChart2Datas[0].value = $scope.fgTongjiData.totalPassCaseCount;
            fgChart2Datas[1].value = $scope.fgTongjiData.totalUnPassCaseCount;
            fgdrawChart2(fgChart2Datas);
          } else {
            layer.msg(" 未获取到相关问题分布统计", {
              offset: ["325px", "780px"]
            });
          }
        });
        fgChart1datas = {
          times: [],
          allCaseNum: [],
          upLoadCaseNum: [],
          passCaseCount: []
        };
        $scope.chatr8param = {
          courtId: $rootScope.userInfo.courtId,
          courtRoomId: $rootScope.userInfo.courtRoomId,
          cbrId: $rootScope.userInfo.userCode,
          flag: true
        };
        services._getCaseCountTrend($scope.chatr8param).success(function(res) {
          if (res.code == 0) {
            var linshiDatas = res.data;
            for (let index = 0; index < linshiDatas.length; index++) {
              const element = linshiDatas[index];
              element.months = insertStr(element.months, 4, "-");
              fgChart1datas.times.push(element.months);
              fgChart1datas.allCaseNum.push(element.caseCount);
              fgChart1datas.upLoadCaseNum.push(element.uploadCaseCount);
              fgChart1datas.passCaseCount.push(element.passCaseCount);
            }
            fgdrawChart1(fgChart1datas);
          } else {
            layer.msg(" 未获取到相关年度趋势信息", {
              offset: ["325px", "780px"]
            });
          }
        });
      } else {
        layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
        services._userlogic({ type: "logout" }).success(function(res) {
          if (window.top != window.self) {
            top.location.href = $rootScope.ctxPath + "login.html";
          }
        });
      }
    });
  };
  $scope.getFgChart4Data = function(param) {
    services._isUserlogic().success(function(res) {
      if (res.code == 0) {
        $rootScope.userInfo = res.data;
        if ($rootScope.userInfo.roleMenus.join().indexOf("4") != -1) {
          param.courtId = $rootScope.userInfo.courtId;
          if ($rootScope.userInfo.userCode == null) {
            param.cbrId = "";
            layer.msg(" 未获取到相关年度趋势信息", {
              offset: ["325px", "780px"]
            });
            $("#fg_chart4").html("<sapn>未获取到相关年度趋势信息</sapn>");
            return;
          } else {
            param.cbrId = $rootScope.userInfo.userCode;
          }
          services._getFgCbrDatas(param).success(function(res) {
            if (res.code == 0 && res.data.length > 0) {
              var lsfgChart4Datas = res.data;
              for (let index = 0; index < lsfgChart4Datas.length; index++) {
                const element = lsfgChart4Datas[index];
                fgChart4Datas[index] = {
                  name: element.uploadUserName,
                  // name:index,
                  制作数量: element.uploadCaseCount,
                  合格数量: element.passCaseCount
                };
              }
              fgdrawChart4(fgChart4Datas);
            } else {
              layer.msg("未获取到相关年度趋势信息", {
                offset: ["325px", "780px"]
              });
            }
          });
        } else {
          return;
        }
      } else {
        layer.msg("登录超时，请重新登录", { offset: ["325px", "780px"] });
        services._userlogic({ type: "logout" }).success(function(res) {
          if (window.top != window.self) {
            top.location.href = $rootScope.ctxPath + "login.html";
          }
        });
      }
    });
  };
  $scope.initDatas();
  $scope.initXcTop10JuanzongDatas();
  $scope.byChart1Datas($scope.byparam);
  $scope.initByTop10JuanzongDatas($scope.byparam);
  $scope.getOtherInitData($scope.byparam);
  $scope.getTzOtherInitDatasMore($scope.tzparam);
  $scope.initTzTop10JuanzongDatas($scope.tzparam);
  // $scope.getTzOtherInitData($scope.tzparam);
  $scope.getFgOtherInitDatas($scope.tzparam);

  // $scope.getXcChart1Data();
  $scope.bottimeScope =
    $scope.param.laDateStart + " 至 " + $scope.param.laDateEnd;
  $scope.timeScope = $scope.param.laDateStart + " 至 " + $scope.param.laDateEnd;
  $scope.selectTime = function($event) {
    $scope.timeScope = $event.target.innerHTML;
    if ($scope.timeScope == "本月") {
      $scope.param.laDateStart = thisMonthFirsrDay;
      $scope.param.laDateEnd = todayTime;
    } else if ($scope.timeScope == "上月") {
      $scope.param.laDateStart = lastMonthFirsrDay;
      $scope.param.laDateEnd = lastMonthLastDay;
    } else if ($scope.timeScope == "本周") {
      $scope.param.laDateStart = thisWeekFirsrDay;
      $scope.param.laDateEnd = todayTime;
    } else if ($scope.timeScope == "上周") {
      $scope.param.laDateStart = lastWeekFirstDay;
      $scope.param.laDateEnd = lastWeekLastDay;
    } else if ($scope.timeScope == "今天") {
      $scope.param.laDateStart = preDate;
      $scope.param.laDateEnd = todayTime;
    } else if ($scope.timeScope == "昨天") {
      $scope.param.laDateStart = todayTime;
      $scope.param.laDateEnd = nextDate;
    } else if ($scope.timeScope == "近半年") {
      $scope.param.laDateStart = getLastSixMonthYestdy(new Date());
      $scope.param.laDateEnd = todayTime;
    } else if ($scope.timeScope == "近一年") {
      $scope.param.laDateStart = getLastYearYestdy(new Date());
      $scope.param.laDateEnd = todayTime;
    }
  };
  var dominZTree = [];

  var AllMenusArrNum = [];
  var hideMenuArr = [];
  services._getAllMenus().success(function(res) {
    if (res.code == "0") {
      $rootScope.AllMenusArr = res.data;
      for (var index = 0; index < $rootScope.AllMenusArr.length; index++) {
        var element = $rootScope.AllMenusArr[index];
        AllMenusArrNum.push(element.menuId);
      }
    }
  });

  //tree展示
  $scope.treeContent = function(court_obj) {
    var treeStr = "";
    for (var index = 0; index < court_obj.length; index++) {
      var element = court_obj[index];
      var treeChildStr = "";
      for (var i = 0; i < element.children.length; i++) {
        var child = element.children[i];
        treeChildStr +=
          '<span class="nowrap c_nowrap" id="' +
          child.courtId +
          '" title="' +
          child.courtName +
          '" style="width:85%;"><input name="' +
          child.courtId +
          '" type="checkbox"class="tree_node_child_checkbox">' +
          child.courtName +
          " </span><br>";
      }
      treeStr +=
        ' <div class="tree_node top_tree_node rela">' +
        ' <div class="div_inline top_div_inline abso"><input type="button" value="-" class="tree_node_toggle_button"></div>' +
        ' <div class="div_inline bot_div_inline tree_node_parent">' +
        '     <input type="checkbox" name="' +
        element.courtId +
        '" class="tree_node_parent_checkbox"><span id="' +
        element.courtId +
        '" class="nowrap p_nowrap" title="' +
        element.courtName +
        '" style="width:85%;">' +
        element.courtName +
        "</span>" +
        '     <div class="tree_node_child">' +
        treeChildStr +
        "     </div>" +
        " </div>" +
        "</div>";
    }

    $(".tree_content").html(treeStr);
    $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
      "checked",
      true
    );
    // 为所有的父节点添加点击事件
    $(".court-fa-close").click(function() {
      $("#fayuan_input").val("");
      $(".court-fa-caret").show();
      $(".court-fa-close").hide();
    });
    $(".tree_node_parent_checkbox").click(function() {
      // 获取父节点是否选中
      // $(".tree_node input").prop("checked", false);
      var isChange = $(this).prop("checked");
      if (
        $(this)
          .siblings("span")
          .text() == "全部法院"
      ) {
        courtParamArr = [];
        $("#fayuan_input").val($(this).text());
        if (isChange) {
          $(".fy-dropdown").removeClass("open");
          $(".tree_node_parent input").prop("checked", false);
          $(this).prop("checked", true);
          // $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
          //   "checked",
          //   false
          // );
        } else {
          $(".fy-dropdown").addClass("open");
          // $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
          //   "checked",
          //   true
          // );
        }
      } else {
        // $(".my-dropdown").removeClass("open");
        $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
          "checked",
          false
        );
        $(".court-fa-caret").hide();
        $(".court-fa-close").show();
        if (isChange) {
          var courtName = $(this)
            .siblings("span")
            .text();
          $scope.param.courtIdStrings = $(this)[0].name;
          $("#fayuan_input").val(courtName);
          courtParamArr.push($scope.param.courtIdStrings);
          $scope.param.courtIdStrings = courtParamArr.join("-");
        } else {
          $scope.param.courtIdStrings = $(this)[0].name;
          courtParamArr.removeItem($scope.param.courtIdStrings);
          $scope.param.courtIdStrings = courtParamArr.join("-");
          if (courtParamArr.length == 0) {
            $(
              ".tree_content .tree_node:nth-child(1) .bot_div_inline>input"
            ).prop("checked", true);
          }
        }
      }
    });
    // 为所有的子节点添加点击事件
    $(".tree_node_child_checkbox").click(function(e) {
      var isChange = $(this).prop("checked");
      // $(".tree_node input").prop("checked", false);
      // $(".my-dropdown").removeClass("open");
      $scope.param.courtIdStrings = $(this)[0].name;
      if (isChange) {
        var courtName = $(this).parent()[0].title;
        $scope.param.courtIdStrings = $(this)[0].name;
        $("#fayuan_input").val(courtName);
        courtParamArr.push($scope.param.courtIdStrings);
        $scope.param.courtIdStrings = courtParamArr.join("-");
      } else {
        $scope.param.courtIdStrings = $(this)[0].name;
        courtParamArr.removeItem($scope.param.courtIdStrings);
        $scope.param.courtIdStrings = courtParamArr.join("-");
        if (courtParamArr.length == 0) {
          $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
            "checked",
            true
          );
        }
      }
      $(".court-fa-caret").hide();
      $(".court-fa-close").show();
      e.stopPropagation();
    });
    $(".tree_node_child span").click(function(e) {
      // $(".tree_node input").prop("checked", false);
      var isChange = $(this)
        .find("input")
        .prop("checked");
      // $(".my-dropdown").removeClass("open");
      if (!isChange) {
        $scope.param.courtIdStrings = $(this)[0].id;
        courtParamArr.push($scope.param.courtIdStrings);
        $scope.param.courtIdStrings = courtParamArr.join("-");
        $("#fayuan_input").val($(this).text());
      } else {
        $scope.param.courtIdStrings = $(this)[0].id;
        courtParamArr.removeItem($scope.param.courtIdStrings);
        $scope.param.courtIdStrings = courtParamArr.join("-");
        if (courtParamArr.length == 0) {
          $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
            "checked",
            true
          );
        }
        $("#fayuan_input").val("");
      }
      $(".court-fa-caret").hide();
      $(".court-fa-close").show();
      e.stopPropagation();
      // e.stopPropagation();
      if (
        $(this)
          .find("input")
          .prop("checked") == false
      ) {
        $(this)
          .find("input")
          .prop("checked", true);
        $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
          "checked",
          false
        );
      } else {
        $(this)
          .find("input")
          .prop("checked", false);
        if (courtParamArr.length == 0) {
          $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
            "checked",
            true
          );
        }
      }
    });
    $(".bot_div_inline>.nowrap").click(function(e) {
      // $(".tree_node input").prop("checked", false);
      var isChange = $(
        $(this)
          .parent()
          .children()[0]
      ).prop("checked");
      if ($(this).text() == "全部法院") {
        courtParamArr = [];
        $("#fayuan_input").val($(this).text());
        if (isChange) {
          $(".fy-dropdown").addClass("open");
          $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
            "checked",
            false
          );
        } else {
          $(".fy-dropdown").removeClass("open");
          $(".tree_node_parent input").prop("checked", false);
          $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
            "checked",
            true
          );
        }
      } else {
        $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
          "checked",
          false
        );
        if (!isChange) {
          $scope.param.courtIdStrings = $(this)[0].id;
          $("#fayuan_input").val($(this).text());
          courtParamArr.push($scope.param.courtIdStrings);
          $scope.param.courtIdStrings = courtParamArr.join("-");
        } else {
          $scope.param.courtIdStrings = $(this)[0].id;
          courtParamArr.removeItem($scope.param.courtIdStrings);
          $scope.param.courtIdStrings = courtParamArr.join("-");
          if (courtParamArr.length == 0) {
            $(
              ".tree_content .tree_node:nth-child(1) .bot_div_inline>input"
            ).prop("checked", true);
          }
          $("#fayuan_input").val("");
        }
        // $(".my-dropdown").removeClass("open");
        $(".court-fa-caret").hide();
        $(".court-fa-close").show();
      }
      e.stopPropagation();
      // e.stopPropagation();

      if (
        $(this)
          .siblings("input")
          .prop("checked") == false
      ) {
        $(this)
          .siblings("input")
          .prop("checked", true);
        $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
          "checked",
          false
        );
      } else {
        $(this)
          .siblings("input")
          .prop("checked", false);
        if (courtParamArr.length == 0) {
          $(".tree_content .tree_node:nth-child(1) .bot_div_inline>input").prop(
            "checked",
            true
          );
        }
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
  };
  $scope.getAllCourtList = function(courtParam) {
    // courtParam.courtId = 100
    courtParam.courtId = $rootScope.userInfo.courtId;
    services._getAllCourtListJson(courtParam).success(function(res) {
      if (res.code == 0) {
        // dominZTree = res.data;
        if (courtParam.courtId == 100) {
          var court_objFirst = [];
          court_obj = res.data.children;
          court_objFirst = res.data;
          court_objFirst.children = [];
          court_obj.unshift(court_objFirst);
          court_obj.unshift(allCourts);
        }
        for (var index = 0; index < court_obj.length; index++) {
          var ip = court_obj[index].ip;
          for (var j = 0; j < court_obj[index].children.length; j++) {
            var el = court_obj[index].children[j];
            el.ip = ip;
          }
        }
        // $scope.getFayuanListTree();
        $scope.treeContent(court_obj);
      }
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

  function getCourtSliderUlStr() {
    courtSliderStr = "";
    $("#court_slider").html("");
    for (let index = 0; index < xcBuHeGeDatas.length; index++) {
      const element = xcBuHeGeDatas[index];
      courtSliderStr +=
        ' <li id="' +
        element.id +
        '" onclick="courtClick(' +
        element.id +
        ')"><span title="' +
        element.name +
        '">' +
        element.name +
        '</span> <span class="pull-right"  title="' +
        element.value +
        '">' +
        element.value +
        "</span></li> ";
    }
    $("#court_slider").append(courtSliderStr);
    if ($("#court_slider li").length > 9) {
      movedomeCourt();
    }
  }

  $scope.timeZidingyi = function() {
    $scope.layerfunTree1 = layer.open({
      type: 1,
      title: "自定义时间",
      area: ["700px", "75px"],
      skin: "layui-layer-rim",
      content: $("#timeForm"),
      offset: ["150px", "580px"],
      scrollbar: false
    });
  };
  if (document.title == "首页") {
    $(".menu_box li", parent.document)
      .eq(0)
      .addClass("active");
  }

  //书讯快递循环垂直向上滚动
  function movedomeCourt() {
    timer1 = null;
    var margintop = 0; //上边距的偏移量
    var stop = false;
    $("#court_slider").html("");
    timer1 = setInterval(function() {
      if (stop == true) {
        return;
      }
      $("#court_slider")
        .children("li")
        .first()
        .animate({ "margin-top": margintop-- }, 0, function() {
          var $li = $(this);
          if (!$li.is(":animated")) {
            //第一个li的动画结束时
            if (-margintop > $li.height()) {
              $li.css("margin-top", "0px").appendTo($("#court_slider"));
              margintop = 0;
            }
          }
        });
    }, 50);
    //鼠标放到快递信息(ul)上时
    $("#court_slider").hover(
      function() {
        $(this).css("cursor", "pointer");
        stop = true; //停止动画
      },
      function() {
        stop = false; //开始动画
      }
    );
  }
  $scope.bychart1MoreClick = function() {
    $scope.byChatr1More = layer.open({
      type: 1,
      title: " ",
      offset: ["100px", "80px"],
      area: ["1750px", "560px"],
      skin: "layui-layer-rim",
      content: $("#by_chart1_more_form"),
      scrollbar: false
    });
  };
  $scope.tzchart1MoreClick = function() {
    $scope.byChatr1More = layer.open({
      type: 1,
      title: " ",
      offset: ["100px", "80px"],
      area: ["1750px", "560px"],
      skin: "layui-layer-rim",
      content: $("#tz_chart1_more_form"),
      scrollbar: false
    });
  };

  $(function() {
    //书讯快递循环垂直向上滚动
    var failCaseList = [];
    var cbrFailCaseList = [];
    var cbrFailCaseListStr = "";
    function getCbrFailCaseList() {
      $("#cbr-fail-list").html("");
      cbrFailCaseListStr = "";
      for (let index = 0; index < cbrFailCaseList.length; index++) {
        const element = cbrFailCaseList[index];
        if (element.failReason == null) {
          element.failReason = "--";
        }
        // var nameId = '"' + element.caseName + '"';
        var nameId = '"' + element.caseId + '"';
        var j = index + 1;
        cbrFailCaseListStr +=
          "<li onclick='cbrCaseNameClick("+nameId+")'><span>" +
          j +
          "</span><span>" +
          element.caseName +
          '</span> <span class="pull-right">' +
          element.failReason +
          "</span></li>";
      }
      $("#cbr-fail-list").append(cbrFailCaseListStr);
      if ($("#cbr-fail-list li").length > 9) {
        movedomeCaseFail();
      }
    }
    if (rootUserInfo.userCode == null) {
      rootUserInfo.userCode = "";
    }
    var failParam = {
      courtId: rootUserInfo.courtId,
      courtRoomId: rootUserInfo.courtRoomId,
      cbrId: rootUserInfo.userCode,
      laDateStart: $scope.param.laDateStart,
      laDateEnd: $scope.param.laDateEnd,
      checkCaseResult: 1,
      currentPage: 1,
      pageSize: 10
    };

    var initCbrFailCaesLIst = function() {
      services._isUserlogic().success(function(res) {
        if (res.code == 0) {
          var rootUserInfo = res.data;
          initFailCaesLIst(rootUserInfo.courtId);
          if (rootUserInfo.userCode == null || rootUserInfo.userCode == "") {
            rootUserInfo.userCode = "";
            return;
          }
          var cbUrl3 =
            "/caseCheck/caseInfo/queryCaseInfoByParam?courtId=" +
            rootUserInfo.courtId +
            "&courtRoomId=" +
            rootUserInfo.courtRoomId +
            "&cbrId=" +
            rootUserInfo.userCode +
            "&laDateStart=2017-01-01" +
            "&checkCaseResult=1" +
            "&currentPage=1" +
            "&pageSize=1000000" +
            "&laDateEnd=" +
            $scope.param.laDateEnd;
          $.ajax({
            type: "GET",
            async: true,
            url: cbUrl3,
            contentType: "application/json;charset=utf-8",
            success: function(res) {
              if (res.code == "0" && res.data.length > 0) {
                cbrFailCaseList = res.data;
                getCbrFailCaseList();
              } else {
                layer.msg("未获取到相关不合格案件列表", {
                  offset: ["325px", "780px"]
                });
                $("#cbr-fail-list").html("暂无不合格案件列表");
                $("#cbr-fail-list").css({
                  padding:"20px"
                })
              }
            }
          });
        }
      });
    };
    initCbrFailCaesLIst();
    initFailCaesLIst = function(id) {
      var caseSliderStr = "";
      $("#case_slider").html("");
      services._isUserlogic().success(function(res) {
        if (res.code == 0) {
          var rootUserInfo = res.data;
          if (rootUserInfo.userCode == null) {
            rootUserInfo.userCode = "";
          }
          // var urlFail =
          //   "/caseCheck/caseInfo/queryFailCaseInfo?courtId=" +
          //   rootUserInfo.courtId +
          //   "&laDateStart=" + $scope.param.laDateStart +
          //   "&laDateEnd=" +
          //   $scope.param.laDateEnd +
          //   "&queryFlag=1";
          var urlFail =
            "/caseCheck/caseInfo/queryCaseInfoByParam?courtId=" +
            id +
            "&courtRoomId=" +
            "&cbrId=" +
            "&laDateStart=" +
            $scope.param.laDateStart +
            "&checkCaseResult=1" +
            "&currentPage=1" +
            "&pageSize=100" +
            "&laDateEnd=" +
            $scope.param.laDateEnd;
          $.ajax({
            type: "GET",
            async: true,
            url: urlFail,
            contentType: "application/json;charset=utf-8",
            success: function(res) {
              if (res.code == "0" && res.data.length > 0) {
                failCaseList = res.data;
                getCaseSliderUlStr();
              } else {
                $("#case_slider").html(
                  "<span style='dispaly:inline-block;padding-left:10px;margin-top:15px;'>暂无数据</span>"
                );
                layer.msg("未获取到相关问题案号列表", {
                  offset: ["325px", "780px"]
                });
              }
            }
          });

          function getCaseSliderUlStr() {
            caseSliderStr = "";
            for (let index = 0; index < failCaseList.length; index++) {
              const element = failCaseList[index];
              // var nameId = '"' + element.caseName + '"';
              var nameId = '"' + element.caseId + '"';
              caseSliderStr +=
                " <li onclick='caseNameClick(" +
                nameId +
                ")'><span>" +
                element.courtName +
                "</span> &nbsp&nbsp <span>" +
                element.caseName +
                "</span></li> ";
            }
            $("#case_slider").append(caseSliderStr);
            if ($("#case_slider li").length > 9) {
              movedomeCase();
            }
          }
        }
      });
    };
    function movedomeCase() {
      timer2 = null;
      clearInterval(timer2);
      var margintop = 0; //上边距的偏移量
      var stop = false;
      timer2 = setInterval(function() {
        if (stop == true) {
          return;
        }
        $("#case_slider")
          .children("li")
          .first()
          .animate({ "margin-top": margintop-- }, 0, function() {
            var $li = $(this);
            if (!$li.is(":animated")) {
              //第一个li的动画结束时
              if (-margintop > $li.height()) {
                $li.css("margin-top", "0px").appendTo($("#case_slider"));
                margintop = 0;
              }
            }
          });
      }, 50);
      //鼠标放到快递信息(ul)上时
      $("#case_slider").hover(
        function() {
          $(this).css("cursor", "pointer");
          stop = true; //停止动画
        },
        function() {
          stop = false; //开始动画
        }
      );
    }
    function movedomeCaseFail() {
      var margintop = 0; //上边距的偏移量
      var stop = false;
      setInterval(function() {
        if (stop == true) {
          return;
        }
        $("#cbr-fail-list")
          .children("li")
          .first()
          .animate({ "margin-top": margintop-- }, 0, function() {
            var $li = $(this);
            if (!$li.is(":animated")) {
              //第一个li的动画结束时
              if (-margintop > $li.height()) {
                $li.css("margin-top", "0px").appendTo($("#cbr-fail-list"));
                margintop = 0;
              }
            }
          });
      }, 50);
      //鼠标放到快递信息(ul)上时
      $("#cbr-fail-list").hover(
        function() {
          $(this).css("cursor", "pointer");
          stop = true; //停止动画
        },
        function() {
          stop = false; //开始动画
        }
      );
    }

    $(".t_ul_menu li").click(function() {
      var index = $(this).index();
      // $(".t_ul_menu li").removeClass("active");
      // $(this).addClass("active")
      $("body .shijiao-boxs >div").hide();
      $("body .shijiao-boxs >div")
        .eq(index)
        .show();
      if (index == 0) {
        $(".J_iframe", parent.document).css({
          height: "1745px"
        });
      }
      if (index == 1) {
        $(".J_iframe", parent.document).css({
          height: "1370px"
        });
      }
      if (index == 2) {
        $(".J_iframe", parent.document).css({
          height: "1125px"
        });
      }
      if (index == 3) {
        $(".J_iframe", parent.document).css({
          height: "1135px"
        });
      }
    });
    var clicktag = 0;
    caseNameClick = function(name) {
     window.open("../shyezhlchx/page.html?name="+name+"&source=1");
    };
    cbrCaseNameClick = function(name) {  
     window.open("../shyezhlchx/page.html?name="+name+"&source=2&courtId="+rootUserInfo.courtId+"&courtRoomId="+rootUserInfo.courtRoomId+"&cbrId="+rootUserInfo.userCode);
    };
    $scope.search = function() {
      if (clicktag == 0) {
        clicktag = 1;
        timer1 = null;
        timer2 - null;
        clearInterval(timer1);
        clearInterval(timer2);
        // $scope.getAllTongjiData();
        $scope.initDatas();
        initFailCaesLIst(rootUserInfo.courtId);
        // $scope.getXcChart1Data();
        // getTongjiDtads(xctongjiData);
        // drawChart1(xcChart1Datas);
        setTimeout(function() {
          clicktag = 0;
        }, 600);
      } else {
        layer.msg("请勿频繁点击！", {
          offset: ["325px", "780px"]
        });
        return;
      }
    };
    $scope.getFayuanListTree = function() {
      var setting = {
        view: {
          dblClickExpand: false, //双击节点时，是否自动展开父节点的标识
          showIcon: false, //图标
          showLine: true, //是否显示节点之间的连线
          fontCss: { color: "black", "font-weight": "bold" }, //字体样式函数
          selectedMulti: true //设置是否允许同时选中多个节点
        },
        check: {
          //chkboxType: { "Y": "ps", "N": "ps" },
          chkboxType: { Y: "", N: "" },
          chkStyle: "checkbox", //复选框类型
          enable: true //每个节点上是否显示 CheckBox
        },
        edit: {
          enable: false,
          editNameSelectAll: true,
          showRemoveBtn: true,
          showRenameBtn: true,
          removeTitle: "remove",
          renameTitle: "rename"
        },
        data: {
          simpleData: {
            //简单数据模式
            enable: true,
            idKey: "id",
            pIdKey: "IPARENTID",
            rootPId: null
          },
          key: {
            name: "court_name"
            // checked:""
          }
        },
        callback: {
          // onExpand: setTitle // 用于捕获父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作
        }
      };
      zTreeObj = $.fn.zTree.init($("#regionZTree"), setting, dominZTree);
      //全选
    };
  });
});
