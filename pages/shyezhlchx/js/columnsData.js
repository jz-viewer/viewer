var columnsCourts = [
  [
    {
      field: "areaName",
      title: "地区",
      width: "20%",
      align: "center",
      formatter: function(value, row, index) {
        var result = "";
        var id = row.areaId;
        $(".fayuan_text").text("全部地区");

        result +=
          "<span  style='cursor: pointer;color: #288ee6;' onclick=\"courtAllClick('" +
          id +
          "')\">" +
          row.areaName +
          "</span>";
        return result;
      }
    },
    {
      field: "caseCount",
      title: "案件数",
      width: "12%",
      align: "center"
    },
    {
      field: "uploadCaseCount",
      title: "上传案件数",
      width: "10%",
      align: "center"
    },
    {
      field: "unUploadCaseCount",
      title: "未上传案件数",
      width: "10%",
      align: "center"
    },
    {
      field: "uploadRate",
      title: "制作率",
      width: "10%",
      align: "center",
      hidden: false
    },
    {
      field: "passCaseCount",
      title: "合格数",
      width: "10%",
      align: "center",
      hidden: false
    },
    {
      field: "unPassCaseCount",
      title: "不合格数",
      width: "14%",
      align: "center",
      formatter: function(value, row, index) {
        var result = "";
        var id = row.areaId;
        result +=
          "<span style='cursor: pointer;color: #288ee6;' onclick=\"buhegeClick('" +
          id +
          "')\">" +
          row.unPassCaseCount +
          "</span>";
        return result;
      }
    },
    {
      field: "passRate",
      title: "合格率",
      width: "14%",
      align: "center"
    }
  ]
];

columnsCourt = [
  [
    {
      field: "courtName",
      title: "法院",
      width: "20%",
      align: "center",
      formatter: function(value, row, index) {
        var result = "";
        var id = row.courtId;
        result +=
          "<span  style='cursor: pointer;color: #288ee6;' onclick=\"courtClick('" +
          id +
          "')\">" +
          row.courtName +
          "</span>";
        return result;
      }
    },
    {
      field: "caseCount",
      title: "案件数",
      width: "12%",
      align: "center"
    },
    {
      field: "uploadCaseCount",
      title: "上传案件数",
      width: "10%",
      align: "center"
    },
    {
      field: "unUploadCaseCount",
      title: "未上传案件数",
      width: "10%",
      align: "center"
    },
    {
      field: "uploadRate",
      title: "制作率",
      width: "10%",
      align: "center",
      hidden: false
    },
    {
      field: "passCaseCount",
      title: "合格数",
      width: "10%",
      align: "center",
      hidden: false
    },
    {
      field: "unPassCaseCount",
      title: "不合格数",
      width: "14%",
      align: "center",
      formatter: function(value, row, index) {
        var result = "";
        var id = row.courtId;
        result +=
          "<span style='cursor: pointer;color: #288ee6;' onclick=\"buhegeClick('" +
          id +
          "')\">" +
          row.unPassCaseCount +
          "</span>";
        return result;
      }
    },
    {
      field: "passRate",
      title: "合格率",
      width: "14%",
      align: "center"
    }
  ]
];

