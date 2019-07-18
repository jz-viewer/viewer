var DisptAlbum = function () {
    var self = this;

    self.jDom;
    self.setting = {
        source:".dispute-album"
    }
    self.backMethod= {};
}
DisptAlbum.prototype = {
    init: function (setting) {
        var self = this;
        if(typeof setting.source=='string'&&setting.source!=""){
            self.setting.source=setting.source;
            self.jDom = $(self.setting.source);
        }else if(typeof setting.source=='undefind'||setting.source==""){
            self.jDom = $(self.setting.source);
        }else{
            self.jDom = $(self.setting.source);
        }
        if(typeof setting.getFileInfo === "function"){
            self.backMethod.getFileInfo=setting.getFileInfo;
        }
        if(typeof setting.dataGetFileList === "function"){
            self.backMethod.dataGetFileList=setting.dataGetFileList;
        }
        if(typeof setting.dataAddRelate === "function"){
            self.backMethod.dataAddRelate=setting.dataAddRelate;
        }
        if(typeof setting.dataCancelRelate === "function"){
            self.backMethod.dataCancelRelate=setting.dataCancelRelate;
        }

        self.initBtnTool();
        self.initCheckTool();

        self.bind();
        self.scale = 1;
    },
    showDisputeMsg: function (id, simple, detail) {
        $(".dispute-simple-t").text(simple);
        $(".dispute-detail-t").text(detail);

        var $simpleDiv = $(".dispute-simple-t").parent("div");
        $simpleDiv.attr("id", id);
    },
    bind: function () {
        var self = this;

        $(".dispute-info").delegate(".rm-dispute-btn", "click", function () {
            var dispute = $(this).parent("div");

            $.dispute.onDisputeToRemove(dispute, function () {
                var issues_id = dispute.attr("id");
                $.disputeData.getDisputeList($.dataTrans.caseInfoId);

                var disputeList = $.disputeData.getTDisputeList();
                $.dispute.showDisputeList(disputeList);

                if(disputeList&&disputeList.length>0){
                    var disputeData = disputeList[0];
                    var disputeJdom = $(".dispute-div[id="+disputeList[0].issues_id+"]");
                    disputeJdom.trigger("click");
                    disputeJdom.addClass("active");
                    self.showDisputeMsg(disputeData.issues_id, disputeData.issues_simpledescription, disputeData.issues_detaileddescription);
                }else {
                    self.showDisputeMsg("", "", "");
                }

/*

                self.showDisputeMsg(disputeData.issues_id, disputeData.issues_simpledescription, disputeData.issues_detaileddescription);*/
                /*self.showFileDisputeWindow();*/
            });
        });
        $(".dispute-info").delegate(".correlate-btn", "click", function () {
            var disputeJDom = $(this).parent("div");

            var disputeId = disputeJDom.attr("id");
            $.disputeData.setTCurrentDispute($.disputeData.getDisputeById(disputeId));
            $.disputeData.setTCurrentDisputeJDom(disputeJDom);

            $.dispute.onDisputeToCorrelate();
        });
        $(".dispute-info").delegate(".to-edit-btn", "click", function () {
            var dispute = $(this).parent("div");

            var issues_id=dispute.attr("id");
            var issues = $.disputeData.getDisputeById(issues_id);

            var $disputeTEdit = $("<div class='dispute-window'>\n" +
                "        <div class='' >\n" +
                "            <div class='dispute-open-title' style=''><span>争议焦点</span></div>" +
                "            <div class='open-dipcontent item'>" +
                "            <div class='simple-label'><span>争议点&nbsp;&nbsp;</span><span class='warn-msg' style='color:#a99f9f '>【最多25字符】</span><span class='input-msg'></span>" +
                "            </div>" +
                "            <div class='simple-input'><input style='width: 470px;' placeholder='' maxlength='25' value='"+issues.issues_simpledescription+"'>" +
                "            </div>" +
                "            <div class='detail-label'>争议点描述" +
                "            </div>" +
                "            <div class='detail-input'><textarea style='width: 470px;height:280px;' value='"+issues.issues_detaileddescription+"'>"+issues.issues_detaileddescription+"</textarea>" +
                "            </div>" +
                "            </div>" +
                "            <div class='' style='bottom: 0px;right: 0px;'>" +
                "                <button class='open-btn open-t-close' style=''>关闭</button>" +
                "                <button class='open-btn open-t-save' style=''>保存</button>" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>");

            var $shlter = $("<div style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;" +
                "z-index: 20;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>");
            $("body").append($disputeTEdit);
            $("body").append($shlter);

            $disputeTEdit.find(".open-t-close").bind("click", function () {
                $disputeTEdit.remove();
                $shlter.remove();
            });
            $disputeTEdit.find(".open-t-save").bind("click", function () {
                var disputeData = new Object();
                disputeData.issues_id=dispute.attr("id");
                disputeData.issues_simpledescription=$disputeTEdit.find(".simple-input input").val();
                disputeData.issues_detaileddescription=$disputeTEdit.find(".detail-input textarea").val();
                if(disputeData.issues_simpledescription&&disputeData.issues_simpledescription.length>25){
                    $disputeTEdit.find(".warn-msg").text("最多25字符");
                }else {
                    $disputeTEdit.find(".input-msg").text("已输入"+disputeData.issues_simpledescription.length);
                }
                $.disputeData.updateDispute(disputeData, function () {
                    $disputeTEdit.remove();
                    $shlter.remove();
                    $.disputeData.getDisputeList($.dataTrans.caseInfoId);

                    $.dispute.showDisputeList($.disputeData.getTDisputeList());

                    self.showDisputeMsg(disputeData.issues_id, disputeData.issues_simpledescription, disputeData.issues_detaileddescription);
                });
            });

        });

        self.jDom.delegate(".add-correlate", "click", function () {
            if(typeof self.backMethod.dataAddRelate === "function"){
                /*self.backMethod.dataAddRelate(function () {
                    self.addCorrelate();
                });*/
                self.addCorrelate();
            }else {
                self.addCorrelate();
            }
        });
        self.jDom.delegate(".remove-correlate", "click", function () {
            if(typeof self.backMethod.dataCancelRelate === "function"){
                self.removeCorrelate();
            }else {
                self.removeCorrelate();
            }
        });

        self.jDom.delegate(".dir_a", "click", function () {
            var id = $(this).attr("id");
            var jDir = $.dataTrans.dirsMap.get(parseInt(id));
            self.showDirList(jDir);
        });
        self.jDom.delegate(".quit-correlate", "click", function () {
            var dispute = $.disputeData.getTCurrentDispute();
            var disputeJDom = $.disputeData.getTCurrentDisputeJdom();

            layer.msg("退出关联+，返回争议点文件列表");
            $.disptAlbum.showDisputeFileList(dispute.file_id, disputeJDom);

            $.disptAlbum.showListMsg(dispute.issues_simpledescription, dispute.file_id.length);

        });
        self.jDom.delegate(".album-file-list .icon-list-check", "click", function (event) {
            event.stopPropagation();//阻止事件冒泡即可

            self.onCheck(this);
        });
        self.jDom.delegate(".album-check-tool .icon-list-check", "click", function (event) {
            event.stopPropagation();//阻止事件冒泡即可

            self.onAllCheck(this);
        });

        self.jDom.delegate(".list-file", "click", function (event) {
            event.stopPropagation();//阻止事件冒泡即可

            var id = $(this).find("input").val();
            var dir = $.dataTrans.dirsMap.get(parseInt(id));
            if(typeof dir!="undefined"&&dir!=null&&dir!=""){
                self.onFolderClick(dir);
            }
            var fileInfo = $.dataTrans.filesMap.get(id);
            if(typeof fileInfo!="undefined"&&fileInfo!=null&&fileInfo!=""){
                self.onFileClick(fileInfo);
            }
            $(".list-file.selected").removeClass("selected");
            $(this).addClass("selected");
        });
        $(".dispute-info .p-big").click(function () {

            var jObj = $.disputeData.fileInfo;
            if(typeof jObj == "undefined" || jObj == null || jObj == ""){
                console.log("加载文件为空");
                return;
            }
            self.scale = self.scale*1.25;

            if(jObj.ftype=="pic"){
                var $img = $("#dis-fileBox").find("img");
                $img.css({
                    width: 565*self.scale,
                    height: 800*self.scale,
                });
            }
            self.relocate(1);
        });
        $(".dispute-info .small").click(function () {

            var jObj = $.disputeData.fileInfo;
            if(typeof jObj == "undefined" || jObj == null || jObj == "" || jObj == {}){
                console.log("加载文件为空");
                return;
            }
            self.scale = self.scale*0.8;

            if(jObj.ftype=="pic"){
                var $img = $("#dis-fileBox").find("img");
                $img.css({
                    width: 565*self.scale,
                    height: 800*self.scale,
                });
            }
            self.relocate(-1);
        });

        self.jDom.delegate(".dir-a", "click", function () {
            var id = $(this).attr("id");
            var jDir = $.dataTrans.dirsMap.get(id);
            self.showDirList(jDir);
        });
    },
    initBtnTool: function () {
        var self = this;

        var $albumTool = self.jDom.find(".disp-album-tool");
        $albumTool.append("<span class='tool-btn add-correlate' style='margin-left: 15px;'>加入关联</span>");
        $albumTool.append("<span class='tool-btn remove-correlate' style='margin-left: 15px;'>取消关联</span>");
        $albumTool.append("<span class='tool-btn quit-correlate' style='margin-left: 15px;'>退出关联操作</span>");
    },
    initCheckTool: function () {
        var self = this;

        var $albumCheck = self.jDom.find(".album-checkl");
        $albumCheck.append("<input class='file-check' id='all-dispute-check' style='vertical-align:middle;width: 18px;height: 18px;display: none;' type='checkbox'>" +
            "<button class='icon-list-check' style=''></button><span style='padding-left: 15px;'>全选</span><span style='padding:0 3px;'>|</span><span class='area-gr'></span>");
    },
    showDisputeFileList: function (fileIdList, item) {
        var self = this;

        var $albumList = self.jDom.find(".album-file-list");
        $albumList.empty();

        $(".add-correlate").hide();
        $(".quit-correlate").hide();
        $(".remove-correlate").show();

        var dTitel = $(item).find(".dispute-a").text();
        var target = self.jDom.find(".area-gr");
        target.text("争议点->"+dTitel);

        fileIdList.forEach(function (item, index) {
            var fileId = item;
            var fileInfo = self.backMethod.getFileInfo(fileId)
            if(typeof fileInfo == "undefined"){
                console.warn("cannot find fileid:"+fileId);
                return;
            }
            console.log(JSON.stringify(fileInfo));

            var $checkbox = $("<div index='"+index+"' class='cool-file list-file' title='"+fileInfo.fileName+"'>" +
                "<input type='checkbox' style='vertical-align:middle;display: none;' fileIndex='"+fileInfo.fileDirectoryIndex+"' osrc='"+fileInfo.osrc+"' ftype='"+fileInfo.ftype+"' value='"+fileInfo.fileId+"' name='"+fileInfo.fileName+"' scid='"+fileInfo.subCaseId+"'>" +
                "<button class='icon-list-check' style=''></button>"+
                "<img style='' src='"+fileInfo.icon+"' icon='"+fileInfo.icon+"' imgsrc='"+fileInfo.imgsrc+"' osrc='"+fileInfo.osrc+"'>" +
                "<span style='text-overflow:ellipsis;word-break: keep-all;width: 121px;overflow:hidden;text-align:center;'>" +fileInfo.fileName+"</span>"+
                "</div>");
            $albumList.append($checkbox);
        });
    },
    showDirList: function (dir) {
        var dirList = dir.children;
        var fileInfoList = dir.files;
        var self = this;

        var $albumList = self.jDom.find(".album-file-list");
        $albumList.empty();

        $(".add-correlate").show();
        $(".quit-correlate").show();
        $(".remove-correlate").hide();

        var isCase=false;
        var parentId=0;
        if(dirList){
            for(var i=0;i<dirList.length;i++){
                var childDir = dirList[i];
                var icon;
                if(childDir.children&&childDir.children.length>0){
                    icon = "css/zTreeStyle/img/diy/folder_close.png";
                }else if(childDir.files&&childDir.files.length>0){
                    icon = "css/zTreeStyle/img/diy/folder_close.png";
                }else {
                    icon = "css/images/folder-nouse.png"
                }
                var $checkbox = $("<div index='"+i+"' class='cool-folder list-file' title='"+childDir.directory_name+"'>" +
                    "<input type='checkbox' style='vertical-align:middle;display: none;' value='"+childDir.directory_id+"' name='"+childDir.directory_name+"'>" +
                    "<button class='icon-list-check' style=''></button>"+
                    "<img style='' src='"+icon+"'>" +
                    "<span style='text-overflow:ellipsis;word-break: keep-all;width: 121px;overflow:hidden;text-align:center;'>" +childDir.directory_name+"</span>"+
                    "</div>");

                if(i==0&&childDir.parent_id==0){
                    isCase =true;
                }else {
                    parentId=childDir.parent_id;
                }

                $albumList.append($checkbox);
            }
        }
        if(fileInfoList){
            var dispute = $.disputeData.getTCurrentDispute();
            fileInfoList.forEach(function (item, index) {

                var fileInfo = item;
                console.log(JSON.stringify(fileInfo));

                var $checkbox = $("<div index='"+index+"' class='cool-file list-file' title='"+fileInfo.fileName+"'>" +
                    "<input type='checkbox' style='vertical-align:middle;display: none;' fileIndex='"+fileInfo.fileDirectoryIndex+"' osrc='"+fileInfo.osrc+"' ftype='"+fileInfo.ftype+"' value='"+fileInfo.fileId+"' name='"+fileInfo.fileName+"' scid='"+fileInfo.subCaseId+"'>" +
                    "<button class='icon-list-check' style=''></button>"+
                    "<img style='' src='"+fileInfo.icon+"' icon='"+fileInfo.icon+"' imgsrc='"+fileInfo.imgsrc+"' osrc='"+fileInfo.osrc+"'>" +
                    "<span style='text-overflow:ellipsis;word-break: keep-all;width: 121px;overflow:hidden;text-align:center;'>" +fileInfo.fileName+"</span>"+
                    "</div>");
                $albumList.append($checkbox);
                if(dispute.file_id.indexOf(fileInfo.fileId)>0){
                    $checkbox.find(".icon-list-check").addClass("no-click");
                    self.onCheck($checkbox.find("input")[0]);
                }

                parentId=fileInfo.directoryId;
            });
        }

        var dTitel;
        var target = self.jDom.find(".area-gr");
        /*target.text("争议点->"+dTitel);*/
        target.empty();
        var caseInfo = $.dataTrans.caseInfo;
        var case_name = caseInfo.case_name;
        var caseSpan = $("<span id='0' class='dir_a'></span>");
        if(isCase){
            /*dTitel=case_name*/
            target.append(case_name);
        }else {
            caseSpan.text(case_name);
            target.append(caseSpan);
            target.append("->"+$.dataTrans.dirsMap.get(parentId).directory_name);
        }

        console.log("显示目录列表操作");
    },
    showFileList: function (fileInfoList) {
        var self = this;

        var $albumList = self.jDom.find(".album-file-list");
        $albumList.empty();

        var dispute = $.disputeData.getTCurrentDispute();

        var parentId;
        fileInfoList.forEach(function (item, index) {

            var fileInfo = item;
            console.log(JSON.stringify(fileInfo));

            var $checkbox = $("<div index='"+index+"' class='cool-file list-file' title='"+fileInfo.fileName+"'>" +
                "<input type='checkbox' style='vertical-align:middle;display: none;' fileIndex='"+fileInfo.fileDirectoryIndex+"' osrc='"+fileInfo.osrc+"' ftype='"+fileInfo.ftype+"' value='"+fileInfo.fileId+"' name='"+fileInfo.fileName+"' scid='"+fileInfo.subCaseId+"'>" +
                "<button class='icon-list-check' style=''></button>"+
                "<img style='' src='"+fileInfo.icon+"' icon='"+fileInfo.icon+"' imgsrc='"+fileInfo.imgsrc+"' osrc='"+fileInfo.osrc+"'>" +
                "<span style='text-overflow:ellipsis;word-break: keep-all;width: 121px;overflow:hidden;text-align:center;'>" +fileInfo.fileName+"</span>"+
                "</div>");
            $albumList.append($checkbox);
            if(dispute.file_id.indexOf(fileInfo.fileId)>0){
                $checkbox.find(".icon-list-check").addClass("no-click");
                self.onCheck($checkbox.find("input")[0]);
            }

            parentId=fileInfo.directoryId;
        });


        var dTitel;
        var target = self.jDom.find(".area-gr");
        /*target.text("争议点->"+dTitel);*/
        var caseInfo = $.dataTrans.caseInfo;
        var case_name = caseInfo.case_name;
        var parentDir = $.dataTrans.dirsMap.get(parentId);
        var jDir = $.dataTrans.dirsMap.get(parentDir.parent_id);

        var caseSpan = $("<span id='0' class='dir_a' style='color: #508aed'></span>");
        caseSpan.text(case_name);
        target.append(caseSpan);

        dTitel=case_name+"->->"+parentDir.directory_name;
        target.empty();

        target.append(caseSpan);
        target.append("->");
        var $a = $("<span id='"+jDir.directory_id+"' class='dir_a'>"+jDir.directory_name+"</span>");
        target.append($a);
        target.append("->"+parentDir.directory_name);
        /*target.html(dTitel);*/

        console.log("显示目录文件操作");
    },
    showListMsg: function (directname, fileLength) {
        $(".album-dmsg").text(directname);
        $(".album-fmsg").text(fileLength);
        if($.dataTrans.fullSearchStatus){
            $(".dispute-info .area-gr").html("全文搜索<span style='padding:0 5px;'>></span>"+directname);
        }else {
            $(".dispute-info .area-gr").text(directname);
        }
    },
    removeCorrelate: function () {
        var self = this;
        console.log("相册取消关联操作");

        var disputeJDom = $.disputeData.getTCurrentDisputeJdom();
        var id = disputeJDom.attr("id");
        var dispute = $.disputeData.getDisputeById(id);

        console.log(JSON.stringify(dispute));

        var issuesRelate = new Object();
        issuesRelate.issues_id=dispute.issues_id;

        var files = [];

        var $checkbox = self.jDom.find("input:checked");
        $checkbox.each(function () {
            console.log($(this).val());
            var file_id=$(this).val();
            files.push(file_id);
        });
        issuesRelate.file_id=files;

        if(typeof self.backMethod.dataCancelRelate === "function"){
            self.backMethod.dataCancelRelate(issuesRelate, function () {
                $checkbox.parent(".list-file").remove();

                $.disputeData.getDisputeList($.dataTrans.caseInfoId);
            });
        }
    },
    addCorrelate: function () {
        var self = this;
        console.log("相册关联文件操作");

        var disputeJDom = $.disputeData.getTCurrentDisputeJdom();
        var id = disputeJDom.attr("id");
        var dispute = $.disputeData.getDisputeById(id);

        console.log(JSON.stringify(dispute));

        var issuesRelate = new Object();
        issuesRelate.issues_id=dispute.issues_id;
        issuesRelate.case_id=$.dataTrans.caseInfoId;

        var files = [];

        var $checkbox = self.jDom.find("input:checked");
        $checkbox.each(function () {
            if(this.id=="all-dispute-check"){
                return;
            }
            console.log($(this).val());
            var fileInfo = new Object();
            fileInfo.file_id=$(this).val();
            fileInfo.sub_case_id=$(this).attr("scid");
            files.push(fileInfo);
        });
        issuesRelate.fileinfo=files;

        if(typeof self.backMethod.dataAddRelate === "function"){
            self.backMethod.dataAddRelate(issuesRelate, function () {
                layer.msg("关联成功，返回争议点文件列表");
                $.disputeData.getDisputeList($.dataTrans.caseInfoId);
                $("#"+dispute.issues_id).find(".dispute-a").trigger("click")
            });
        }
    },
    onCheck: function (item) {
        var self = this;

        console.log("点击复选框操作");
        if($(item).hasClass("no-click")){
            return;
        }
        if($(item).parents(".list-file").hasClass("cool-folder")){
            layer.msg("不允许选择目录");
            return;
        }

        var $check = $(item).parent().find("input");
        var isCheck = $check.prop("checked");
        var newChecked = !isCheck;
        $check.prop("checked",newChecked);
        if(newChecked){
            $(this).parent().addClass("checked");
        }else {
            $(this).parent().removeClass("checked");
        }
        if(self.jDom.find(".album-file-list").find("input:not(:checked)").length==0){
            $("#all-dispute-check").prop("checked",true);
        }else {
            $("#all-dispute-check").prop("checked",false);
        }
    },
    onAllCheck: function (item) {
        var self = this;
        console.log("点击全选复选框操作");

        //重置全选状态
        var isNchecked = $("#all-dispute-check").prop("checked");
        var ischecked = !isNchecked;

        $("#all-dispute-check").prop("checked",ischecked);
        self.jDom.find(".album-file-list").children("div.cool-file").find("input").prop("checked",ischecked);
        if(ischecked){
            self.jDom.find(".album-file-list").children("div.cool-file").addClass("checked");
        }else {
            self.jDom.find(".album-file-list").children("div.cool-file").removeClass("checked");
        }
    },
    onFolderClick:function (dir) {
        var self = this;
        console.log("点击目录");

        if(dir.children&&dir.children.length>0){
            self.showDirList(dir);
        }else {
            self.showFileList(dir.files);
        }
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

            var left = $("#dis-fileBox").find("img")[0].offsetLeft;
            var top = $("#dis-fileBox").find("img")[0].offsetTop;

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
    },
    onFileClick: function (fileInfo) {
        console.log("点击文件");

        $.disputeData.fileInfo = fileInfo;

        $(".dis-fnmsg").text(fileInfo.fileName);

        $("#dis-fileBox").empty();
        if(typeof fileInfo == "undefined" || fileInfo == null || fileInfo == ""){
            console.log("加载文件为空");
        }
        if(fileInfo.ftype=="pic"){
            $(".panno").show();
            $(".p-big").show();
            $(".small").show();
            $(".taggle-anno").show();
            $("#dis-fileBox").append("<div style='display: inline;'></div>");
            $("#dis-fileBox").children("div").append("<img width='565' height='800' src='"+fileInfo.osrc+"'>");
            $("body").append("<div class='cshelter' style='width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;z-index: 100;display:none;background-color: #777;opacity: 0.5;filter:alpha(opacity=60);-moz-opacity: 0.5;'></div>");
            $("body").append("<div id='canvasBox' style='position:absolute;top:50%;left: 50%;margin-top:-400px;margin-left:-282px;width:565px;height:860px;z-index: 200;display: none;'>" +
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
                "</div>");

            var annoData = $.dataTrans.caseAnno[fileInfo.fileId];
            if(typeof annoData != "undefined"&&annoData!="undefined"&&annoData!=""){

                for(var i=0;i<annoData.length;i++){
                    var $fnote = $.fnote.createNote(annoData[i].fileAnnotationId, annoData[i].abscissa, annoData[i].ordinate, $("#dis-fileBox").find("img")[0].offsetLeft, $("#dis-fileBox").find("img")[0].offsetTop, annoData[i].content);
                    $("#dis-fileBox").append($fnote);
                }

            }
        }else if(fileInfo.ftype=="pdf"){

            $(".panno").hide();
            $(".p-big").hide();
            $(".small").hide();
            $(".taggle-anno").hide();

            $("#dis-fileBox").append("<div id='pdfbox' style='text-align:center;width: 664px;height: 800px;'></div>");
            var options = {
                pdfOpenParams: {
                },
            };

            PDFObject.embed(fileInfo.osrc, "#pdfbox", options);
        }else if(fileInfo.ftype=="doc"){
            $(".panno").hide();
            $(".p-big").hide();
            $(".small").hide();
            $(".taggle-anno").hide();
            $("#dis-fileBox").append("<div id='pdfbox' style='text-align:center;width: 664px;height: 800px;'></div>");
            PDFObject.embed(fileInfo.osrc, "#pdfbox");
        }else if(fileInfo.ftype=="excel"){
            $(".panno").hide();
            $(".p-big").hide();
            $(".small").hide();
            $(".taggle-anno").hide();
            $("#dis-fileBox").append("<div id='dis-excelbox' style='text-align:center;width: 664px;height: 800px;'></div>");

            $('#dis-excelbox').load('/court/files/downLoadExcel/?fileId='+fileInfo.fileId+"&subCaseId="+fileInfo.subCaseId, function(responseTxt,statusTxt,xhr){
                if(statusTxt=="success"){
                    if(responseTxt==""){
                        $('#dis-excelbox').html("加载失败");
                    }
                }
                if(statusTxt=="error"){
                    $('#dis-excelbox').html("加载失败");
                    layer.msg("加载失败");
                }
            });
            /*PDFObject.embed(fileInfo.osrc, "#pdfbox");*/
        }else{
            $(".panno").hide();
            $(".p-big").hide();
            $(".small").hide();
            $(".taggle-anno").hide();
            $("#dis-fileBox").append("<div id='mediabox' style='text-align:center;width: 664px;height: 300px;'>" +
                "<video autoplay controls src='"+fileInfo.osrc+"'></video>" +
                "</div>");
        }
    }
}
$.disptAlbum = new DisptAlbum();