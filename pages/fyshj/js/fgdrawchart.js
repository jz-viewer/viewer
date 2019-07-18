function fgdrawChart1(data) {
  var myChart = echarts.init(document.getElementById("fg_chart1"));
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
      text: "2019年电子卷宗制作与质检趋势图",
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
            color: ["#90ec7d"],
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "#fff",
                fontSize: 12
              }
            }
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
                fontSize: 12
              }
            }
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
}

function fgdrawChart2(fgChart2Datas) {
  // 基于准备好的dom，初始化echarts图表
  var totleValue = fgChart2Datas[0].value + fgChart2Datas[1].value;
  var fgc3hegelv = GetPercent(fgChart2Datas[0].value, totleValue);
  var myChart = echarts.init(document.getElementById("fg_chart2"));
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
      top: 57,
      right: 30
    },
    title: {
      text: " 电子卷宗质量情况统计图",
      subtext: "电子卷宗合格率：" + fgc3hegelv,
      top: 60,
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
      left: 130,
      data: ["合格案件数量", "不合格案件数量"]
    },
    series: [
      {
        name: " ",
        type: "pie",
        //   radius: ["50%", "65%"],
        radius: "50%",
        center: ["50%", "50%"],
        // label: {
        //   normal: {
        //     formatter: "{b}:{c}: ({d}%)",
        //     textStyle: {
        //       fontWeight: "normal",
        //       fontSize: 15
        //     }
        //   }
        // },
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
        data: fgChart2Datas,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          },
          normal: {
            color: function(params) {
              // build a color map as your need.
              var colorList = ["#31ddaa", "#7176e2"];
              return colorList[params.dataIndex];
            },
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "#fff",
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
}
function fgdrawChart30(fgChart3Datas) {

  // 基于准备好的dom，初始化echarts图表
  var totleValue = fgChart3Datas[0].value + fgChart3Datas[1].value;
  var fgc3hegelv = GetPercent(fgChart3Datas[0].value, totleValue);
  var myChart = echarts.init(document.getElementById("fg_chart3"));
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
      top: 57,
      right: 30
    },
    title: {
      text: " 电子卷宗质量情况统计图",
      subtext: "电子卷宗合格率：" + fgc3hegelv,
      top: 60,
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
      left: 130,
      data: ["合格案件数量", "不合格案件数量"]
    },
    series: [
      {
        name: " ",
        type: "pie",
        //   radius: ["50%", "65%"],
        radius: "50%",
        center: ["50%", "50%"],
        data: fgChart3Datas,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          },
          normal: {
            color: function(params) {
              // build a color map as your need.
              var colorList = ["#31ddaa", "#7176e2"];
              return colorList[params.dataIndex];
            },
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "#fff",
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
}

function fgdrawChart3(data) {
  if (data.names.length == 0 || data.source.length == 0) {
    $("#fg_chart3").html("<span>电子卷宗随案生成质量问题暂无数据</span>");
    $("#fg_chart3").css({
      float: "right",
      textAlign: 'center',
    });
    $("#fg_chart3 span").css({
      letterSpacing: "1px",
      display: "inline-block",
      marginTop: "0px",
      fontSize:"14px",
      color: "#c3e7ff"
    });
    return
  }
  var myChart = echarts.init(document.getElementById("fg_chart3"));
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
      top: 10,
      right: 50
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
          rotate: -40
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
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#315070"],
            width: 1,
            type: "solid"
          }
        }, //网格线
        min: function(v) {
          return (v = 1);
        },
        axisLine: {
          lineStyle: {
            color: "#c3e7ff"
          }
        }
      }
    ],
    series: [
      {
        name: "案件数量",
        type: "bar",
        barWidth: "20%",
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
        },
        data: data.source
      }
    ]
  };
  myChart.setOption(option);
}

function fgdrawChart4(datas) {
  // 基于准备好的dom，初始化echarts图表
  var myChart = echarts.init(document.getElementById("fg_chart4"));
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
      text: " 电子卷宗制作人员总体情况柱状图",
      top: 15,
      textStyle: {
        //标题颜色
        color: "#c3e7ff",
        fontSize: 14
      },
      left: 10
    },
    grid: {
      // 控制图的大小，调整下面这些值就可以，
      x: 30,
      x2: 10,
      y: 100,
      y2: 30 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
    },
    legend: {
      textStyle: {
        color: "#c3e7ff"
      },
      right: 10,
      top: 55
    },
    tooltip: {},
    dataset: {
      dimensions: ["name", "制作数量", "合格数量"],
      source: datas
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
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#315070"],
          width: 1,
          type: "solid"
        }
      } //网格线
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
            color: ["#5debf0"],
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
}