var columnsRooms = [
  [
    {
      field: "courtName",
      title: "法院",
      width: "17%",
      align: "center"
    },
    {
      field: "courtRoomName",
      title: "庭室",
      width: "12%",
      align: "center",
      formatter: function(value, row, index) {
        var result = "";
        var id = row.courtRoomId;
        $(".fayuan_text").text(row.courtName);
        $("#fayuan_input").val(row.courtName);
        $("#fayuan_input_case").val(row.courtName);
        $("#fayuan_input")[0].name = row.courtId;
        $("#fayuan_input_case")[0].name = row.courtId;
        $(".tingshi_text").text("全部庭室");
        result +=
          "<span  style='cursor: pointer;color: #288ee6;' onclick=\"roomClick('" +
          id +
          "')\">" +
          row.courtRoomName +
          "</span>";
        return result;
      }
    },
    {
      field: "caseCount",
      title: "案件数",
      width: "10%",
      align: "center"
    },
    {
      field: "uploadCaseCount",
      title: "上传案件数",
      width: "10%",
      align: "center"
    },
    {
      field: "unUploadCaseCount",
      title: "未上传案件数",
      width: "10%",
      align: "center"
    },
    {
      field: "uploadRate",
      title: "制作率",
      width: "10%",
      align: "center",
      hidden: false
    },
    {
      field: "passCaseCount",
      title: "合格数",
      width: "10%",
      align: "center",
      hidden: false
    },
    {
      field: "unPassCaseCount",
      title: "不合格数",
      width: "10%",
      align: "center",
      formatter: function(value, row, index) {
        var result = "";
        var id = row.court_id;
        result +=
          "<span style='cursor: pointer;color: #288ee6;' onclick=\"buhegeClick('" +
          id +
          "')\">" +
          row.unPassCaseCount +
          "</span>";
        return result;
      }
    },
    {
      field: "passRate",
      title: "合格率",
      width: "10%",
      align: "center"
    }
  ]
];

var columnscbr = [
  [
    {
      field: "courtName",
      title: "法院",
      width: "18%",
      align: "center"
    },
    {
      field: "courtRoomName",
      title: "庭室",
      width: "10%",
      align: "center"
    },
    {
      field: "cbrName",
      title: "承办人",
      width: "10%",
      align: "center",
      formatter: function(value, row, index) {
        var result = "";
        var id = row.cbrId;
        $(".tingshi_text").text(row.courtRoomName);
        $("#tz_input").val(row.courtRoomName);
        // $(".faguan_text").text("全部法官");
        // $("#cbr_name").val("全部法官");
        result +=
          "<span  style='cursor: pointer;color: #288ee6;' onclick=\"cbrClick('" +
          id +
          "')\">" +
          row.cbrName +
          "</span>";
        return result;
      }
    },
    {
      field: "caseCount",
      title: "案件数",
      width: "10%",
      align: "center"
    },
    {
      field: "uploadCaseCount",
      title: "上传案件数",
      width: "9%",
      align: "center"
    },
    {
      field: "unUploadCaseCount",
      title: "未上传案件数",
      width: "9%",
      align: "center"
    },
    {
      field: "uploadRate",
      title: "制作率",
      width: "9%",
      align: "center",
      hidden: false
    },
    {
      field: "passCaseCount",
      title: "合格数",
      width: "8%",
      align: "center",
      hidden: false
    },
    {
      field: "unPassCaseCount",
      title: "不合格数",
      width: "8%",
      align: "center",
      formatter: function(value, row, index) {
        var result = "";
        var id = row.courtRoomId;
        result +=
          "<span style='cursor: pointer;color: #288ee6;' onclick=\"buhegeClick('" +
          id +
          "')\">" +
          row.unPassCaseCount +
          "</span>";
        return result;
      }
    },
    {
      field: "passRate",
      title: "合格率",
      width: "8%",
      align: "center"
    }
  ]
];

