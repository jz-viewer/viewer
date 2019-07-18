myControllers.controller("appController", function(
  $rootScope,
  $scope,
  services,
  $compile
) {
  //-----------------
  //服务接口-begin
  //-----------------
  $rootScope.serviceAPI = {
    //变更卡口
    _tollgatelogic: function(param) {
      return $rootScope.serverAction(
        $rootScope.ctxPath + "../business/tollgatelogic.php",
        param
      );
    }
  };
  $.dataTrans.paramParse();
  $.dataTrans.getCaseInfo();
  $scope.caseinfo = $.dataTrans.caseInfo;
  if($.dataTrans.urlParam.checkCaseResult == 0){
    $(".xiangqing").css({
    cursor: "not-allowed",
    pointerEvents: "none"
    });
    $(".menu-tool div.xiangqing span").css({
      color:  "#ccc"
    })
  }
});

var rulingTypeId = 8; //执行线索案件类型id

$.dataTrans = new DataTrans();
$.treeOp = new TreeOp();
$.coolalbum = new CoolAlbum();

var FileExt = function() {
  var self = this;

  self.curJObj = {};
  self.scale = 1;
};
FileExt.prototype = {
  larger: function() {
    var self = this;
    var jObj = self.curJObj;
    if (typeof jObj == "undefined" || jObj == null || jObj == "") {
      console.log("加载文件为空");
      return;
    }
    self.scale = self.scale * 1.25;

    if (jObj.ftype == "pic") {
      var $img = $("#fileBox").find("img");
      $img.css({
        width: 565 * self.scale,
        height: 800 * self.scale
      });
    }
  },
  smaller: function() {
    var self = this;
    var jObj = self.curJObj;
    if (
      typeof jObj == "undefined" ||
      jObj == null ||
      jObj == "" ||
      jObj == {}
    ) {
      console.log("加载文件为空");
      return;
    }
    self.scale = self.scale * 0.8;

    if (jObj.ftype == "pic") {
      var $img = $("#fileBox").find("img");
      $img.css({
        width: 565 * self.scale,
        height: 800 * self.scale
      });
    }
  },
  showPicBtn: function() {
    $(".panno").show();
    $(".p-big").show();
    $(".small").show();
    $(".taggle-anno").show();
  },
  showNoPicBtn: function() {
    $(".panno").hide();
    $(".p-big").hide();
    $(".small").hide();
    $(".taggle-anno").hide();
  },
  loadFileDom: function(fileid) {
    var jObj = $.dataTrans.filesMap.get(fileid);

    var fileExt = this;
    fileExt.curJObj = jObj;
    fileExt.scale = 1;

    //清空之前显示的文件信息
    $("#fileBox").empty();
    $(".cshelter").remove();
    $("#canvasBox").remove();

    if (typeof jObj == "undefined" || jObj == null || jObj == "") {
      console.log("加载文件为空");
      $("#fileBox").append(
        "<div style='font-size:16px;height:50px;line-height:50px;text-align: center;'><span style='text-align: center;'>无数据</span></div>"
      );
      return;
    }
    if (jObj.ftype == "pic") {
      fileExt.showPicBtn();
      $("#fileBox").append("<div style='display: inline;'></div>");
      $("#fileBox")
        .children("div")
        .append(
          "<img width='565' height='800' style='border: solid 1px;' src='" +
            jObj.osrc +
            "'>"
        );
      $("body").append(
        "<div class='cshelter' style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;z-index: 100;display:none;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>"
      );
      $("body").append(
        "<div id='canvasBox' style='position:absolute;top:50%;left: 50%;margin-top:-400px;margin-left:-282px;width:565px;height:860px;z-index: 200;display: none;'>" +
          "<canvas width='565' height='800' " +
          "style='' " +
          "id='filecanvas'></canvas>" +
          "<div style='width:565px;height:60px;text-align: center;'>" +
          "<button class='square tool-button' style='margin-left: 20px;'><i class='fa fa-square-o' aria-hidden='true'></i></button>" +
          "<button class='circle tool-button' style='margin-left: 20px;'><i class='fa fa-circle-o' aria-hidden='true'></i></button>" +
          "<button class='font tool-button' style='margin-left: 20px;'><i class='fa fa-font' aria-hidden='true'></i></button>" +
          "<img class='save' style='margin-left: 20px;' src='css/images/save.png'>" +
          "<img class='back' style='margin-left: 20px;' src='css/images/back.png'>" +
          "</div>" +
          "</div>"
      );

      /*var $fnote = $.fnote.createNote(10, 10, "测试")
            $("#fileBox").append($fnote);*/

      var annoData = $.dataTrans.caseAnno[jObj.fileId];
      if (
        typeof annoData != "undefined" &&
        annoData != "undefined" &&
        annoData != ""
      ) {
        for (var i = 0; i < annoData.length; i++) {
          var $fnote = $.fnote.createNote(
            annoData[i].fileAnnotationId,
            annoData[i].abscissa,
            annoData[i].ordinate,
            $("#fileBox").find("img")[0].offsetLeft,
            $("#fileBox").find("img")[0].offsetTop,
            annoData[i].content
          );
          $("#fileBox").append($fnote);
        }
      }
    } else if (jObj.ftype == "pdf") {
      fileExt.showNoPicBtn();
      $("#fileBox").append(
        "<div id='pdfbox' style='text-align:center;width: 664px;height: 800px;'></div>"
      );
      var options = {
        pdfOpenParams: {
          /*navpanes: 1,
                    toolbar: 0,
                    statusbar: 0,
                    view: "FitV",
                    pagemode: "thumbs",
                    nameddest: "test"*/
        }
        /*forcePDFJS: true,*/
        /*PDFJS_URL: "../../plugin/pdfobject/web/viewer.html"*/
      };

      PDFObject.embed(jObj.osrc, "#pdfbox", options);
      /*$("")
            $("#title").attr("title",jObj.fileName);*/
    } else if (jObj.ftype == "doc") {
      /*var name = jObj.attr("name");
            var index = name.lastIndexOf(".");
            var ext = name.substr(index+1);*/
      //$("#fileBox").append("<div id='wordbox' style='width: 564px;height: 800px;'></div>");
      //$("#wordbox").append("<embed type='application/vnd.openxmlformats-officedocument.wordprocessingml.document' src='"+jObj.attr("osrc")+"'>");

      fileExt.showNoPicBtn();
      $("#fileBox").append(
        "<div id='pdfbox' style='text-align:center;width: 664px;height: 800px;'></div>"
      );
      PDFObject.embed(jObj.osrc, "#pdfbox");
    } else if (jObj.ftype == "excel") {
      fileExt.showNoPicBtn();
      $("#fileBox").append(
        "<div id='excelbox' style='text-align:center;width: 664px;height: 800px;'></div>"
      );
      $("#excelbox").load(
        "/court/files/downLoadExcel/?fileId=" +
          jObj.fileId +
          "&subCaseId=" +
          jObj.subCaseId,
        function(responseTxt, statusTxt, xhr) {
          if (statusTxt == "success") {
            if (responseTxt == "") {
              $("#excelbox").html("加载失败");
            }
          }
          if (statusTxt == "error") {
            $("#excelbox").html("加载失败");
            layer.msg("加载失败");
          }
        }
      );
      /*PDFObject.embed(jObj.osrc, "#pdfbox");*/
      /*PDFObject.embed(fileInfo.osrc, "#pdfbox");*/
    } else {
      fileExt.showNoPicBtn();
      $("#fileBox").append(
        "<div id='mediabox' style='text-align:center;width: 664px;height: 300px;'>" +
          "<video autoplay controls src='" +
          jObj.osrc +
          "'></video>" +
          "</div>"
      );
      /*$("#jquery_jplayer_1").jPlayer({
                supplied: 'mp3,mp4',
                size:{
                    width: 664,
                    height: 300,
                    cssClass: "jp-video-720p"
                }
            });
            $("#jquery_jplayer_1").jPlayer('setMedia',{
                title: jObj.attr("name"),
                mp3:jObj.attr("osrc"),
                mp4:jObj.attr("osrc"),
            });
            $("#jquery_jplayer_1").jPlayer('load');
            $("#jquery_jplayer_1").jPlayer('play');*/
    }
    fileExt.showFileNameMsg(jObj.fileName);
  },
  showFileNameMsg: function(filename) {
    $(".fnmsg").text(filename);
  }
};
$.fileExt = new FileExt();

