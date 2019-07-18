var cityDatas = [
  "高院",
  "石家庄",
  "衡水",
  "保定",
  "廊坊",
  "雄安",
  "秦皇岛",
  "承德",
  "沧州",
  "邢台",
  "张家口",
  "唐山"
];
var chart1Flag = true;
var xcchart1MoreClick;
var xcchart1MoreFhClick;
function getTongjiDtads(tongjData) {
  $(".xcanjianshu").text(tongjData.totalCaseCount);
  $(".xcsaomiaoshu").text(tongjData.totalUploadCaseCount);
  $(".xcshengchengshu").text(tongjData.totalUploadIndex);
  $(".xcshangchuan").text(tongjData.totalFileNum);
  $(".xcbuhege").text(tongjData.totalUnPassCaseCount);
}
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
function drawChart1(xcChart1Dtaas, paramData) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("chart1"));
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
        fontSize: 14
      },
      left: "30"
    },
    grid: {
      // 控制图的大小，调整下面这些值就可以，
      x: 70,
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
      dimensions: ["product", "总案件量", "制作数量", "合格数量"],
      source: xcChart1Dtaas
    },

    xAxis: {
      type: "category",
      // splitLine:{show: false},//去除网格线
      axisLine: {
        lineStyle: {
          color: "#c3e7ff",
          width: 2
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
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
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
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
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "white",
                fontSize: 12
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
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "white",
                fontSize: 12
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
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "white",
                fontSize: 12
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
  myChart.on("click", function(params) {
    if (chart1Flag) {
      var curl =
        "/caseCheck/court/queryByCourtId?courtId=" + params.data.areaId;
      var courtIds = "";
      $.ajax({
        url: curl,
        async: false,
        type: "GET",
        success: function(res) {
          if (res.code == 0) {
            var childrenData = res.data.children,
              newwArrs = [];
            for (let index = 0; index < childrenData.length; index++) {
              const element = childrenData[index];
              newwArrs.push(element.courtId);
            }
            newwArrs.push(params.data.areaId);
            courtIds = newwArrs.join("-");
          } else {
            layer.msg("未获取到相关法院数据", { offset: ["325px", "780px"] });
          }
        },
        error: function(e) {
          layer.msg("未获取到相关法院数据", { offset: ["325px", "780px"] });
        }
      });
      $("#fayuan_input").val(params.name);
      var url =
        "/caseCheck/caseStatistics/queryCaseCount2?courtIdStrings=" +
        courtIds +
        "&courtRoomIdStrings=&cbrIdStrings=&queryFlag=0&indexFlag=1&laDateStart=" +
        paramData.laDateStart +
        "&laDateEnd=" +
        paramData.laDateEnd;
      $.ajax({
        url: url,
        async: false,
        type: "GET",
        success: function(res) {
          if (res.code == 0 && res.data.length > 0) {
            var linshiDatas;
            var newxcChart1Dtaas = [];
            var moreChart1Dtaas = [];
            var dataI = res.data.length - 1;
            linshiDatas = res.data;
            linshiDatas.splice(dataI, 1);
            for (let index = 0; index < linshiDatas.length; index++) {
              const element = linshiDatas[index];
              moreChart1Dtaas[index] = {
                product: element.courtName.replace("人民法院", "法院"),
                总案件量: element.caseCount,
                制作数量: element.uploadCaseCount,
                合格数量: element.passCaseCount,
                areaId: element.courtId
              };
              if (index < 10) {
                newxcChart1Dtaas[index] = {
                  product: element.courtName.replace("人民法院", "法院"),
                  总案件量: element.caseCount,
                  制作数量: element.uploadCaseCount,
                  合格数量: element.passCaseCount,
                  areaId: element.courtId
                };
              }
            }
            drawChart1(newxcChart1Dtaas);
            $(".xcckge-more").show();
            xcchart1MoreClick = function() {
              drawChart1More(moreChart1Dtaas);
              layer.open({
                type: 1,
                title: "查看更多",
                offset: ["100px", "80px"],
                area: ["1750px", "560px"],
                skin: "layui-layer-rim",
                content: $("#xc_chart1_more_form"),
                scrollbar: false
              });
            };
            xcchart1MoreFhClick = function() {
              drawChart1(xcChart1Dtaas);
              $("#fayuan_input").val("全部地区");
              chart1Flag = true;
              $(".xcckge-more").hide();
            };
            chart1Flag = false;
          } else {
            layer.msg("未获取到相关统计信息", { offset: ["325px", "780px"] });
          }
        },
        error: function(e) {
          layer.msg("未获取到相关统计信息", { offset: ["325px", "780px"] });
        }
      });
    } else {
      return false;
    }
  });
}
function drawChart1More(xcChart1Dtaas) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("xc_chart1_more"));
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
        fontSize: 14
      },
      left: "30"
    },
    grid: {
      // 控制图的大小，调整下面这些值就可以，
      x: 70,
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
      dimensions: ["product", "总案件量", "制作数量", "合格数量"],
      source: xcChart1Dtaas
    },

    xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: "#c3e7ff",
          width: 2
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
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
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
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
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "white",
                fontSize: 12
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
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "white",
                fontSize: 12
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
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "white",
                fontSize: 12
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
var hegelv = GetPercent(71, 169);
function drawChart2(xcChart2Dtaas) {
  var totleValue = xcChart2Dtaas[0].value + xcChart2Dtaas[1].value;
  var c2hegelv = GetPercent(xcChart2Dtaas[0].value, totleValue);
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("chart2"));

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
      top: 20,
      right: 30
    },
    title: {
      text: "电子卷宗随案生成制作情况统计图 ",
      subtext: "电子卷宗制作率：" + c2hegelv,
      top: 20,
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
      left: "center",
      textStyle: {
        color: "#c3e7ff"
      },
      bottom: 0,
      data: ["上传案件数量", "未上传案件数量"]
    },
    series: [
      {
        name: " ",
        type: "pie",
        radius: ["52%", "35%"],
        center: ["50%", "60%"],
        label: {
          normal: {
            formatter: " {c|{c}}  \n  {b|{b}}  \n\n", //图形外文字上下显示
            borderWidth: 20,
            borderRadius: 4,
            padding: [0, -20], //文字和图的边距
            rich: {
              a: {
                // color: '#eee',
                fontSize: 12,
                lineHeight: 16
              },
              b: {
                //name 文字样式
                fontSize: 12,
                lineHeight: 16
                // color: '#eee'
              },
              c: {
                //value 文字样式
                fontSize: 12,
                lineHeight: 16,
                // color: '#eee',
                align: "center"
              }
            }
          }
        },
        data: xcChart2Dtaas,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          },
          normal: {
            color: function(params) {
              // build a color map as your need.
              var colorList = ["rgb(27,237,185)", "rgb(13,155,143)"];
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

function drawChart3(cityDtaasChatr3) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("chart3"));
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
      top: 20,
      right: 30
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    title: {
      text: "上传案件数量统计图",
      bottom: 8,
      textStyle: {
        //标题颜色
        color: "#c3e7ff",
        fontSize: 14
      },
      left: "center"
    },
    legend: {
      textStyle: {
        color: "#c3e7ff"
      },
      right: 60,
      top: 15,
      show: false
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#c3e7ff",
          width: 2
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
      boundaryGap: [0, 0.01]
    },

    yAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: "#c3e7ff"
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
      data: cityDtaasChatr3.cityNames
    },
    series: [
      {
        name: "上传案件数",
        type: "bar",
        barWidth: 15,
        itemStyle: {
          normal: {
            color: ["rgb(18,205,148)"],
            barBorderRadius: [0, 10, 10, 0],
            label: {
              show: true, //开启显示

              position: "right", //在右方显示
              textStyle: {
                //数值样式
                color: "white",
                fontSize: 12
              }
            }
            // color: function(params) {
            //   // build a color map as your need.
            //   var colorList = ["rgb(91,155,213)"];
            //   return colorList[params.dataIndex];
            // }
          }
        },
        // data: [20, 33, 25, 45, 66, 52, 19, 54, 49, 71, 10, 50]
        data: cityDtaasChatr3.citySource
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

function drawChart4(xcPiedatas) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("chart4"));
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
      top: 7,
      right: 30
    },
    title: {
      text: "电子卷宗质量检查情况分布图",
      bottom: 10,
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
    grid: {
      left: "3%",
      right: "4%",
      bottom: "1%",
      containLabel: true
    },
    legend: {
      orient: "horizontal",
      textStyle: {
        color: "#c3e7ff"
      },
      bottom: 40,
      left: 30,
      data: xcPiedatas.names
    },
    series: [
      {
        name: " ",
        type: "pie",
        radius: ["50%", "65%"],
        // radius : '65%',
        center: ["50%", "50%"],
        label: {
          normal: {
            formatter: " {c|{c}}  \n  {b|{b}}  \n\n", //图形外文字上下显示
            borderWidth: 10,
            borderRadius: 1,
            padding: [0, 0], //文字和图的边距
            rich: {
              a: {
                // color: '#eee',
                fontSize: 12,
                lineHeight: 12
              },
              b: {
                //name 文字样式
                fontSize: 12,
                lineHeight: 12
                // color: '#eee'
              },
              c: {
                //value 文字样式
                fontSize: 12,
                lineHeight: 12,
                // color: '#eee',
                align: "center"
              }
            }
          }
        },
        data: xcPiedatas.source,
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
                "rgb(46,72,215)",
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

function drawChart5(data) {
  console.log(data.names.length)
  console.log(data.source.length)
  if (data.names.length == 0 || data.source.length == 0) {
    $("#chart5").html("<span>电子卷宗随案生成质量问题暂无数据</span>");
    $("#chart5").css({
      float: "right",
      textAlign: 'center',
    });
    $("#chart5 span").css({
      letterSpacing: "1px",
      display: "inline-block",
      marginTop: "5px",
      fontSize:"16px",
      color: "#c3e7ff"
    });
    return
  }
  var myChart = echarts.init(document.getElementById("chart5"));
  var option = {
    title: {
      text: "电子卷宗随案生成质量问题分布图",
      bottom: 10,
      left: 0,
      textStyle: {
        //标题颜色
        color: "#c3e7ff",
        fontSize: 14
      },
      left: "center"
    },
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
      top: 6,
      right: 30
    },
    color: ["rgba(46,163,253,0.8)"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        // lineStyle : {          // 直线指示器样式设置
        //     color: '#48b',
        //     width: 2,
        //     type: 'solid'
        // },
        shadowStyle: {
          // 阴影指示器样式设置
          width: "auto", // 阴影大小
          color: "rgba(150,150,150,0.3)" // 阴影颜色
        }
      }
    },
    grid: {
      left: "0%",
      right: "12%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: [
      {
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
          rotate: -40
        },
        data: data.names,
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#315070"],
            width: 1,
            type: "solid"
          }
        }, //网格线
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#315070"],
            width: 1,
            type: "solid"
          }
        } //网格线
      }
    ],
    series: [
      {
        name: "案件数量",
        type: "bar",
        barWidth: "30%",
        data: data.source,
        itemStyle: {
          emphasis: {
            // show:false,
            shadowBlur: 10,
            shadowOffsetX: 0
            // shadowColor: "rgba(0, 0, 0, 0.5)"
          },
          normal: {
            // color: function(params) {
            //   // build a color map as your need.
            //   var colorList = ["#31ddaa", "#7176e2"];
            //   return colorList[params.dataIndex];
            // },
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "#fff",
                fontSize: 14
              }
            }
          }
        }
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

