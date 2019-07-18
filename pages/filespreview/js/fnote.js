var Fnote = function () {
    self.domMap = new Map();
}
Fnote.prototype = {
    createNote: function (fileAnnotationId, x, y, left, top, content) {
        var fnote = this;
        var annoId = "";
        if(typeof fileAnnotationId!="undefined"&&fileAnnotationId!="undefined"&&fileAnnotationId!=""){
            annoId = fileAnnotationId;
        }

        var $dom = $("<div class='fnote' annoId='"+annoId+"' x='"+x+"' y='"+y+"'><div>" +
                "<div class='open-title'>" +
                    "<span>批注</span>" +
                    "<span class='tool-btn anno-mini' style='position: absolute;right:40px;margin-top:0px;margin-bottom: 0px;'><button class='icon-mini'></button></span>" +
                    "<span class='tool-btn anno-del' style='position: absolute;right:20px;margin-top:0px;margin-bottom: 0px;'><button class='icon-delete'></button></span>"+
                    "<span class='tool-btn anno-save' style='position: absolute;right:0px;margin-top:0px;margin-bottom: 0px;'><button class='icon-save'></button></span>"+
                "</div>" +
            "<div class='open-body'></div>" +
            "</div></div>");
        $dom.css({
            top: parseFloat(y)+top,
            left: parseFloat(x)+left
        });
        $dom.find(".open-body").append("<textarea style='width: 180px;height: 100px;'>"+content+"</textarea>");

        return $dom;
    },
    refreshFNote: function (fileid, fileBoxid) {
        var annoData = $.dataTrans.caseAnno[fileid];
        if(typeof annoData != "undefined"&&annoData!="undefined"&&annoData!=""){
            $("#"+fileBoxid).find(".fnote").remove();
            for(var i=0;i<annoData.length;i++){
                var $fnote = $.fnote.createNote(annoData[i].fileAnnotationId, annoData[i].abscissa, annoData[i].ordinate, $("#"+fileBoxid).find("img")[0].offsetLeft, $("#"+fileBoxid).find("img")[0].offsetTop, annoData[i].content);
                $("#"+fileBoxid).append($fnote);
            }

        }
    },
    annoListBind: function (parentJDom) {
        parentJDom.delegate(".anno-list", "mousemove", function (event) {
            var $annoList = $(this);
            if($annoList.hasClass("nodata")){
                return;
            }
            var fileId = $annoList.siblings("input").val();

            $(".anno-list-div").remove();

           var top = this.offsetTop;
            var left = this.offsetLeft+45;

            top += $(this).parent()[0].offsetTop;
            left += $(this).parent()[0].offsetLeft;


            /*top += $(".file-list")[0].offsetTop;
            left += $(".file-list")[0].offsetLeft;*/


            /*var $annoList = $(this);*/
            var $annoList = $(".file-list");
            $annoList.after("<div class='anno-list-div' style='position: absolute;top:"+top+"px;left:"+left+"px;background-color: white;border: solid 1px #333333;width: 200px;height: 200px;z-index: 3;'>" +
                "<div style='background-color: #d9e7ff; height: 5px;'>" +
                "</div>" +
                "</div>");

            var annoData = $.dataTrans.caseAnno[fileId];
            if(typeof annoData != "undefined"&&annoData!="undefined"&&annoData!=""){
                var $ul = $("<ul></ul>");
                for(var i=0;i<annoData.length;i++){
                    $ul.append("<li>"+annoData[i].content+"</li>");
                }
                $(".anno-list-div").append($ul);
            }
        })

        parentJDom.delegate(".anno-list", "mouseleave", function (e) {
            $(".anno-list-div").remove();
        });
        /*parentJDom.delegate(':not(.anno-list)','click', function () {
            if($(this).parents(".anno-list").length>0){
                return;
            }else {
                /!*$(".anno-list-div").remove();*!/
            }
        });
        parentJDom.delegate(".icon-close", "click", function (e) {
            e.stopPropagation();
            var $annoListDiv = $(this).parents("anno-list-div");
            $annoListDiv.remove();
        });*/
        /*parentJDom.delegate(".anno-list", "mouseout", function () {
            var $annoList = $(this);
            $annoList.siblings(".anno-list-div").remove();

        })*/
    },
    annoBtnBind: function(parentJDom){
        var self = this;
        parentJDom.delegate(".fnote .anno-mini", "click", function () {
            var $fnote=$(this).parents(".fnote");
            $fnote.addClass("mini");
        })
        parentJDom.delegate(".fnote.mini", "click", function () {
            var $fnote=$(this);
            $fnote.removeClass("mini");
        })
        parentJDom.delegate(".fnote .anno-del", "click", function () {
            var $fnote=$(this).parents(".fnote");

            var annoId = $fnote.attr("annoId");
            if(annoId&&annoId!=""){
                $.dataTrans.deleteAnno(annoId, function (code) {
                    if(code&&code=="0"){
                        $fnote.remove();
                        layer.msg("批注删除成功");

                        var jObj = $.fileExt.curJObj;
                        //获取批注信息并刷新数据
                        $.dataTrans.getCaseAnno($.dataTrans.caseInfoId, function (data) {
                            $.dataTrans.caseAnno = data;

                            //判断相册图标是否无批注图标
                            var annoData = $.dataTrans.caseAnno[jObj.fileId];
                            if(typeof annoData=="undefined"||annoData==null||annoData.length==0){
                                var coolFileInput = $(".file-list").find("input[value="+jObj.fileId+"]");
                                var coolFile = coolFileInput.parent();
                                coolFile.find(".anno-list").addClass("nodata");
                            }
                        });
                    }else {
                        layer.msg("批注删除失败");
                    }
                })
            }else{
                $fnote.remove();
            }
        })
        parentJDom.delegate(".fnote .anno-save", "click", function () {
            var $fnote=$(this).parents(".fnote");

            var annoObj = new Object();
            var annoId = $fnote.attr("annoId");
            if(annoId&&annoId!=""){
                annoObj.fileAnnotationId=annoId;
            }
            annoObj.content=$fnote.find("textArea").val();
            annoObj.abscissa=$fnote.attr("x");
            annoObj.ordinate=$fnote.attr("y");

            var jObj = $.fileExt.curJObj;
            annoObj.subCaseId = jObj.subCaseId;
            annoObj.fileId = jObj.fileId;
            annoObj.caseId = jObj.caseId;

            $.dataTrans.saveAnno(annoObj, function (code) {
                if(code&&code=="0"){
                    layer.msg("批注修改成功");

                    //获取批注信息并刷新数据
                    $.dataTrans.getCaseAnno($.dataTrans.caseInfoId, function (data) {
                        $.dataTrans.caseAnno = data;
                        if(annoId&&annoId!=""){
                            return;
                        }else {
                            //新增时需刷新数据，为元素增加id属性
                            self.refreshFNote(jObj.fileId, "fileBox");
                            //判断相册图标是否无批注图标
                            var annoData = $.dataTrans.caseAnno[jObj.fileId];
                            if(annoData&&annoData.length>=1){
                                var coolFileInput = $(".file-list").find("input[value="+jObj.fileId+"]");
                                var coolFile = coolFileInput.parent();
                                coolFile.find(".anno-list").removeClass("nodata");
                            }
                        }
                    });
                }else {
                    layer.msg("批注修改失败");
                }
            })
        })
    },
    relocate: function (ia) {
        //修改批注位置
        var $dom = $(".fnote");
        $dom.each(function (index, item) {
            var t = item;

            /*var top = $(item).css("top");
            var left = $(item).css("left");*/
            var oldX = $(item).attr("x");
            var oldY = $(item).attr("y");
            if(ia>0){
                var newX = parseFloat(oldX)*1.25;
                var newY = parseFloat(oldY)*1.25;
            }else {
                var newX = parseFloat(oldX)*0.8;
                var newY = parseFloat(oldY)*0.8;
            }

            var left = $("#fileBox").find("img")[0].offsetLeft;
            var top = $("#fileBox").find("img")[0].offsetTop;

            $(item).css({
                left: newX+left,
                top: newY+top,
            });
            $(item).attr("x", newX);
            $(item).attr("y", newY);
        });
        /*$dom.css({
            top: y+top,
            left: x+left,
        });*/
    }
}
$.fnote = new Fnote();