var JCanvasExt = function() {
  var self = this;

  self.state = 0; //0:非圈注状态;1:长方形绘图；2.椭圆形绘图；3.文字圈注
  self.layers = {};
  self.addLayers = {};
  self.rmLayers = {};
};
JCanvasExt.prototype = {
  loadImgUrl: function(canvasId, url) {
    var canvasExt = this;
    $("#" + canvasId).clearCanvas();
    $("#" + canvasId)
      .addLayer({
        type: "image",
        source: url,
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        fromCenter: false,
        load: function() {}
      })
      .drawLayers();
    $("#" + canvasId).saveCanvas();
  },
  loadImgDom: function(canvasId, dom) {
    $("#" + canvasId).clearCanvas();
    var canvasExt = this;
    $("#" + canvasId)
      .addLayer({
        type: "image",
        source: dom,
        x: 0,
        y: 0,
        width: 565,
        height: 800,
        fromCenter: false,
        load: function() {}
      })
      .drawLayers();
    $("#" + canvasId).saveCanvas();

    canvasExt.src = $(dom).attr("src");

    var layers = $.jCanvasExt.layers;
    //已有圈注加载
    for (var item in layers) {
      var layer = layers[item];
      $("#" + canvasId).addLayer({
        type: layer.type,
        strokeStyle: "red",
        strokeWidth: 1,
        name: layer.name,
        fromCenter: false,
        x: layer.left,
        y: layer.right,
        width: layer.width,
        height: layer.height,
        text: layer.text,
        mouseover: function(layer) {
          $(this).animateLayer(
            layer,
            {
              strokeWidth: "5"
            },
            500
          );
        },
        mouseout: function(layer) {
          $(this).animateLayer(
            layer,
            {
              strokeWidth: "1"
            },
            500
          );
        },
        dblclick: function(clayer) {
          $("#filecanvas").removeLayer(clayer.name);
          $("#filecanvas").drawLayers();
          $("#filecanvas").saveCanvas();

          delete $.jCanvasExt.layers[clayer.name];
        }
      });

      $("#filecanvas").drawLayers();
    }
    $("#filecanvas").saveCanvas();
  },
  drawText: function(canvasId, penColor, strokeWidth) {
    var that = this;
    that.penColor = penColor;
    that.penWidth = strokeWidth;

    var canvas = $("#" + canvasId)[0];

    //canvas 的矩形框
    var canvasRect = canvas.getBoundingClientRect();
    //矩形框的左上角坐标
    var canvasLeft = canvasRect.left;
    var canvasTop = canvasRect.top;

    var layerIndex = layerNum;
    var layerName = "layer";
    var x = 0;
    var y = 0;

    //鼠标点击按下事件，画图准备
    canvas.onmousedown = function(e) {
      //设置画笔颜色和宽度
      var color = that.penColor;
      var penWidth = that.penWidth;

      layerIndex++;
      layerNum++;
      layerName += layerIndex;
      x = e.clientX - canvasLeft;
      y = e.clientY - canvasTop;

      $("#" + canvasId).addLayer({
        type: "rectangle",
        strokeStyle: color,
        strokeWidth: penWidth,
        name: layerName,
        fromCenter: false,
        x: x,
        y: y,
        width: 1,
        height: 1
      });

      $("#" + canvasId).drawLayers();
      $("#" + canvasId).saveCanvas();
      //鼠标移动事件，画图
      canvas.onmousemove = function(e) {
        width = e.clientX - canvasLeft - x;
        height = e.clientY - canvasTop - y;

        $("#" + canvasId).removeLayer(layerName);

        $("#" + canvasId).addLayer({
          type: "rectangle",
          strokeStyle: color,
          strokeWidth: penWidth,
          name: layerName,
          fromCenter: false,
          x: x,
          y: y,
          width: width,
          height: height
        });

        $("#" + canvasId).drawLayers();
      };
    };

    canvas.onmouseup = function(e) {
      var color = that.penColor;
      var penWidth = that.penWidth;

      canvas.onmousemove = null;

      width = e.clientX - canvasLeft - x;
      height = e.clientY - canvasTop - y;

      $("#" + canvasId).removeLayer(layerName);

      $("#" + canvasId).drawLayers();

      $("body").append(
        "<div id='editShl' style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;z-index: 320;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>"
      );

      $("body").append(
        '<div id="fontEdit" style="text-align: left;display:none;float: inherit;position: absolute;border: 0.5px dotted #000;z-index: 350;background-color: #777;">\n' +
          '                            <textarea style="text-align: left" contenteditable="true"></textarea>\n' +
          "<div style='position:absolute;bottom: 0px;right: 0px;'><img class='save' src='css/images/save.png'><img class='del' src='css/images/delete.png'>" +
          "                        </div>"
      );

      var fWidth;
      var fHeight;
      if (width < 100) {
        fWidth = 100;
      } else {
        fWidth = width;
      }
      if (height < 30) {
        fHeight = 30;
      } else {
        fHeight = height;
      }
      $("#fontEdit").css({
        display: "block",
        left: canvasLeft + x,
        top: canvasTop + y,
        width: fWidth,
        height: fHeight
      });
      $("#fontEdit").find("textarea").innerText = "";
      $("#fontEdit")
        .find("textarea")
        .focus();
      $("#fontEdit")
        .find("textarea")
        .css({
          width: fWidth,
          height: fHeight
        });
      $("#fontEdit")
        .find(".save")
        .bind("click", function() {
          var text = $("#fontEdit")
            .find("textarea")
            .val();
          $("#editShl").remove();

          $("#" + canvasId).addLayer({
            type: "text",
            strokeStyle: color,
            strokeWidth: penWidth,
            name: layerName,
            text: text,
            fromCenter: false,
            x: x,
            y: y,
            width: width,
            height: height,
            dblclick: function(clayer) {
              $("#" + canvasId).removeLayer(clayer.name);
              $("#" + canvasId).drawLayers();
              $("#" + canvasId).saveCanvas();

              var layer = {
                type: clayer.type,
                name: clayer.name,
                left: clayer.x,
                right: clayer.y,
                width: clayer.width,
                height: clayer.height,
                fileId: $.fileExt.curJObj.fileId,
                scid: $.fileExt.curJObj.subCaseId,
                imgWidth: 565,
                imgHeight: 600
              };
              delete $.jCanvasExt.layers[layerName];
            }
          });

          var layer = {
            type: "text",
            name: layerName,
            left: x,
            right: y,
            width: width,
            height: height,
            fileId: $.fileExt.curJObj.fileId,
            scid: $.fileExt.curJObj.subCaseId,
            imgWidth: 565,
            imgHeight: 600,
            text: text
          };
          $.jCanvasExt.layers[layerName] = layer;

          $("#" + canvasId).drawLayers();
          $("#" + canvasId).saveCanvas();

          $("#fontEdit").remove();
        });
      $("#fontEdit")
        .find(".del")
        .bind("click", function() {
          $("#editShl").remove();
          $("#fontEdit").remove();
        });
    };
  },
  drawEllipse: function(canvasId, penColor, strokeWidth) {
    var that = this;
    that.penColor = penColor;
    that.penWidth = strokeWidth;

    var canvas = $("#" + canvasId)[0];

    //canvas 的矩形框
    var canvasRect = canvas.getBoundingClientRect();
    //矩形框的左上角坐标
    var canvasLeft = canvasRect.left;
    var canvasTop = canvasRect.top;

    var layerIndex = layerNum;
    var layerName = "layer";
    var x = 0;
    var y = 0;

    //鼠标点击按下事件，画图准备
    canvas.onmousedown = function(e) {
      //设置画笔颜色和宽度
      var color = that.penColor;
      var penWidth = that.penWidth;

      layerIndex++;
      layerNum++;
      layerName += layerIndex;
      x = e.clientX - canvasLeft;
      y = e.clientY - canvasTop;

      $("#" + canvasId).addLayer({
        type: "ellipse",
        strokeStyle: color,
        strokeWidth: penWidth,
        name: layerName,
        fromCenter: false,
        x: x,
        y: y,
        width: 1,
        height: 1
      });

      $("#" + canvasId).drawLayers();
      $("#" + canvasId).saveCanvas();
      //鼠标移动事件，画图
      canvas.onmousemove = function(e) {
        width = e.clientX - canvasLeft - x;
        height = e.clientY - canvasTop - y;

        $("#" + canvasId).removeLayer(layerName);

        $("#" + canvasId).addLayer({
          type: "ellipse",
          strokeStyle: color,
          strokeWidth: penWidth,
          name: layerName,
          fromCenter: false,
          x: x,
          y: y,
          width: width,
          height: height
        });

        $("#" + canvasId).drawLayers();
      };
    };

    canvas.onmouseup = function(e) {
      var color = that.penColor;
      var penWidth = that.penWidth;

      canvas.onmousemove = null;

      width = e.clientX - canvasLeft - x;
      height = e.clientY - canvasTop - y;

      $("#" + canvasId).removeLayer(layerName);

      $("#" + canvasId).addLayer({
        type: "ellipse",
        strokeStyle: color,
        strokeWidth: penWidth,
        name: layerName,
        fromCenter: false,
        x: x,
        y: y,
        width: width,
        height: height,
        mouseover: function(layer) {
          $(this).animateLayer(
            layer,
            {
              strokeWidth: "5"
            },
            500
          );
        },
        mouseout: function(layer) {
          $(this).animateLayer(
            layer,
            {
              strokeWidth: "1"
            },
            500
          );
        },
        dblclick: function(clayer) {
          $("#" + canvasId).removeLayer(clayer.name);
          $("#" + canvasId).drawLayers();
          $("#" + canvasId).saveCanvas();

          var layer = {
            type: clayer.type,
            name: clayer.name,
            left: clayer.x,
            right: clayer.y,
            width: clayer.width,
            height: clayer.height,
            fileId: $.fileExt.curJObj.fileId,
            scid: $.fileExt.curJObj.subCaseId,
            imgWidth: 565,
            imgHeight: 600
          };
          delete $.jCanvasExt.layers[layerName];
        }
      });

      var layer = {
        type: "ellipse",
        name: layerName,
        left: x,
        right: y,
        width: width,
        height: height,
        fileId: $.fileExt.curJObj.fileId,
        scid: $.fileExt.curJObj.subCaseId,
        imgWidth: 565,
        imgHeight: 600
      };
      $.jCanvasExt.layers[layerName] = layer;

      $("#" + canvasId).drawLayers();
      $("#" + canvasId).saveCanvas();
    };
  },
  drawRect: function(canvasId, penColor, strokeWidth) {
    var that = this;
    that.penColor = penColor;
    that.penWidth = strokeWidth;

    var canvas = $("#" + canvasId)[0];

    //canvas 的矩形框
    var canvasRect = canvas.getBoundingClientRect();
    //矩形框的左上角坐标
    var canvasLeft = canvasRect.left;
    var canvasTop = canvasRect.top;

    var layerIndex = layerNum;
    var layerName = "layer";
    var x = 0;
    var y = 0;

    //鼠标点击按下事件，画图准备
    canvas.onmousedown = function(e) {
      //设置画笔颜色和宽度
      var color = that.penColor;
      var penWidth = that.penWidth;

      layerIndex++;
      layerNum++;
      layerName += layerIndex;
      x = e.clientX - canvasLeft;
      y = e.clientY - canvasTop;

      $("#" + canvasId).addLayer({
        type: "rectangle",
        strokeStyle: color,
        strokeWidth: penWidth,
        name: layerName,
        fromCenter: false,
        x: x,
        y: y,
        width: 1,
        height: 1
      });

      $("#" + canvasId).drawLayers();
      $("#" + canvasId).saveCanvas();
      //鼠标移动事件，画图
      canvas.onmousemove = function(e) {
        width = e.clientX - canvasLeft - x;
        height = e.clientY - canvasTop - y;

        $("#" + canvasId).removeLayer(layerName);

        $("#" + canvasId).addLayer({
          type: "rectangle",
          strokeStyle: color,
          strokeWidth: penWidth,
          name: layerName,
          fromCenter: false,
          x: x,
          y: y,
          width: width,
          height: height
        });
        $("#" + canvasId).drawLayers();
      };
    };

    canvas.onmouseup = function(e) {
      var color = that.penColor;
      var penWidth = that.penWidth;

      canvas.onmousemove = null;

      width = e.clientX - canvasLeft - x;
      height = e.clientY - canvasTop - y;

      $("#" + canvasId).removeLayer(layerName);

      $("#" + canvasId).addLayer({
        type: "rectangle",
        strokeStyle: color,
        strokeWidth: penWidth,
        name: layerName,
        fromCenter: false,
        x: x,
        y: y,
        width: width,
        height: height,
        mouseover: function(layer) {
          $(this).animateLayer(
            layer,
            {
              strokeWidth: "5"
            },
            500
          );
        },
        mouseout: function(layer) {
          $(this).animateLayer(
            layer,
            {
              strokeWidth: "1"
            },
            500
          );
        },
        dblclick: function(clayer) {
          $("#" + canvasId).removeLayer(clayer.name);
          $("#" + canvasId).drawLayers();
          $("#" + canvasId).saveCanvas();

          var layer = {
            type: clayer.type,
            name: clayer.name,
            left: clayer.x,
            right: clayer.y,
            width: clayer.width,
            height: clayer.height,
            fileId: $.fileExt.curJObj.fileId,
            scid: $.fileExt.curJObj.subCaseId,
            imgWidth: 565,
            imgHeight: 600
          };
          delete $.jCanvasExt.layers[layerName];
        }
      });

      var layer = {
        type: "rectangle",
        name: layerName,
        left: x,
        right: y,
        width: width,
        height: height,
        fileId: $.fileExt.curJObj.val(),
        scid: $.fileExt.curJObj.subCaseId,
        imgWidth: 565,
        imgHeight: 600
      };
      $.jCanvasExt.layers[layerName] = layer;

      $("#" + canvasId).drawLayers();
      $("#" + canvasId).saveCanvas();
    };
  }
};
$.jCanvasExt = new JCanvasExt();