function drawChart6(xcChart6Dtaas) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("chart6"));
  var totleValue = xcChart6Dtaas[0].value + xcChart6Dtaas[1].value;
  var c2hegelv = GetPercent(xcChart6Dtaas[0].value, totleValue);
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
      top: 20,
      right: 30
    },
    title: {
      text: "电子卷宗质量情况统计图",
      subtext: "电子卷宗合格率：" + c2hegelv,
      top: 20,
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
      left: "center",
      textStyle: {
        color: "#c3e7ff"
      },
      bottom: 0,
      data: ["合格数量", "不合格数量"]
    },
    series: [
      {
        name: " ",
        type: "pie",
        radius: ["52%", "35%"],
        center: ["50%", "60%"],
        label: {
          normal: {
            formatter: " {c|{c}}  \n  {b|{b}}  \n\n", //图形外文字上下显示
            borderWidth: 20,
            borderRadius: 4,
            padding: [0, 10], //文字和图的边距
            rich: {
              a: {
                // color: '#eee',
                fontSize: 12,
                lineHeight: 16
              },
              b: {
                //name 文字样式
                fontSize: 12,
                lineHeight: 16
                // color: '#eee'
              },
              c: {
                //value 文字样式
                fontSize: 12,
                lineHeight: 16,
                // color: '#eee',
                align: "center"
              }
            }
          }
        },
        data: xcChart6Dtaas,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          },
          normal: {
            color: function(params) {
              // build a color map as your need.
              var colorList = ["rgb(44,188,253)", "rgb(15,103,161)"];
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

function drawChart7(xccityDtaasChatr7) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("chart7"));
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
      top: 20,
      right: 30
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    title: {
      text: "合格案件数量统计图",
      bottom: 0,
      textStyle: {
        //标题颜色
        color: "#c3e7ff",
        fontSize: 14
      },
      left: "center"
    },
    legend: {
      textStyle: {
        color: "#c3e7ff"
      },
      right: 60,
      top: 15,
      show: false
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#c3e7ff",
          width: 2
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: "#c3e7ff"
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
      data: xccityDtaasChatr7.cityNames
    },
    series: [
      {
        name: "合格案件数",
        type: "bar",
        barWidth: 15,
        itemStyle: {
          normal: {
            color: ["rgb(47,157,258)"],
            barBorderRadius: [0, 10, 10, 0],
            label: {
              show: true, //开启显示

              position: "right", //在右方显示
              textStyle: {
                //数值样式
                color: "white",
                fontSize: 12
              }
            }
            // color: function(params) {
            //   // build a color map as your need.
            //   var colorList = ["rgb(91,155,213)"];
            //   return colorList[params.dataIndex];
            // }
          }
        },
        data: xccityDtaasChatr7.citySource
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

function drawChart8(xcChart8datas) {
  var myChart = echarts.init(document.getElementById("chart8"));
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
      text: "年度电子卷宗制作与质检趋势图",
      textStyle: {
        //标题颜色
        color: "#c3e7ff",
        fontSize: 14
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
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
      axisLabel: {
        interval: 0,
        textStyle: {
          color: "#c3e7ff"
        }
        // rotate: -40
      },
      boundaryGap: false,
      data: xcChart8datas.times
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#c3e7ff",
          width: 2
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
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
            color: ["#90ec7d"],
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "white",
                fontSize: 12
              }
            }
          }
        },
        data: xcChart8datas.allCaseNum
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
        data: xcChart8datas.upLoadCaseNum
      },
      {
        name: "合格案件数量",
        type: "line",
        symbol: "circle", //设定为实心点
        symbolSize: 10, //设定实心点的大小
        itemStyle: {
          normal: {
            // color:["#0064fa"]
            color: ["#fd8433"]
          }
        },
        data: xcChart8datas.passCaseCount
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