var columnsCase = [
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
      width: "4%",
      align: "center"
    },
    {
      field: "courtName",
      title: "经办法院",
      width: "10%",
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
      width: "5%",
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
        }  else if (row.caseStatus == "3") {
          result = "<span>立案审查</span>";
        }  else if (row.caseStatus == "4") {
          result = "<span>立案审批</span>";
        }  else if (row.caseStatus == "5") {
          result = "<span>等待分派</span>";
        }  else if (row.caseStatus == "6") {
          result = "<span>等待确认</span>";
        }  else if (row.caseStatus == "7") {
          result = "<span>正在审理</span>";
        }  else if (row.caseStatus == "8") {
          result = "<span>立案待结</span>";
        }  else if (row.caseStatus == "9") {
          result = "<span>结案报批</span>";
        }  else if (row.caseStatus == "10") {
          result = "<span>已经结案</span>";
        }  else if (row.caseStatus == "11") {
          result = "<span>已经归档</span>";
        } else{
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
      width: "4%",
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
      width: "8%",
      align: "center",
      hidden: false
    },
    {
      field: "dealCaseMessage",
      title: "批注内容",
      width: "8%",
      align: "center",
      hidden: false
    },
    {
      field: "detail",
      title: "操作",
      width: "14%",
      align: "center",
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
         if(row.checkCaseResult == 1){
          str +=
          "<span class='con-code-ico heshi-btn' onclick=\"heshiClick('" +
          row.caseId +
          "')\">核实</span>";
         }
          return str;
        }
      }
    }
  ]
];

var columnsCaseCode = [
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
        }  else if (row.caseStatus == "3") {
          result = "<span>立案审查</span>";
        }  else if (row.caseStatus == "4") {
          result = "<span>立案审批</span>";
        }  else if (row.caseStatus == "5") {
          result = "<span>等待分派</span>";
        }  else if (row.caseStatus == "6") {
          result = "<span>等待确认</span>";
        }  else if (row.caseStatus == "7") {
          result = "<span>正在审理</span>";
        }  else if (row.caseStatus == "8") {
          result = "<span>立案待结</span>";
        }  else if (row.caseStatus == "9") {
          result = "<span>结案报批</span>";
        }  else if (row.caseStatus == "10") {
          result = "<span>已经结案</span>";
        }  else if (row.caseStatus == "11") {
          result = "<span>已经归档</span>";
        } else{
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
      width: "5%",
      align: "center",
      hidden: false
    },
    {
      field: "checkCaseResult",
      title: "是否合格",
      width: "6%",
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
          if(row.checkCaseResult == 1){
            str +=
            "<span class='con-code-ico heshi-btn' onclick=\"heshiClick('" +
            row.caseId +
            "')\">核实</span>";
           }
          return str;
        }
      }
    }
  ]
];

columnsDaying =[[
  {
    field: "caseName",
    title: "案号",
    width: "13%",
    align: "center"
  },
  {
    field: "caseTypeName",
    title: "案件类型",
    width: "8%",
    align: "center"
  },
  {
    field: "spcxName",
    title: "审判程序",
    width: "6%",
    align: "center"
  },
  {
    field: "courtName",
    title: "经办法院",
    width: "13%",
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
    width: "6%",
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
        var result = "<span>立案登记</span>";
      } else if (row.caseStatus == "2") {
        result = "<span>立案审查</span>";
      }  else if (row.caseStatus == "3") {
        result = "<span>立案审批</span>";
      }  else if (row.caseStatus == "4") {
        result = "<span>等待分派</span>";
      }  else if (row.caseStatus == "5") {
        result = "<span>等待确认</span>";
      }  else if (row.caseStatus == "6") {
        result = "<span>正在审理</span>";
      }  else if (row.caseStatus == "7") {
        result = "<span>立案待结</span>";
      }  else if (row.caseStatus == "8") {
        result = "<span>结案报批</span>";
      }  else if (row.caseStatus == "9") {
        result = "<span>已经结案</span>";
      }  else if (row.caseStatus == "10") {
        result = "<span>立案审查</span>";
      }  else if (row.caseStatus == "11") {
        result = "<span>已经归档</span>";
      } else{
        result = "<span>--</span>";
      }
      return result;
    }
  },
  {
    field: "uploadIndex",
    title: "上传批次",
    width: "6%",
    align: "center",
    hidden: false
  },
  {
    field: "totalFileNum",
    title: "页数",
    width: "6%",
    align: "center",
    hidden: false
  },
  {
    field: "checkCaseResult",
    title: "是否合格",
    width: "6%",
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
    width: "10%",
    align: "center",
    hidden: false
  },
]]
