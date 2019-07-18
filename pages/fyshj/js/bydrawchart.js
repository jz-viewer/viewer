function bydrawChart1(byChart1Dtaas) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("by_chart1"));
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
      text: "本月电子卷宗制作与质检情况庭室统计表",
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
      x: 50,
      x2: 50,
      y: 100,
      y2: 80 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
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
      source: byChart1Dtaas
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
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
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
                color: "#fff",
                 fontSize: 12
              }
            },
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
                color: "#fff",
                 fontSize: 12
              }
            },
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
                color: "#fff",
                 fontSize: 12
              }
            },
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
function bydrawChart1More(byChart1Dtaas) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("by_chart1_more"));
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
      text: "本月电子卷宗制作与质检情况庭室统计表",
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
      x: 50,
      x2: 50,
      y: 100,
      y2: 60 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
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
      source: byChart1Dtaas
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
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      }, //网格线
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

function bydrawChart2(byChart2Dtaas) {
  var totleValue = byChart2Dtaas[0].value + byChart2Dtaas[1].value;
  var byc2hegelv = GetPercent(byChart2Dtaas[0].value,totleValue);
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("by_chart2"));

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
      text: "本月电子卷宗随案生成制作情况统计图",
      subtext: "电子卷宗制作率：" + byc2hegelv,
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
        center: ["50%", "50%"],
        label: {
          normal: {
              formatter: ' {c|{c}}  \n  {b|{b}}  \n\n',       //图形外文字上下显示
              borderWidth: 20,
              borderRadius: 4,
              padding: [0, -20],          //文字和图的边距
              rich: {
                  a: {
                      // color: '#eee',
                      fontSize: 12,
                      lineHeight: 16
                  },
                  b: {                        //name 文字样式
                      fontSize: 12,
                      lineHeight: 16,
                      // color: '#eee'
                  },
                  c: {                   //value 文字样式
                      fontSize: 12,
                      lineHeight: 16,
                      // color: '#eee',
                      align:"center"
                  }
              }
          }
      },
        data:byChart2Dtaas,
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
            },
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "#fff",
                fontSize: 14
              }
            },
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

function bydrawChart3(byChart3Dtaas) {
  var totleValue = byChart3Dtaas[0].value + byChart3Dtaas[1].value;
  var byc3hegelv = GetPercent(byChart3Dtaas[0].value,totleValue);
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("by_chart3"));

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
      text: "本月电子卷宗质量情况统计图",
      subtext: "电子卷宗合格率：" + byc3hegelv,
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
              formatter: ' {c|{c}}  \n  {b|{b}}  \n\n',       //图形外文字上下显示
              borderWidth: 20,
              borderRadius: 4,
              padding: [0, -20],          //文字和图的边距
              rich: {
                  a: {
                      // color: '#eee',
                      fontSize: 12,
                      lineHeight: 16
                  },
                  b: {                        //name 文字样式
                      fontSize: 12,
                      lineHeight: 16,
                      // color: '#eee'
                  },
                  c: {                   //value 文字样式
                      fontSize: 12,
                      lineHeight: 16,
                      // color: '#eee',
                      align:"center"
                  }
              }
          }
      },
        data: byChart3Dtaas,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          },
          normal: {
            color: function(params) {
              // build a color map as your need.
              var colorList = ["rgb(15,103,161)", "rgb(44,188,253)"];
              return colorList[params.dataIndex];
            },
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "#fff",
                fontSize: 14
              }
            },
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

function bydrawChart4(byPieDatas) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("by_chart4"));
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
      top: 27,
      right: 30
    },
    title: {
      text: "电子卷宗质量检查情况分布图",
      top: 20,
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
      data: byPieDatas.names
    },
    series: [
      {
        name: " ",
        type: "pie",
        //   radius: ["50%", "65%"],
        radius: "50%",
        center: ["50%", "50%"],
        label: {
          normal: {
              formatter: ' {c|{c}}  \n  {b|{b}}  \n\n',       //图形外文字上下显示
              borderWidth: 20,
              borderRadius: 4,
              padding: [0, -20],          //文字和图的边距
              rich: {
                  a: {
                      // color: '#eee',
                      fontSize: 12,
                      lineHeight: 16
                  },
                  b: {                        //name 文字样式
                      fontSize: 12,
                      lineHeight: 16,
                      // color: '#eee'
                  },
                  c: {                   //value 文字样式
                      fontSize: 12,
                      lineHeight: 16,
                      // color: '#eee',
                      align:"center"
                  }
              }
          }
      },
        data: byPieDatas.source,
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

function bydrawChart5(data) {
  if (data.names.length == 0 || data.source.length == 0) {
    $("#by_chart5").html("<span>电子卷宗随案生成质量问题暂无数据</span>");
    $("#by_chart5").css({
      float: "right",
      textAlign: 'center',
    });
    $("#by_chart5 span").css({
      letterSpacing: "1px",
      display: "inline-block",
      marginTop: "15px",
      fontSize:"16px",
      color: "#c3e7ff"
    });
    return
  }
  var myChart = echarts.init(document.getElementById("by_chart5"));
  var option = {
    title: {
      text: " 电子卷宗不合格原因分布图",
      top: 10,
      left: 0,
      textStyle: {
        //标题颜色
        color: "#c3e7ff",
        fontSize: 14
      }
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
      top: 20,
      right: 30
    },
    color: ["rgba(46,163,253,0.8)"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
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
          rotate: -30
        },
        data: data.names,
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
        }, //网格线
      },
    ],
    series: [
      {
        name: "案件数量",
        type: "bar",
        barWidth: "30%",
        data: data.source,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0
            // shadowColor: "rgba(0, 0, 0, 0.5)"
          },
          normal: {
            color: ["#2f99eb"],
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "white",
                color: "#fff",
                 fontSize: 12
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

function bydrawChart6(data) {
  var myChart = echarts.init(document.getElementById("by_chart6"));
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
      top: -5,
      right: 30
    },
    title: {
      text: "年度电子卷宗制作与质检趋势图",
      textStyle: {
        //标题颜色
        color: "#c3e7ff",
        fontSize: 14
      },
      top: -2,
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
      top: -2,
      right: 70
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
      data: data.times
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
                color: "#fff",
                fontSize: 14
              }
            },
          }
        },
        // areaStyle: {
        //     normal: {
        //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //         {
        //           offset: 0,
        //           color: "#1ad3df" //线条填充颜色
        //         }
        //       ])
        //     }
        //   },
        data: data.allCaseNum
      },
      {
        name: "已上传案件数量",
        type: "line",
        symbol: "circle", //设定为实心点
        symbolSize: 10, //设定实心点的大小
        // areaStyle: {
        //   normal: {
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //       {
        //         offset: 0,
        //         color: "#66aede" //线条填充颜色
        //       }
        //     ])
        //   }
        // },
        itemStyle: {
          normal: {
            // color:["#864efb"]
            color: ["#66aede"]
          }
        },
        data: data.upLoadCaseNum
      },
      {
        name: "合格案件数量",
        type: "line",
        symbol: "circle", //设定为实心点
        symbolSize: 10, //设定实心点的大小
        itemStyle: {
          normal: {
            // color:["#0064fa"]
            color: ["#1ad3df"],
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "#fff",
                fontSize: 14
              }
            },
          }
        },
        // areaStyle: {
        //     normal: {
        //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //         {
        //           offset: 0,
        //           color: "#90ec7d" //线条填充颜色
        //         }
        //       ])
        //     }
        //   },
        data: data.passCaseCount
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