$(function() {
  // console.log(location.href.indexOf("zjflag") != -1);
  
  if (location.href.indexOf("zjflag") != -1) {
    $(".dispute-tab ").hide();
    $(".ruling-tab ").hide();
    $(".dispute-edit ").hide();
    $(".panno").hide();
    $(".panno").addClass("hide_btn");
  }
  var directNodes = [];
  var rootid = "";
  $.treeOp.nodeIndex = -1;
  $.treeOp.directIndex = -1;
  $.dataTrans.getExamineData(function(data) {
  
    $.dataTrans.parseDiretWithFilesData(data);
    //获取批注信息
    $.dataTrans.getCaseAnno($.dataTrans.caseInfoId, function(data) {
      $.dataTrans.caseAnno = data;
    });
    function setFontCss(treeId, directNodes) {
      return directNodes.color == "red" ? {color:"rgb(255, 0, 0)"} : {};
    };
    $.treeOp.setDirectTree(directNodes, rootid, $.dataTrans.dirList);
    
    $.treeOp.setting.view = {
      showLine: false,
      fontCss:setFontCss
  };
    var zTreeObj = $.fn.zTree.init(
      $("#demoZtree"),
      $.treeOp.setting,
      directNodes
    ); //初始化树
    $.fn.zTree.getZTreeObj("#demoZtree"); //把得到的树赋给div

    $.dataTrans.directNodes = directNodes;
   
    $.control.init({});

    $.coolalbum._init({
      onCheckAll: function() {},
      onUpload: function(directory) {},
      onUploadSure: function() {},
      onMove: function() {},
      onMoveSure: function(files, target) {
        console.log(files);
        console.log(target);
      },
      onDownLoad: function() {},
      onDelete: function() {},
      onSortSave: function() {},
      onSortRest: function() {}
    });
    $("#demoZtree span").click(function(evenr){
      if($(evenr.target).css("color") == "rgb(255, 0, 0)"){
        layer.msg($.dataTrans.layermsg)
      }
    })
    var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
    var nodes = treeObj.getNodes();
    if (nodes[0]) {
      //触发默认数据的click事件
      $("#" + nodes[0].tId + "_a").click(); //触发ztree点击事件
    }
  });

  /*$.ajax({
        type: "GET",
        url: "../../../court/bjcaseInfo/examine?"+"caseInfoId="+$.dataTrans.caseInfoId+"&comeFrom=1&previewType=1",//链接地址
        dataType: "html",
        success: function (obj) {
            var fileList;
            var dirList;
            var zNodes = [];
            var directNodes = [];


            $.dataTrans.comeFrom=1;

            //转换一下json
            var obj = JSON.parse(obj);
            var caseInfoMap;

            if(obj.code!="0"){
                return;
            }else {
                caseInfoMap  = obj.data
            }
            //获取数据
            if($.dataTrans.comeFrom==1){
                //获取信访
                if(caseInfoMap){
                    var caseNode = caseInfoMap["ThePetition"];
                    var rootid = "";
                    //zNodes[0] = { id:rootid,  name: caseNode.case_code};
                    //zNodes[0].open = true;
                    $.treeOp.nodeIndex = -1;
                    $.treeOp.directIndex = -1;
                    $.treeOp.setCaseTree(zNodes, rootid, caseNode.directoryInfoList, caseNode.fileInfoList,$.treeOp.nodeIndex);
                    $.treeOp.setDirectTree(directNodes, rootid, caseNode.directoryInfoList);
                    fileList = caseNode.fileInfoList;
                    dirList = caseNode.directoryInfoList;
                }
            }else if($.dataTrans.comeFrom==2){
                if($.dataTrans.previewType==1){
                    //只显示本审案件
                    var caseNode = caseInfoMap["thisTrial"];
                    var rootid = 0;
                    var caseName;
                    if(caseNode["caseName"]==null||caseNode["caseName"]==""){
                        caseName = "(本审案件)";
                    }else {
                        caseName = caseNode["caseName"];
                    }
                    zNodes[0] = { id:rootid,  name: caseName, dirId: 0, caseid: caseNode["caseId"]};
                    zNodes[0].ntype= "case";//案件节点
                    $.treeOp.nodeIndex = 0;
                    $.treeOp.directIndex = 0;
                    zNodes[$.treeOp.nodeIndex].open = true;
                    $.treeOp.setCaseTree(zNodes, rootid, caseNode.directoryInfoList, caseNode.fileInfoList,$.treeOp.nodeIndex);
                    $.treeOp.setDirectTree(directNodes, rootid, caseNode.directoryInfoList);
                    fileList = caseNode.fileInfoList;
                    dirList = caseNode.directoryInfoList;
                }else if($.dataTrans.previewType==0){
                    //全部显示
                    var thisTrialCase = caseInfoMap["thisTrial"];
                    var firstTrialCase = caseInfoMap["firstTrial"];
                    var secondTrialCase = caseInfoMap["secondTrial"];

                    var thisRootId = 100000;
                    var firstRootId = 100001;
                    var secondRootId = 100002;


                    $.treeOp.nodeIndex = 0;
                    $.treeOp.directIndex = 0;

                    if(thisTrialCase){
                        var caseName;
                        if(thisTrialCase["caseName"]==null||thisTrialCase["caseName"]==""){
                            caseName = "(本审)";
                        }else {
                            caseName = thisTrialCase["caseName"];
                        }
                        zNodes[$.treeOp.nodeIndex] = { id:thisRootId,  name: caseName, dirId: 0, caseid: thisTrialCase["caseId"]};
                        zNodes[$.treeOp.nodeIndex].open = true;
                        zNodes[$.treeOp.nodeIndex].ntype= "case";//案件节点
                        $.treeOp.setCaseTree(zNodes, thisRootId, thisTrialCase.directoryInfoList, thisTrialCase.fileInfoList);
                        $.treeOp.setDirectTree(directNodes, rootid, caseNode.directoryInfoList);
                        $.treeOp.nodeIndex++;;
                        $.treeOp.directIndex++;
                        fileList = thisTrialCase.fileInfoList;
                        dirList = thisTrialCase.directoryInfoList;
                    }
                    if(firstTrialCase){
                        var caseName;
                        if(firstTrialCase["caseName"]==null||firstTrialCase["caseName"]==""){
                            caseName = "(一审)";
                        }else {
                            caseName = firstTrialCase["caseName"];
                        }
                        zNodes[$.treeOp.nodeIndex] = { id:firstRootId,  name: caseName, dirId: 0, caseid: firstTrialCase["caseId"]};
                        zNodes[$.treeOp.nodeIndex].open = true;
                        zNodes[$.treeOp.nodeIndex].ntype= "case";//案件节点
                        $.treeOp.setCaseTree(zNodes, firstRootId, firstTrialCase.directoryInfoList, firstTrialCase.fileInfoList);
                        $.treeOp.setDirectTree(directNodes, rootid, caseNode.directoryInfoList);
                        $.treeOp.nodeIndex++;;
                        $.treeOp.directIndex++;
                        fileList = firstTrialCase.fileInfoList;
                        dirList = firstTrialCase.directoryInfoList;
                    }
                    if(secondTrialCase){
                        var caseName;
                        if(secondTrialCase["caseName"]==null||secondTrialCase["caseName"]==""){
                            caseName = "(二审)";
                        }else {
                            caseName = secondTrialCase["caseName"];
                        }
                        zNodes[$.treeOp.nodeIndex] = { id:secondRootId,  name: caseName, dirId: 0, caseid: secondTrialCase["caseId"]};
                        zNodes[0].open = true;
                        zNodes[$.treeOp.nodeIndex].ntype= "case";//案件节点
                        $.treeOp.setCaseTree(zNodes, secondRootId, secondTrialCase.directoryInfoList, secondTrialCase.fileInfoList);
                        $.treeOp.setDirectTree(directNodes, rootid, caseNode.directoryInfoList);
                        $.treeOp.nodeIndex++;;
                        $.treeOp.directIndex++;
                        fileList = secondTrialCase.fileInfoList;
                        dirList = secondTrialCase.directoryInfoList;
                    }
                }else if($.dataTrans.previewType==2){
                    //显示原审案件
                    var firstTrialCase = caseInfoMap["firstTrial"];
                    var secondTrialCase = caseInfoMap["secondTrial"];

                    var firstRootId = 100001;
                    var secondRootId = 100002;

                    $.treeOp.nodeIndex = 0;
                    $.treeOp.directIndex = 0;

                    if(firstTrialCase){
                        var caseName;
                        if(firstTrialCase["caseName"]==null||firstTrialCase["caseName"]==""){
                            caseName = "(一审)";
                        }else {
                            caseName = firstTrialCase["caseName"];
                        }
                        zNodes[$.treeOp.nodeIndex] = { id:firstRootId,  name: caseName, dirId: 0, caseid: firstTrialCase["caseId"]};
                        zNodes[$.treeOp.nodeIndex].ntype= "case";//案件节点
                        $.treeOp.setCaseTree(zNodes, firstRootId, firstTrialCase.directoryInfoList, firstTrialCase.fileInfoList);
                        $.treeOp.setDirectTree(directNodes, rootid, caseNode.directoryInfoList);
                        $.treeOp.nodeIndex++;
                        $.treeOp.directIndex++;

                        fileList = firstTrialCase.fileInfoList;
                        dirList = firstTrialCase.directoryInfoList;
                    }
                    if(secondTrialCase){
                        var caseName;
                        if(secondTrialCase["caseName"]==null||secondTrialCase["caseName"]==""){
                            caseName = "(二审)";
                        }else {
                            caseName = secondTrialCase["caseName"];
                        }
                        zNodes[$.treeOp.nodeIndex] = { id:secondRootId,  name: caseName, dirId: 0, caseid: secondTrialCase["caseId"]};
                        zNodes[$.treeOp.nodeIndex].ntype= "case";//案件节点
                        $.treeOp.setCaseTree(zNodes, secondRootId, secondTrialCase.directoryInfoList, secondTrialCase.fileInfoList);
                        $.treeOp.setDirectTree(directNodes, rootid, caseNode.directoryInfoList);
                        $.treeOp.nodeIndex++;
                        $.treeOp.directIndex++;

                        fileList = secondTrialCase.fileInfoList;
                        dirList = secondTrialCase.directoryInfoList;
                    }
                }
            }

            $.dataTrans.fileList = fileList;
            $.dataTrans.dirList = dirList;

            var zTreeObj = $.fn.zTree.init($("#demoZtree"), $.treeOp.setting, zNodes);//初始化树
            $.fn.zTree.getZTreeObj("#demoZtree");//把得到的树赋给div

            //默认选择目录及文件
            var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
            var fistChildDir = treeObj.getNodeByParam("ntype", "cdir", null);
            treeObj.selectNode(fistChildDir);
            var fileNodes = fistChildDir.children;
            $.coolalbum.directoryId=fistChildDir.id;

            $.coolalbum.showFileList(fileNodes, function () {
                $.coolalbum.showListMsg(fistChildDir.name, fileNodes.length);
            });

            var setting = {
                view: {
                    showLine: false,
                },
                //上级id相同分层
                data: {
                    simpleData: {
                        enable: true
                    },
                },
                callback: {
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false,
                    drap:{
                        isCopy:false,
                        isMove:true,
                        prev:true,
                        next:true,
                        inner: true,
                    }
                }
            };
            var dTreeObj = $.fn.zTree.init($("#directTree"), setting, directNodes);//初始化树
            $.fn.zTree.getZTreeObj("#directTree");//把得到的树赋给div

            $.dataTrans.directNodes = directNodes;


            $.coolalbum._init({
                onCheckAll:function () {

                },
                onUpload:function () {

                },
                onUploadSure: function () {

                },
                onMove:function () {

                },
                onMoveSure: function (files, target) {
                    console.log(files);
                    console.log(target);
                },
                onDownLoad:function () {

                },
                onDelete:function () {

                },
                onSortSave:function () {

                },
                onSortRest:function () {

                }
            });

        }
    });*/

  var showing = true;
  $(".taggle").click(function() {
    if (showing) {
      $(".taggle")
        .find(".taggle-hidden")
        .addClass("thidden");
      $.treeOp.hiddenEmpty();
      showing = false;
      $(".taggle-text").text("显示空目录");
    } else {
      $(".taggle")
        .find(".taggle-hidden")
        .removeClass("thidden");
      $.treeOp.showEmpty();
      showing = true;
      $(".taggle-text").text("隐藏空目录");
    }
  });
  $(".newdir").click(function() {
    $.treeOp.openAddDirect();
  });
  $(".xiangqing").click(function() {
    layer.msg($.dataTrans.layermsg);
  });
  var expand = false; //默认非展示全部
  $(".expand").click(function() {
    var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
    treeObj.expandAll(true);
  });
  $(".collapse-btn").click(function() {
    var treeObj = $.fn.zTree.getZTreeObj("demoZtree");
    treeObj.expandAll(false);
  });

  $(".base").click(function() {
    if (!$(".base").hasClass("select-tab")) {
      $(".base").addClass("select-tab");
    }
    $(".tab-box li").removeClass("select-tab");
    $(".base").toggleClass("select-tab");
    /*$(".base-info").css({
            display:"block"
        });
        $(".detail-info").css({
            display:"none",
        });
        $(".dispute-info").css({
            display:"none",
        });*/

    $(".tab-tail").removeClass("active");
    $(".base-info").toggleClass("active");
  });
  $(".detail").click(function() {
    if (!$(".detail").hasClass("select-tab")) {
      $(".detail").addClass("select-tab");
    }
    $(".tab-box li").removeClass("select-tab");
    $(".detail").toggleClass("select-tab");

    /*$(".base-info").css({
            display:"none",
        });
        $(".detail-info").css({
            display:"block",
        });
        $(".dispute-info").css({
            display:"none",
        });*/
    $(".tab-tail").removeClass("active");
    $(".detail-info").toggleClass("active");
  });

  $.toolBtn = new ToolBtn();
  $.toolBtn.drawBtn();
  
  // if ($.dataTrans.caseInfo.case_type_id == rulingTypeId) {
  //   //执行案件显示执行线索
  //   $.rulingCompose.init();
  // } else {
  //   $(".ruling-tab").hide();
  // }
});
